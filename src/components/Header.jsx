import { ShieldCheck } from 'lucide-react';

const Header = () => (
  <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300">
    <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
      <div className="relative group">
        {/* The Glow Effect (Hidden by default, appears on hover) */}
        <div className="absolute -inset-1 rounded-full bg-indigo-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
        
        {/* The Logo */}
        <img 
          src="/Header_Logo.png" 
          alt="Club Logo" 
          className="relative h-14 w-14 object-contain transition-transform duration-300 group-hover:-translate-y-0.5" 
        />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Samadhan Collective</p>
          <span className="hidden rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600 sm:inline-block">Beta</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Grievance Portal</h1>
      </div>
    </div>
  </header>
);

export default Header;
