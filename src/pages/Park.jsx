import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Camera, CheckCircle2, ChevronRight, Navigation, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGamification } from '../hooks/useGamification';
import { useFirestore } from '../hooks/useFirestore';
import telemetry from '../data/mockTelemetry.json';

export default function Park() {
  const { parkId } = useParams();
  const [activeTab, setActiveTab] = useState('highlights');
  const [userRating, setUserRating] = useState(0);
  const { awardBadge } = useGamification();
  const { submitReview } = useFirestore();
  const parkTelemetry = telemetry['yamuna-biodiversity-park'];

  const handleRating = async (stars) => {
    setUserRating(stars);
    await submitReview({ parkId: parkId || 'default', rating: stars, text: 'Rated directly from highlights.' });
    awardBadge("Voice of the Park");
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      {/* Hero Header */}
      <div className="relative h-64 w-full bg-slate-800">
        <img 
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80" 
          alt="Park View" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Open Now</span>
            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">DDA Protected</span>
          </div>
          <h1 className="text-3xl font-black mb-1 leading-tight tracking-tight">Yamuna Biodiversity Park</h1>
          <p className="text-sm font-medium flex items-center gap-1.5 opacity-90"><MapPin size={14}/> Wazirabad, New Delhi</p>
          
          <div className="flex gap-1 mt-3">
            {[1,2,3,4,5].map(star => (
              <Star 
                key={star} 
                onClick={() => handleRating(star)}
                size={20} 
                className={`cursor-pointer transition-colors ${userRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-white/40 hover:text-white/60'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard title="AQI Level" value={`${parkTelemetry.aqi}`} subtitle="Good" color="text-green-500" />
          <StatCard title="Temp" value={`${parkTelemetry.temperature}°C`} subtitle="Sunny" color="text-orange-500" />
          <StatCard title="Crowd" value={`${parkTelemetry.crowdLevel}%`} subtitle="Moderate" color="text-blue-500" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-3">Today's Highlights</h3>
        <div className="space-y-4">
          <HighlightCard 
            title="Guided Nature Walk" 
            time="4:00 PM" 
            location="Entry Gate 1" 
            image="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600"
            description="Join our expert botanist for a 45-minute tour of the seasonal blooming wetlands."
          />
          <HighlightCard 
            title="Spotted: Kingfisher" 
            time="Recent" 
            location="Wetland Area" 
            image="https://images.unsplash.com/photo-1552726462-23a9634e9e04?auto=format&fit=crop&q=80&w=600"
            description="A beautiful bright blue Kingfisher was just spotted near the central lake hiding in the reeds."
          />
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
      <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{title}</span>
      <span className={`text-xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-slate-400 mt-1">{subtitle}</span>
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
