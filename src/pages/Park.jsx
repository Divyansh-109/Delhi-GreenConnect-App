import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, MapPin, AlertTriangle, Wind, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Park() {
  const { currentUser } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const name = currentUser?.name || 'Explorer';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="p-4 sm:p-6 pb-8"
    >
      {/* Hero Greeting with Biodiversity Image */}
      <div className="mb-6 relative rounded-[2rem] overflow-hidden p-6 shadow-md border border-slate-100/50">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800" alt="Forest Canopy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
            {getGreeting()}, <br/> <span className="text-green-300">{name}</span>
          </h2>
          <p className="text-gray-200 font-medium text-sm mt-2 drop-shadow">Welcome back to Yamuna Biodiversity Park.</p>
        </div>
      </div>

      {/* Quick Actions Grid (Bento Box style) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="col-span-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-5 text-white flex justify-between items-center shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer">
          <div>
            <h3 className="font-bold text-lg font-serif">Scan QR Code</h3>
            <p className="text-primary-100 text-xs mt-1">Unlock flora & history details</p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-inner">
            <QrCode size={28} className="text-white animate-[pulse_3s_ease-in-out_infinite]" />
          </div>
        </div>

        <ActionCard title="Nearest Gate" icon={<MapPin size={24} />} color="bg-sage-100 text-primary-700 border border-sage-500/20" />
        <ActionCard title="Report Issue" icon={<AlertTriangle size={24} />} color="bg-vanilla border border-primary-100 text-slate-700 shadow-sm" highlightHover={true} />
      </div>

      {/* Current Park Stats */}
      <h3 className="text-lg font-serif font-bold text-primary-700 mb-3 ml-1">Live Park Status</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard title="Air Quality" value="Good (45)" icon={<Wind size={24} className="text-sage-500 mb-2 animate-[spin_8s_linear_infinite]" />} />
        <StatCard title="Current Crowd" value="Low" icon={<Users size={24} className="text-primary-500 mb-2" />} />
      </div>
      
      {/* Highlight/Featured Area with Image */}
      <div className="bg-white rounded-3xl p-5 shadow-inner shadow-slate-100 border border-slate-100 flex flex-col relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="absolute top-0 right-0 w-1/2 h-full -z-10">
          <img src="https://images.unsplash.com/photo-1505820980076-2f040dcee682?auto=format&fit=crop&q=80&w=400" alt="Nature Walk" className="w-full h-full object-cover opacity-20 mix-blend-multiply transition-opacity group-hover:opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>
        <span className="text-[10px] font-bold text-sage-500 uppercase tracking-widest mb-1">Featured Event</span>
        <h4 className="font-serif font-bold text-xl text-primary-700 mb-1">Sunset Nature Walk</h4>
        <p className="text-xs text-slate-500 mb-4 max-w-[60%]">Join our guide for an evening stroll learning about nocturnal wildlife.</p>
        <button className="flex items-center gap-2 text-sm font-bold text-primary-600 mt-auto w-max px-4 py-2 bg-primary-50 rounded-full group-hover:bg-primary-100 transition-colors">
          Reserve Spot <ArrowRight size={16} />
        </button>
      </div>

    </motion.div>
  );
}

function ActionCard({ title, icon, color, highlightHover }) {
  return (
    <div className={`${color} rounded-3xl p-4 flex flex-col justify-center items-center gap-2 active:scale-[0.98] ${highlightHover ? 'hover:bg-primary-50 hover:border-primary-200' : 'hover:scale-[1.02]'} transition-all cursor-pointer shadow-inner`}>
      {icon}
      <span className="text-xs font-bold text-center tracking-wide">{title}</span>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-inner shadow-slate-50 border border-slate-100 flex flex-col items-start hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-default">
      {icon}
      <span className="text-2xl font-black text-primary-700 leading-none my-1 tracking-tight">{value}</span>
      <span className="text-xs text-slate-500 font-medium tracking-wide">{title}</span>
    </div>
  );
}

