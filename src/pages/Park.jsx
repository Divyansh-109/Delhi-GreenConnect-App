import React from 'react';
import { motion } from 'framer-motion';

export default function Park() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="p-4 sm:p-6"
    >
      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 shadow-md">
        <img 
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=800" 
          alt="Yamuna Biodiversity Park" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">Yamuna Biodiversity Park</h2>
          <p className="text-sm opacity-90">Open • Closes at 6:00 PM</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard title="Air Quality" value="45 AQI" subtitle="Good" color="text-green-500" />
        <StatCard title="Walking Trails" value="3.2 km" subtitle="Connected" color="text-amber-500" />
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-3">Today's Highlights</h3>
      <div className="space-y-3">
        <HighlightCard title="Nature Walk" time="4:00 PM" location="Entry Gate 1" />
        <HighlightCard title="Spotted: Kingfisher" time="Recent" location="Wetland Area" />
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

function HighlightCard({ title, time, location }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
      <div>
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500">{location}</p>
      </div>
      <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full">
        {time}
      </span>
    </div>
  );
}
