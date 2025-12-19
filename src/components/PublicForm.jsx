import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import MeetingScheduler from './MeetingScheduler.jsx';
import { submitToSheet } from '../utils/api.js';

const subNav = [
  { id: 'grievance', label: 'Write Grievance' },
  { id: 'meeting', label: 'Book Meeting' },
];

const initialIdentity = {
  name: '',
  rollNumber: '',
  email: '',
};

const PublicForm = () => {
  const [identity, setIdentity] = useState(initialIdentity);
  const [grievanceText, setGrievanceText] = useState('');
  const [mode, setMode] = useState('grievance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setShowScheduler(false);
  }, [mode]);

  const validateIdentity = () => {
    const validationErrors = {};
    if (!identity.name.trim()) validationErrors.name = 'Name is required.';
    if (!identity.rollNumber.trim()) validationErrors.rollNumber = 'Roll number is required.';
    if (!identity.email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email)) {
      validationErrors.email = 'Enter a valid email address.';
    }
    setErrors((prev) => ({ ...prev, ...validationErrors }));
    return Object.keys(validationErrors).length === 0;
  };

  const validateGrievance = () => {
    const validationErrors = {};
    if (!grievanceText.trim() || grievanceText.trim().length < 10) {
      validationErrors.grievanceText = 'Please describe the issue (min 10 characters).';
    }
    setErrors((prev) => ({ ...prev, ...validationErrors }));
    return Object.keys(validationErrors).length === 0;
  };

  const handleIdentityChange = (event) => {
    const { name, value } = event.target;
    setIdentity((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleGrievanceSubmit = async (event) => {
    event.preventDefault();
    const identityValid = validateIdentity();
    const grievanceValid = validateGrievance();
    if (!identityValid || !grievanceValid) {
      return;
    }
    setIsSubmitting(true);
    try {
      await submitToSheet({
        sheetName: 'sheet_2_public',
        data: {
          name: identity.name,
          roll_number: identity.rollNumber,
          email: identity.email,
          grievance_text: grievanceText.trim(),
        },
      });
      toast.success('Grievance submitted successfully.');
      setGrievanceText('');
    } catch (error) {
      toast.error(error.message || 'Network error, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSchedulerReveal = () => {
    const identityValid = validateIdentity();
    if (identityValid) {
      setShowScheduler(true);
      toast.success('Identity verified. Scheduler unlocked.');
    } else {
      toast.error('Please fix the highlighted fields.');
    }
  };

  const identityFields = useMemo(
    () => [
      { id: 'name', label: 'Name' },
      { id: 'rollNumber', label: 'Roll Number' },
      { id: 'email', label: 'Email', type: 'email' },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-2 sm:flex-row">
        {subNav.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === item.id ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleGrievanceSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {identityFields.map(({ id, label, type = 'text' }) => (
            <div key={id}>
              <label htmlFor={id} className="text-sm font-medium text-slate-700">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                value={identity[id]}
                onChange={handleIdentityChange}
                className={`mt-1 block w-full rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[id] ? 'border-red-300 ring-1 ring-red-500 focus:ring-red-500' : 'border-slate-200'
                }`}
                placeholder={`Enter your ${label.toLowerCase()}`}
              />
              {errors[id] && <p className="mt-1 text-xs text-red-600">{errors[id]}</p>}
            </div>
          ))}
        </div>

        {mode === 'grievance' && (
          <div>
            <label htmlFor="grievanceText" className="text-sm font-medium text-slate-700">
              Grievance Details
            </label>
            <textarea
              id="grievanceText"
              name="grievanceText"
              rows={6}
              value={grievanceText}
              onChange={(event) => {
                setGrievanceText(event.target.value);
                setErrors((prev) => ({ ...prev, grievanceText: undefined }));
              }}
              className={`mt-1 block w-full rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.grievanceText ? 'border-red-300 ring-1 ring-red-500 focus:ring-red-500' : 'border-slate-200'
              }`}
              placeholder="Provide as much context as possible."
            />
            {errors.grievanceText && <p className="mt-1 text-xs text-red-600">{errors.grievanceText}</p>}
          </div>
        )}

        {mode === 'grievance' ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
            )}
            Submit Grievance
          </button>
        ) : (
          <div className="space-y-4 rounded-xl border border-dashed border-blue-200 p-4">
            <p className="text-sm text-slate-600">
              Validate your identity to unlock the scheduling assistant. Once verified, you can
              instantly book a 15-minute slot with the club leadership team.
            </p>
            <button
              type="button"
              onClick={handleSchedulerReveal}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Validate & Show Scheduler
            </button>
            {showScheduler && (
              <MeetingScheduler
                url="https://calendly.com/rishi-a25377-nst/30min"
                prefill={{ name: identity.name, email: identity.email }}
              />
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default PublicForm;
