import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, ArrowLeft, Info, ThermometerSun, ShieldCheck, Volume2, Square, Globe, Video } from 'lucide-react';
import floraData from '../data/flora.json';

export default function Flora() {
  const { floraId } = useParams();
  const navigate = useNavigate();
  const item = floraData.find(f => f.id === parseInt(floraId));
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState('en-IN');

  React.useEffect(() => {
    return () => window.speechSynthesis && window.speechSynthesis.cancel();
  }, []);

  if (!item) return <div className="p-6 text-center text-slate-500 mt-20">Flora not found.</div>;

  const handleAudioToggle = () => {
    if (!('speechSynthesis' in window)) return alert("Speech Synthesis not supported in this browser.");
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToRead = lang === 'en-IN' 
      ? `${item.name}. Scientific name: ${item.scientificName}. ${item.description}`
      : `यह ${item.name} है। इसका वैज्ञानिक नाम ${item.scientificName} है। हम यमुना बायोडायवर्सिटी पार्क में इसकी रक्षा करते हैं।`;
      
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlaying(false);
    
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white min-h-screen"
    >
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 mb-6">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-56 object-cover"
        />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-primary-600">
                <Leaf size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Flora ID: {item.id}</span>
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-1">{item.name}</h2>
              <p className="text-sm text-slate-500 italic">{item.scientificName}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setLang(lang === 'en-IN' ? 'hi-IN' : 'en-IN')}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <Globe size={20} />
              </button>
              <button 
                onClick={handleAudioToggle}
                className={`p-2 rounded-full ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'}`}
              >
                {isPlaying ? <Square size={20} fill="currentColor" /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
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

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <ThermometerSun size={20} className="text-blue-500 mb-1" />
                <p className="text-[10px] uppercase font-bold text-blue-400">Climate</p>
                <p className="text-sm font-semibold text-blue-900">{item.climate || 'Tropical'}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <ShieldCheck size={20} className="text-emerald-500 mb-1" />
                <p className="text-[10px] uppercase font-bold text-emerald-400">Status</p>
                <p className="text-sm font-semibold text-emerald-900">{item.status || 'Protected'}</p>
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

