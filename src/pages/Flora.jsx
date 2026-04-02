import React from 'react';
import { motion } from 'framer-motion';
import { Info, Video, Leaf } from 'lucide-react';
import floraData from '../data/flora.json';

export default function Flora() {
  const entry = floraData[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white min-h-screen"
    >
      {/* Full-width bleed Hero Image */}
      <div className="relative w-full h-[40vh] border-b border-divider">
        <img 
          src={entry.image || "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80"} 
          alt={entry.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 sm:left-8 text-white z-10">
          <div className="flex items-center gap-2 mb-2 text-white bg-primary-600/90 backdrop-blur-sm px-3 py-1 w-max rounded-sm shadow-sm border border-primary-500">
            <Leaf size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Flora ID: {entry.id}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{entry.name}</h2>
          <p className="text-sm italic font-medium opacity-90">{entry.scientificName}</p>
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 ibis-card">
              <h3 className="flex items-center gap-2 font-bold text-lg text-header mb-4">
                <Info size={18} className="text-primary-600" /> Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {entry.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 ibis-card p-6 border-t-2 border-t-primary-600">
              <h4 className="font-bold text-sm text-header mb-3 uppercase tracking-wider">
                 Key Benefits
              </h4>
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside marker:text-primary-600 leading-relaxed font-medium">
                {entry.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
              </ul>
            </div>

            <button className="w-full bg-header hover:bg-gray-800 text-white rounded-sm py-3 flex items-center justify-center gap-2 font-bold transition-colors">
              <Video size={18} /> Watch Video
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

