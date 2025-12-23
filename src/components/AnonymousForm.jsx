import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
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
    // Clear error when user starts typing/selecting
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="category" className="bg-white px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Category
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={formState.category}
            onChange={handleChange}
            className={`block w-full appearance-none rounded-xl bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500 ${errors.category ? 'ring-red-300 focus:ring-red-500' : 'ring-slate-200 hover:ring-slate-300'
              }`}
          >
            <option value="" disabled>Select concern type...</option>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {errors.category && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-medium text-red-500">
            {errors.category}
          </motion.p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="bg-white px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formState.message}
          onChange={handleChange}
          className={`block w-full resize-y rounded-xl bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 ${errors.message ? 'ring-red-300 focus:ring-red-500' : 'ring-slate-200 hover:ring-slate-300'
            }`}
          placeholder="Share the details you are comfortable disclosing..."
        />
        {errors.message && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-medium text-red-500">
            {errors.message}
          </motion.p>
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
            <span>Submit Anonymously</span>
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>
    </form>
  );
};

export default AnonymousForm;
