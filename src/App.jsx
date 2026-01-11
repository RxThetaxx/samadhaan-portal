import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header.jsx';
import Layout from './components/Layout.jsx';
import LoginGate from './components/LoginGate.jsx'; // Make sure this file exists!
import { logUserToBackend } from './utils/api.js';  // Import the logger
import { Toaster } from 'react-hot-toast';

const App = () => {
  // 1. State to track if user is logged in
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 2. PASTE YOUR CLIENT ID HERE (From Google Cloud Console)
  const GOOGLE_CLIENT_ID = "773083507744-63jgskk5q2lvvaqov85ibklso030vq2r.apps.googleusercontent.com"; 

  // 3. What happens when login is successful?
  const handleLoginSuccess = (userData, rawToken) => {
    setUser(userData);
    setToken(rawToken);
    
    // Silently log the user to your private "Users" sheet
    logUserToBackend(userData);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="relative min-h-screen overflow-hidden selection:bg-indigo-500/30">
        
        {/* --- Animated Background (Visible on BOTH Login & Main screens) --- */}
        <div className="fixed inset-0 -z-10 bg-slate-50">
          <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-[100px] mix-blend-multiply opacity-70 animate-blob" />
          <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
        </div>

        {/* --- THE GATEKEEPER LOGIC --- */}
        {!user ? (
          // STATE A: User is NOT logged in -> Show Login Gate
          <LoginGate onSuccess={handleLoginSuccess} />
        ) : (
          // STATE B: User IS logged in -> Show the actual App
          <>
            <Header />
            <main className="relative mx-auto max-w-4xl px-4 pb-16 pt-8">
              {/* Optional: Pass user name to Layout if you want to greet them */}
              <Layout user={user} />
            </main>
          </>
        )}

        <Toaster position="top-center" toastOptions={{
          className: '!bg-white/80 !backdrop-blur-md !border !border-white/20 !shadow-xl !rounded-xl !text-slate-800',
        }} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
