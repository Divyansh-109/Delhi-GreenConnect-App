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
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white min-h-screen pb-20"
    >
      <div className="p-4 sm:p-6 bg-white">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      {/* Full-width bleed Hero Image */}
      <div className="relative w-full h-[45vh] border-b border-divider overflow-hidden">
        <img 
          src={item.image || "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80"} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Audio Controls Overlay */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button 
            onClick={() => setLang(lang === 'en-IN' ? 'hi-IN' : 'en-IN')}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/20 transition-all shadow-lg"
            title="Change Language"
          >
            <Globe size={20} />
          </button>
          <button 
            onClick={handleAudioToggle}
            className={`p-3 rounded-full border border-white/20 transition-all shadow-lg ${isPlaying ? 'bg-red-500 text-white animate-pulse' : 'bg-primary-600/90 backdrop-blur-md text-white hover:bg-primary-500'}`}
          >
            {isPlaying ? <Square size={20} fill="currentColor" /> : <Volume2 size={20} />}
          </button>
        </div>

        <div className="absolute bottom-6 left-4 sm:left-8 text-white z-10">
          <div className="flex items-center gap-2 mb-2 text-white bg-primary-600/90 backdrop-blur-sm px-3 py-1 w-max rounded-sm shadow-sm border border-primary-500">
            <Leaf size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Flora ID: {item.id}</span>
          </div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tighter drop-shadow-lg"
          >
            {item.name}
          </motion.h2>
          <p className="text-lg italic font-medium opacity-90 mt-1">{item.scientificName}</p>
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 ibis-card rounded-xl shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-xl text-header mb-5 border-b border-divider pb-3">
                <Info size={22} className="text-primary-600" /> Botanical Description
              </h3>
              <p className="text-base text-slate-700 leading-relaxed font-medium">
                {item.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg text-white">
                    <ThermometerSun size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-blue-500 tracking-widest">Environment</p>
                    <p className="text-lg font-bold text-blue-900">{item.climate || 'Tropical'}</p>
                  </div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg text-white">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">Conservation</p>
                    <p className="text-lg font-bold text-emerald-900">{item.status || 'Protected'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 ibis-card p-6 border-t-4 border-t-primary-600 rounded-xl shadow-sm">
              <h4 className="font-bold text-sm text-header mb-4 uppercase tracking-widest flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-primary-600" /> Ecosystem Value
              </h4>
              <ul className="text-sm text-slate-700 space-y-3 list-none leading-relaxed font-semibold">
                {item.benefits.map((benefit, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full bg-header hover:bg-gray-800 text-white rounded-xl py-4 flex items-center justify-center gap-3 font-bold transition-all shadow-lg active:scale-95 group">
              <Video size={20} className="text-primary-400 group-hover:scale-110 transition-transform" /> 
              Watch Educational Module
            </button>
            
            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 text-center">
              <p className="text-xs text-primary-700 font-bold">Earn points by exploring near this node!</p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
