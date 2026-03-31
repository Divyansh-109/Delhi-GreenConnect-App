import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await login();
      navigate('/events');
    } catch (error) {
      console.error("Failed to login", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className="p-6 flex flex-col items-center justify-center min-h-[85vh] bg-slate-50"
    >
      <div className="bg-white p-8 w-full max-w-sm rounded-[2rem] shadow-xl flex flex-col items-center text-center border border-slate-100">
        <div className="mb-6 p-4 bg-primary-50 rounded-full">
          <Leaf size={48} className="text-primary-600" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2">Join GreenConnect</h2>
        <p className="text-slate-500 mb-8 text-sm">Sign in to post updates, report discoveries, and organize community events.</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl py-3 flex items-center justify-center gap-3 font-bold shadow-sm active:scale-95 transition-all"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </motion.div>
  );
}
