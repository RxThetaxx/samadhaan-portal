import { useMemo, useState } from 'react';
import AnonymousForm from './AnonymousForm.jsx';
import PublicForm from './PublicForm.jsx';

const tabs = [
  {
    id: 'anonymous',
    label: 'Anonymous Feedback',
    description: 'Share concerns without revealing your identity.',
  },
  {
    id: 'public',
    label: 'Identified Support',
    description: 'Submit a grievance or request a meeting.',
  },
];

const Layout = () => {
  const [activeTab, setActiveTab] = useState('anonymous');

  const activeCopy = useMemo(() => tabs.find((tab) => tab.id === activeTab), [activeTab]);

  return (
    <section className="-mt-8 space-y-6">
      <div className="rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                'rounded-lg px-4 py-3 text-left transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100',
              ].join(' ')}
            >
              <p className="text-sm font-semibold">{tab.label}</p>
              <p className="text-xs text-slate-300 sm:text-slate-400">{tab.description}</p>
            </button>
          ))}
        </div>
      </div>

      {activeCopy && (
        <div className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{activeCopy.label}</h2>
          <p className="text-sm text-slate-500">{activeCopy.description}</p>
          <div className="mt-6">
            {activeTab === 'anonymous' ? <AnonymousForm /> : <PublicForm />}
          </div>
        </div>
      )}
    </section>
  );
};

export default Layout;
