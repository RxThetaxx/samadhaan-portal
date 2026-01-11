import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
// IMPORT BOTH LOGOS
import RuLogo from '../logos/RU_LogoT.png';  // University Logo (Transparent)
import PpcLogo from '../logos/Header_Logo.png'; // Club Logo

const LoginGate = ({ onSuccess }) => {
    return (
        <div className="flex min-h-[85vh] items-center justify-center px-4">

            {/* The Glass Card */}
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-10 shadow-2xl backdrop-blur-xl animate-fade-in-up">

                {/* Decorative background glow inside the card */}
                <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-purple-300/30 blur-2xl"></div>
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-blue-300/30 blur-2xl"></div>

                <div className="relative flex flex-col items-center text-center z-10">

                    {/* --- DUAL LOGO HEADER --- */}
                    <div className="mb-8 flex items-center justify-center gap-5">
                        {/* University Logo */}
                        <img
                            src={RuLogo}
                            alt="University Logo"
                            className="h-16 w-auto object-contain drop-shadow-sm transition-transform hover:scale-110 duration-300"
                        />

                        {/* Divider Line */}
                        <div className="h-10 w-[1.5px] bg-slate-400/40 rounded-full"></div>

                        {/* Club Logo */}
                        <img
                            src={PpcLogo}
                            alt="PPC Logo"
                            className="h-16 w-auto object-contain drop-shadow-sm transition-transform hover:scale-110 duration-300"
                        />
                    </div>

                    {/* Headline */}
                    <h1 className="mb-2 text-3xl font-extrabold text-slate-800 tracking-tight">
                        Samadhan Portal
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-8 text-slate-600 font-medium max-w-[280px] leading-relaxed">
                        Secure grievance redressal system for <br />
                        <span className="text-indigo-600 font-semibold">PPC Club Members</span>
                    </p>

                    {/* Google Button Wrapper */}
                    <div className="w-full flex justify-center transform transition-transform hover:scale-105 duration-200">
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                // Decode the token to get user info immediately
                                const userObj = jwtDecode(credentialResponse.credential);
                                onSuccess(userObj, credentialResponse.credential);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            useOneTap
                            theme="filled_blue"
                            shape="pill"
                            size="large"
                            text="signin_with"
                        />
                    </div>

                    {/* Footer Note */}
                    <p className="mt-8 text-[10px] uppercase tracking-widest text-slate-500 font-semibold opacity-70">
                        Authorized Access Only
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginGate;