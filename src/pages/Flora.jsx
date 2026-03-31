import React from 'react';
import { motion } from 'framer-motion';
import { Info, Video, Leaf } from 'lucide-react';
import floraData from '../data/flora.json';

export default function Flora() {
  // Mock grabbing the first item or finding by ID in a real app
  const entry = floraData[0];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }}
      className="p-4 sm:p-6 pb-24"
    >
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 mb-6">
        <img 
          src={entry.image} 
          alt={entry.name} 
          className="w-full h-56 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1 text-primary-600">
            <Leaf size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Flora ID: {entry.id}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-1">{entry.name}</h2>
          <p className="text-sm text-slate-500 italic mb-5">{entry.scientificName}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                <Info size={18} className="text-primary-500" /> Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {entry.description}
              </p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <h4 className="font-bold text-amber-800 text-sm mb-2">Key Benefits</h4>
              <ul className="text-sm text-amber-700 space-y-1.5 list-disc list-inside marker:text-amber-500">
                {entry.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-4 flex items-center justify-center gap-2 font-bold shadow-lg active:scale-95 transition-all">
        <Video size={20} className="text-primary-400" /> Watch Educational Video
      </button>
    </motion.div>
  );
}
