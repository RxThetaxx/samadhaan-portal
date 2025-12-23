import Header from './components/Header.jsx';
import Layout from './components/Layout.jsx';
import { Toaster } from 'react-hot-toast';

const App = () => (
  <div className="relative min-h-screen overflow-hidden selection:bg-indigo-500/30">
    {/* Animated Background Mesh */}
    <div className="fixed inset-0 -z-10 bg-slate-50">
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-[100px] mix-blend-multiply opacity-70 animate-blob" />
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
    </div>

    <Header />
    <main className="relative mx-auto max-w-4xl px-4 pb-16 pt-8">
      <Layout />
    </main>
    <Toaster position="top-center" toastOptions={{
      className: '!bg-white/80 !backdrop-blur-md !border !border-white/20 !shadow-xl !rounded-xl !text-slate-800',
    }} />
  </div>
);

export default App;
