import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, MapPin, AlertTriangle, Wind, Navigation, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import telemetry from '../data/mockTelemetry.json';

export default function Park() {
  const { parkId } = useParams();
  const { currentUser } = useAuth();
  const parkTelemetry = telemetry['yamuna-biodiversity-park'] || telemetry['default'];
  
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
      style={{ backgroundColor: '#F9F8F1' }}
      className="p-4 sm:p-6 pb-24 min-h-screen"
    >
      {/* Hero Greeting with Biodiversity Image */}
      <div className="mb-6 relative rounded-[2.5rem] overflow-hidden p-8 shadow-2xl border border-white/20 min-h-[220px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800" alt="Forest Canopy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3022]/90 via-[#1B3022]/60 to-transparent backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-2"
          >
            {getGreeting()}, <br/> <span className="text-primary-300">{name}</span>
          </motion.h2>
          <p className="text-white/80 font-medium text-lg mt-2 flex items-center gap-2 drop-shadow-sm">
            <MapPin size={20} className="text-primary-400" /> Yamuna Biodiversity Park
          </p>
        </div>
      </div>

      {/* Quick Actions Grid (Premium Bento Style) */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <Link to="/map" className="col-span-2 bg-[#1B3022] rounded-[2.5rem] p-8 text-white flex justify-between items-center shadow-xl hover:shadow-[#1B3022]/20 active:scale-[0.98] transition-all cursor-pointer group border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-2xl tracking-tight">Interactive Map</h3>
            <p className="text-primary-200 text-sm mt-1 opacity-80">Explore layers & find hidden species</p>
          </div>
          <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
            <QrCode size={32} className="text-white" />
          </div>
        </Link>

        <ActionCard title="Nearest Gate" icon={<Navigation size={26} className="text-primary-700" />} color="bg-white/60 backdrop-blur-md text-[#1B3022] border border-white shadow-sm" />
        <ActionCard title="Report Issue" icon={<AlertTriangle size={26} className="text-red-600" />} color="bg-white/60 backdrop-blur-md text-[#1B3022] border border-white shadow-sm" highlightHover={true} />
      </div>

      {/* Current Park Stats */}
      <div className="mb-10">
        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#1B3022] mb-5 flex items-center gap-3">
          <Wind size={24} className="text-primary-600" /> Live Park Telemetry
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="AQI Index" value={parkTelemetry.aqi} status="Healthy" color="text-emerald-700" bgColor="bg-emerald-50/50" />
          <StatCard title="Temp" value={`${parkTelemetry.temperature}°C`} status="Warm" color="text-orange-700" bgColor="bg-orange-50/50" />
          <StatCard title="Crowd" value={`${parkTelemetry.crowdLevel}%`} status="Low" color="text-blue-700" bgColor="bg-blue-50/50" />
        </div>
      </div>
      
      {/* Discovery Spotlight */}
      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#1B3022] mb-5">Discovery Spotlight</h3>
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-xl transition-all cursor-pointer mb-8">
        <div className="absolute top-0 right-0 w-3/5 h-full -z-10">
          <img src="https://images.unsplash.com/photo-1505820980076-2f040dcee682?auto=format&fit=crop&q=80&w=600" alt="Nature Walk" className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-primary-700 bg-primary-100/50 px-3 py-1 rounded-full uppercase tracking-widest border border-primary-200">Featured Tour</span>
        </div>
        <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-3xl text-[#1B3022] mb-2 tracking-tight">Sunset Wetland Walk</h4>
        <p className="text-base text-slate-600 mb-8 max-w-[70%] leading-relaxed font-medium">Join our expert botanist for a 45-minute tour of the seasonal blooming wetlands.</p>
        <button className="flex items-center gap-3 text-sm font-bold text-white w-max px-8 py-3.5 bg-[#1B3022] rounded-full hover:bg-black transition-all shadow-lg active:scale-95 group">
          Reserve Spot <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </motion.div>
  );
}

function StatCard({ title, value, status, color, bgColor }) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm p-5 rounded-[2rem] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),_0_2px_10px_rgba(0,0,0,0.03)] border border-white flex flex-col items-center text-center group hover:scale-105 transition-transform`}>
      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-2">{title}</span>
      <span className={`text-2xl font-black ${color} drop-shadow-sm`}>{value}</span>
      <span className={`text-[10px] font-bold text-slate-500 mt-2 italic flex items-center gap-1`}>
        <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text', 'bg')}`}></div> {status}
      </span>
    </div>
  );
}

function ActionCard({ title, icon, color, highlightHover }) {
  return (
    <div className={`${color} rounded-[2rem] p-7 flex flex-col justify-center items-center gap-4 active:scale-[0.98] ${highlightHover ? 'hover:bg-primary-50 hover:border-primary-200' : 'hover:scale-[1.02]'} transition-all cursor-pointer shadow-sm relative overflow-hidden group`}>
      <div className="p-4 bg-white/40 rounded-3xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/20 group-hover:bg-white/60 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-bold text-center tracking-tight text-[#1B3022]">{title}</span>
    </div>
  );
}

function HighlightCard({ title, time, location, image, description }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
      <div className="relative h-36 w-full">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-primary-700 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
          {time}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-black text-slate-800 text-lg leading-tight mb-1">{title}</h4>
        <p className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 uppercase tracking-wide mb-2">
          <MapPin size={12} /> {location}
        </p>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}

