import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Scan } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate automatic scanning for the demo
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
      style={{ backgroundColor: '#F9F8F1' }}
      className="p-6 flex flex-col items-center justify-center min-h-[85vh]"
    >
      <div className="bg-white p-8 sm:p-12 w-full max-w-sm rounded-[2rem] shadow-2xl flex flex-col items-center text-center border border-slate-100 relative overflow-hidden">
        {/* Biodiversity subtle background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542272201-b1ca555f8505?w=500&q=80)', backgroundSize: 'cover' }}></div>
        <div className="mb-8 p-6 bg-primary-50 rounded-full relative shadow-inner overflow-hidden">
          <Scan size={80} className="text-primary-600 absolute inset-0 m-auto animate-ping opacity-20" />
          <QrCode size={80} className="text-primary-600 relative z-10" />
          
          {/* Enhanced Laser Scan Animation */}
          <motion.div 
            className="absolute left-0 right-0 h-0.5 bg-primary-500 shadow-[0_0_8px_2px_rgba(27,48,34,0.4)] z-20"
            initial={{ top: '10%' }}
            animate={{ top: '90%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </div>
        
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-bold text-primary-700 mb-3 tracking-tight">Scan Park QR</h2>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm">Center the QR code found at the DDA park entrance to launch your smart guide.</p>
        
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4 shadow-inner">
          <motion.div 
            className="bg-primary-500 h-full w-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 4.5, ease: "linear" }}
          ></motion.div>
        </div>
        <p className="text-xs text-primary-600 font-semibold tracking-wide animate-pulse uppercase">Scanning Yamuna Park...</p>
      </div>
    </motion.div>
  );
}

