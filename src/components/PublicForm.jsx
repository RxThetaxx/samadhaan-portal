import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Calendar, ChevronRight, Loader2, Send } from 'lucide-react';
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

    const grievanceData = {
      name: identity.name,
      roll_number: identity.rollNumber,
      email: identity.email,
      grievance_text: grievanceText.trim(),
    };

    try {
      await submitToSheet(grievanceData, 'Public');
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
    <div className="space-y-8">
      {/* Internal Sub-nav */}
      <div className="flex rounded-xl bg-slate-100/50 p-1.5 ring-1 ring-slate-200">
        {subNav.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={`relative flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${mode === item.id ? 'text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {mode === item.id && (
              <motion.div
                layoutId="subTab"
                className="absolute inset-0 rounded-lg bg-white shadow ring-1 ring-black/5"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleGrievanceSubmit} className="space-y-8">
        {/* Identity Section */}
        <div className="grid gap-5 sm:grid-cols-3">
          {identityFields.map(({ id, label, type = 'text' }) => (
            <div key={id} className="space-y-1">
              <label htmlFor={id} className="bg-white px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                value={identity[id]}
                onChange={handleIdentityChange}
                className={`block w-full rounded-xl bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500 ${errors[id] ? 'ring-red-300 focus:ring-red-500' : 'ring-slate-200 hover:ring-slate-300'
                  }`}
                placeholder={`Your ${label}...`}
              />
              {errors[id] && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500">
                  {errors[id]}
                </motion.p>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode='wait'>
          {mode === 'grievance' ? (
            <motion.div
              key="grievance"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <label htmlFor="grievanceText" className="bg-white px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                  className={`block w-full resize-y rounded-xl bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 ${errors.grievanceText ? 'ring-red-300 focus:ring-red-500' : 'ring-slate-200 hover:ring-slate-300'
                    }`}
                  placeholder="Provide as much context as possible so we can help you effectively."
                />
                {errors.grievanceText && (
                  <p className="text-xs text-red-500">{errors.grievanceText}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Submit Grievance</span>
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="meeting"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {!showScheduler ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-100 bg-indigo-50/50 p-8 text-center sm:p-12">
                  <div className="mb-4 rounded-full bg-white p-4 shadow-sm ring-1 ring-indigo-100">
                    <BadgeCheck className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Unlock Scheduling Assistant</h3>
                  <p className="mt-2 max-w-sm text-sm text-slate-500">
                    To prevent spam, please verify your identity fields above. Once verified, you'll see available slots.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0.9 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSchedulerReveal}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-shadow hover:shadow-slate-900/20"
                  >
                    <span>Verify Identity</span>
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      <span>Available Slots</span>
                    </div>
                  </div>
                  <div className="bg-white">
                    <MeetingScheduler
                      url="https://calendly.com/rishi-a25377-nst/30min"
                      prefill={{ name: identity.name, email: identity.email }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default PublicForm;
