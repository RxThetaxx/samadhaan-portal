import { useState } from 'react';
import toast from 'react-hot-toast';
import { submitToSheet } from '../utils/api.js';

const categories = ['General', 'Event Issue', 'Team Conflict', 'Suggestion'];

const AnonymousForm = () => {
  const [formState, setFormState] = useState({ category: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const validationErrors = {};
    if (!formState.category) {
      validationErrors.category = 'Please select a category.';
    }
    if (!formState.message || formState.message.trim().length < 10) {
      validationErrors.message = 'Message should be at least 10 characters.';
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      // FIX: Pass data first, then the sheet name as a second argument string
      await submitToSheet(formState, 'Anonymous'); 
      
      toast.success('Submission received. Thank you!');
      setFormState({ category: '', message: '' });
      setErrors({});
    } catch (error) {
      toast.error(error.message || 'Network error, please try again.');
    } finally {
      setIsSubmitting(false);
    }
};



  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="category" className="text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formState.category}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-300 ring-1 ring-red-500 focus:ring-red-500' : 'border-slate-200'
          }`}
        >
          <option value="" disabled>
            Select concern type
          </option>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formState.message}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.message ? 'border-red-300 ring-1 ring-red-500 focus:ring-red-500' : 'border-slate-200'
          }`}
          placeholder="Share the details you are comfortable disclosing."
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
        )}
        Submit Anonymously
      </button>
    </form>
  );
};

export default AnonymousForm;
