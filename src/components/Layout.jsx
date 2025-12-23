import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import AnonymousForm from './AnonymousForm.jsx';
import PublicForm from './PublicForm.jsx';

const tabs = [
  {
    id: 'anonymous',
    label: 'Anonymous Feedback',
    description: 'Share concern privately',
  },
  {
    id: 'public',
    label: 'Identified Support',
    description: 'Get direct resolution',
  },
];

const Layout = () => {
  const [activeTab, setActiveTab] = useState('anonymous');

  const activeCopy = useMemo(() => tabs.find((tab) => tab.id === activeTab), [activeTab]);

  return (
    <section className="space-y-8">
      {/* Glassy Tab Switcher */}
      <div className="mx-auto max-w-md rounded-2xl bg-white/40 p-1.5 shadow-lg shadow-indigo-500/10 backdrop-blur-md ring-1 ring-white/60">
        <div className="grid grid-cols-2 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'relative flex flex-col items-center justify-center rounded-xl py-2.5 text-sm transition-all duration-300',
                activeTab === tab.id ? 'text-indigo-900' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-black/5"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 font-semibold">{tab.label}</span>
              <span className="relative z-10 text-[10px] opacity-80">{tab.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden rounded-3xl bg-white/70 p-6 shadow-xl shadow-indigo-500/5 backdrop-blur-2xl ring-1 ring-white/60 sm:p-10"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              {activeCopy.label}
            </h2>
            <p className="mt-2 text-slate-500">
              {activeTab === 'anonymous'
                ? 'Your identity will remain completely hidden. We value your honest feedback.'
                : 'Share your details for a personalized resolution or to book a meeting.'}
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            {activeTab === 'anonymous' ? <AnonymousForm /> : <PublicForm />}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Layout;
