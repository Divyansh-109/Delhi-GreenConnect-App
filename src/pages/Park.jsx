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
      className="p-4 sm:p-6 pb-24"
    >
      {/* Hero Greeting with Biodiversity Image */}
      <div className="mb-6 relative rounded-[2rem] overflow-hidden p-8 shadow-xl border border-slate-100/50 min-h-[180px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800" alt="Forest Canopy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10">
          <motion.h2 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-lg"
          >
            {getGreeting()}, <br/> <span className="text-primary-400">{name}</span>
          </motion.h2>
          <p className="text-gray-300 font-medium text-base mt-2 drop-shadow flex items-center gap-2">
            <MapPin size={16} className="text-primary-500" /> Yamuna Biodiversity Park
          </p>
        </div>
      </div>

      {/* Quick Actions Grid (Bento Box style) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to="/map" className="col-span-2 bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2rem] p-6 text-white flex justify-between items-center shadow-lg hover:shadow-primary-900/20 active:scale-[0.98] transition-all cursor-pointer group">
          <div>
            <h3 className="font-bold text-xl font-serif tracking-tight">Interactive Map</h3>
            <p className="text-primary-100 text-xs mt-1 opacity-80">Explore layers & find hidden species</p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform">
            <QrCode size={28} className="text-white" />
          </div>
        </Link>

        <ActionCard title="Nearest Gate" icon={<Navigation size={24} />} color="bg-emerald-50 text-primary-800 border border-emerald-100" />
        <ActionCard title="Report Issue" icon={<AlertTriangle size={24} />} color="bg-white border border-slate-100 text-slate-700 shadow-sm" highlightHover={true} />
      </div>

      {/* Current Park Stats */}
      <div className="mb-8">
        <h3 className="text-xl font-serif font-bold text-header mb-4 flex items-center gap-2">
          <Wind size={20} className="text-primary-600" /> Live Park Telemetry
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard title="AQI Index" value={parkTelemetry.aqi} status="Good" color="text-emerald-600" />
          <StatCard title="Temperature" value={`${parkTelemetry.temperature}°C`} status="Warm" color="text-orange-600" />
          <StatCard title="Crowd Level" value={`${parkTelemetry.crowdLevel}%`} status="Low" color="text-blue-600" />
        </div>
      </div>
      
      {/* Highlight/Featured Area with Image */}
      <h3 className="text-xl font-serif font-bold text-header mb-4">Discovery Spotlight</h3>
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all cursor-pointer mb-6">
        <div className="absolute top-0 right-0 w-1/2 h-full -z-10">
          <img src="https://images.unsplash.com/photo-1505820980076-2f040dcee682?auto=format&fit=crop&q=80&w=400" alt="Nature Walk" className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-sm uppercase tracking-widest">Featured Tour</span>
        </div>
        <h4 className="font-serif font-bold text-2xl text-header mb-1">Sunset Wetland Walk</h4>
        <p className="text-sm text-slate-600 mb-6 max-w-[65%] leading-relaxed font-medium">Join our expert botanist for a 45-minute tour of the seasonal blooming wetlands near Gate 1.</p>
        <button className="flex items-center gap-2 text-sm font-bold text-white w-max px-6 py-2.5 bg-header rounded-full hover:bg-slate-800 transition-colors shadow-md">
          Reserve Spot <ArrowRight size={18} />
        </button>
      </div>

    </motion.div>
  );
}

function StatCard({ title, value, status, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{title}</span>
      <span className={`text-xl font-black ${color}`}>{value}</span>
      <span className="text-[10px] font-bold text-slate-500 mt-1 italic">{status}</span>
    </div>
  );
}

function ActionCard({ title, icon, color, highlightHover }) {
  return (
    <div className={`${color} rounded-[2rem] p-6 flex flex-col justify-center items-center gap-3 active:scale-[0.98] ${highlightHover ? 'hover:bg-primary-50 hover:border-primary-200' : 'hover:scale-[1.02]'} transition-all cursor-pointer shadow-sm`}>
      <div className="p-3 bg-white/50 rounded-2xl shadow-inner">
        {icon}
      </div>
      <span className="text-sm font-bold text-center tracking-tight">{title}</span>
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

