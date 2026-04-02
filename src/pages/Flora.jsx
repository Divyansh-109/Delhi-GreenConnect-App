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
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }}
      className="p-4 sm:p-6 pb-24"
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
          
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                <Info size={18} className="text-primary-500" /> Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
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

            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <h4 className="font-bold text-amber-800 text-sm mb-2">Key Benefits</h4>
              <ul className="text-sm text-amber-700 space-y-1.5 list-disc list-inside marker:text-amber-500">
                {item.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
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
