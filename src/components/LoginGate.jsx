import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginGate = ({ onSuccess }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Club Member Access</h1>
        <p className="text-slate-600">Please sign in with your college email to continue.</p>
        
        <div className="flex justify-center mt-6">
          <GoogleLogin
            onSuccess={credentialResponse => {
              const decoded = jwtDecode(credentialResponse.credential);
              if (decoded.email.endsWith('@rishihood.edu.in')) { 
                onSuccess(decoded, credentialResponse.credential);
              } else {
                alert("Access Restricted: Please use your college email ID.");
              }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginGate;