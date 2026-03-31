import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Scan } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate automatic scanning for the demo video
    const timer = setTimeout(() => {
      navigate('/park/yamuna-biodiversity-park');
    }, 4500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="p-6 flex flex-col items-center justify-center min-h-[85vh]"
    >
      <div className="bg-white p-8 sm:p-12 w-full max-w-sm rounded-[2rem] shadow-2xl flex flex-col items-center text-center border border-slate-100">
        <div className="mb-8 p-6 bg-primary-50 rounded-full relative">
          <Scan size={80} className="text-primary-600 absolute inset-0 m-auto animate-ping opacity-20" />
          <QrCode size={80} className="text-primary-600 relative z-10" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Scan Park QR</h2>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm">Center the QR code found at the DDA park entrance to launch your smart guide.</p>
        
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4 shadow-inner">
          <div className="bg-primary-500 h-full w-full origin-left animate-[progress_4.5s_ease-in-out_forwards]"></div>
        </div>
        <p className="text-xs text-primary-600 font-semibold tracking-wide animate-pulse uppercase">Scanning Yamuna Park...</p>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </motion.div>
  );
}
