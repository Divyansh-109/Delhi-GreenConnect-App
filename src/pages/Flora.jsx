import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, ArrowLeft, Info, ThermometerSun, ShieldCheck, Volume2, Square, Globe, Video, CheckCircle2 } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      style={{ backgroundColor: '#F9F8F1' }}
      className="pb-24 min-h-screen"
    >
      {/* Premium Full-Bleed Hero */}
      <div className="relative h-[400px] w-full overflow-hidden shadow-2xl mb-10">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B3022] via-[#1B3022]/40 to-transparent"></div>
        
        {/* Floating Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 p-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all active:scale-90"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>

        <div className="absolute bottom-10 left-8 right-8 z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-primary-300 bg-primary-900/40 backdrop-blur-md px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary-500/30 shadow-lg">Botanical Profile</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-none mb-3 drop-shadow-2xl">
            {item.name}
          </h1>
          <p className="text-white text-lg sm:text-xl font-medium italic drop-shadow-lg font-serif mb-6 uppercase tracking-wide">{item.scientificName}</p>
          
          <div className="flex gap-4">
            <button 
              onClick={handleAudioToggle}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl transition-all active:scale-95 ${isPlaying ? 'bg-orange-500/80 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isPlaying ? <Square size={20} fill="currentColor" /> : <Volume2 size={20} />}
              <span className="font-bold text-sm tracking-tight">{isPlaying ? 'Stop Story' : 'Hear Story'}</span>
            </button>
            <button 
              onClick={() => setLang(lang === 'en-IN' ? 'hi-IN' : 'en-IN')}
              className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 shadow-xl transition-all active:scale-95"
            >
              <Globe size={20} />
              <span className="font-bold text-sm tracking-tight uppercase">{lang.split('-')[0]}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Description Card */}
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 -z-10 opacity-40"></div>
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#1B3022] font-bold text-2xl mb-5 flex items-center gap-3">
                <Info size={24} className="text-primary-600" /> Botanical Description
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg font-medium opacity-90 whitespace-pre-wrap">
                {item.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="bg-[#F9F8F1] p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
                  <ThermometerSun size={24} className="text-primary-600 mb-3" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Environment</span>
                  <span className="text-primary-700 font-black text-xl">{item.climate || 'Tropical'}</span>
                </div>
                <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 flex flex-col items-center text-center">
                  <ShieldCheck size={24} className="text-emerald-700 mb-3" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Conservation</span>
                  <span className="text-emerald-800 font-black text-xl">{item.status || 'Protected'}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* Impact Sidebar */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#1B3022] font-bold text-xl mb-6 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600" /> ECOSYSTEM VALUE
              </h3>
              <ul className="space-y-4">
                {item.benefits.map((benefit, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-4 text-slate-600 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                    <span className="text-sm font-semibold opacity-90 leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            <button className="w-full bg-[#1B3022] hover:bg-black text-white p-6 rounded-[2rem] shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 group-hover:translate-x-full transition-transform duration-500"></div>
              <Video size={24} />
              <span className="font-bold text-base tracking-tight">Watch Educational Module</span>
            </button>

            <div className="bg-gradient-to-br from-primary-50 to-white rounded-[2.5rem] p-8 border border-primary-100 text-center shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-primary-700 font-bold text-sm tracking-tight mb-2">Earn points by exploring near this node!</p>
                <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden shadow-inner mt-4">
                  <div className="bg-primary-600 h-full w-[45%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
