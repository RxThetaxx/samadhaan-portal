// CORRECT IMPORTS (Do not use 'src/' in the path)
import HeaderLogo from '../logos/Header_Logo.png'; 
import RuLogo from '../logos/RU_LogoT.png';       

const Header = () => (
  <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300">
    <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
      
      {/* LEFT SIDE: Club Logo + Title */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-indigo-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <img
            src={HeaderLogo}
            alt="Club Logo"
            className="relative h-14 w-14 object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Samadhan Collective</p>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Grievance Portal</h1>
        </div>
      </div>

      {/* RIGHT SIDE: University Logo */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 group"> 
        <img
          src={RuLogo}
          alt="University Logo"
          className="relative h-28 w-28 object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
        />
      </div>
      
    </div>
  </header>
);

export default Header;