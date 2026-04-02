import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGamification } from '../hooks/useGamification';
import { Share2, LogOut, Award, Star, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const { badges, points } = useGamification();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My GreenConnect Badges',
          text: `I earned ${points} Green Points and ${badges.length} badges exploring Delhi Biodioversity Parks!`,
          url: 'https://greenconnect.dda.gov.in'
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  if (!currentUser) return null;

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-5 sm:p-6 pb-24 bg-slate-50 min-h-screen">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-primary-600 opacity-10"></div>
        <img src={currentUser.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 z-10 relative" />
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{currentUser.name}</h2>
        <p className="text-xs font-medium text-slate-400 mb-5">{currentUser.email}</p>
        
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 px-5 py-2.5 rounded-2xl flex items-center gap-2 font-black text-sm border border-emerald-100 shadow-sm">
          <Star size={18} className="fill-emerald-500 text-emerald-500" /> {points} Green Points
        </div>
      </div>

      <div className="mb-5 flex justify-between items-end px-1">
        <div>
          <h3 className="text-lg font-black text-slate-800">DDA Badges</h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Earned through discovery</p>
        </div>
        <button onClick={handleShare} className="bg-slate-200 text-slate-700 p-2.5 rounded-full hover:bg-slate-300 transition-colors shadow-sm active:scale-95">
          <Share2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {badges.length > 0 ? badges.map((badge, idx) => (
          <div key={idx} className="bg-gradient-to-br from-primary-50 to-emerald-50 border border-primary-100 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary-500 mb-3">
              <Award size={24} />
            </div>
            <span className="text-[11px] font-black text-primary-900 leading-tight tracking-wide">{badge}</span>
          </div>
        )) : (
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Award size={28} className="text-slate-300" />
            </div>
            <p className="text-sm font-black text-slate-600">No badges yet.</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Explore the park map to find hidden points!</p>
          </div>
        )}
      </div>

      <button onClick={logout} className="w-full bg-red-50 text-red-600 font-bold p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors shadow-sm active:scale-95 border border-red-100">
        <LogOut size={18} /> Sign Out Securely
      </button>
    </motion.div>
  );
}
