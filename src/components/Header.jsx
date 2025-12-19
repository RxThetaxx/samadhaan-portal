import { ShieldCheck } from 'lucide-react';

const Header = () => (
  <header className="bg-white shadow-sm">
    <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-6">
      <div className="rounded-2xl bg-slate-900/90 p-3 text-white">
        <ShieldCheck className="h-8 w-8" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm uppercase tracking-wide text-blue-600">Samadhan Collective</p>
        <h1 className="text-2xl font-semibold text-slate-900">Grievance & Feedback Portal</h1>
        <p className="text-sm text-slate-600">Safe, confidential, and prompt support for every club member.</p>
      </div>
    </div>
  </header>
);

export default Header;
