import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Clock, MapPin, Leaf, Ticket } from 'lucide-react';

import eventsData from '../data/events.json';

export default function Events() {
  const [events, setEvents] = useState(eventsData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = async (event, info) => {
    if (info.offset.y > 100) {
      setIsRefreshing(true);
      await controls.start({ y: 60, transition: { type: 'spring', bounce: 0.5 } });
      
      // Simulate network request
      setTimeout(() => {
        setEvents([...eventsData].sort(() => Math.random() - 0.5));
        setIsRefreshing(false);
        controls.start({ y: 0, transition: { type: 'spring', bounce: 0 } });
      }, 1500);
    } else {
      controls.start({ y: 0, transition: { type: 'spring', bounce: 0 } });
    }
  };

  const getEventImage = (tag) => {
    const images = {
      'biology': '1444491741275-3747c53d99b4',
      'workshop': '1552820728-8b83bb6b773f',
      'tour': '1505820980076-2f040dcee682'
    };
    const id = images[tag.toLowerCase()] || '1542273917363-3b1817f69a2d';
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=600`;
  };

  return (
    <div className="relative overflow-hidden h-full">
      {/* Background Pull Loader */}
      <div className="absolute top-0 w-full flex justify-center items-center h-20 -z-10">
        <motion.div 
          animate={isRefreshing ? { rotate: 360, scale: [1, 1.2, 1] } : {}} 
          transition={{ repeat: isRefreshing ? Infinity : 0, duration: 1 }}
          className="bg-primary-500/10 p-3 rounded-full"
        >
          <Leaf size={24} className="text-primary-600 drop-shadow-md" />
        </motion.div>
      </div>

      <motion.div 
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        className="p-4 sm:p-6 bg-transparent min-h-[calc(100vh-120px)] touch-pan-y"
      >
        <h2 className="text-4xl font-serif font-black text-primary-700 tracking-tight leading-tight mb-6 mt-2">Upcoming Events</h2>
        
        <div className="space-y-6">
          {events.map((event, i) => (
            <motion.div 
              key={event.id + i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-vanilla rounded-[2rem] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),_0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col transition-all hover:scale-[1.01] hover:shadow-lg active:scale-[0.98] relative overflow-hidden group cursor-pointer"
            >
              {/* Event Background Image */}
              <div className="h-28 w-full relative">
                <img src={getEventImage(event.tag)} alt="Nature" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-vanilla via-vanilla/40 to-transparent"></div>
              </div>

              {/* Ticket cutouts */}
              <div className="absolute left-[-16px] top-28 -translate-y-1/2 w-8 h-8 rounded-full bg-[#f9fbf9] shadow-inner border-r border-slate-100/50 z-20 hidden"></div>
              <div className="absolute right-[-16px] top-28 -translate-y-1/2 w-8 h-8 rounded-full bg-[#f9fbf9] shadow-inner border-l border-slate-100/50 z-20 hidden"></div>

              <div className="px-6 pb-6 pt-0 relative z-10">
                <div className="flex justify-between items-start mb-3 -mt-6">
                  <span className="bg-white/90 backdrop-blur text-primary-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 border border-primary-50">
                    <Ticket size={12} /> {event.tag}
                  </span>
                </div>
                
                <h3 className="font-bold text-xl font-serif text-slate-800 leading-tight mb-4 tracking-tight">{event.title}</h3>
                
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3 text-sm text-slate-600 bg-white/60 p-3 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] border border-slate-50">
                    <Clock size={16} className="text-sage-500" />
                    <span className="font-medium text-slate-700 font-sans tracking-wide">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 bg-white/60 p-3 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] border border-slate-50">
                    <MapPin size={16} className="text-sage-500" />
                    <span className="font-medium text-slate-700 font-sans tracking-wide">{event.location}</span>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-dashed border-sage-200 flex justify-between items-center relative">
                  <span className="text-xs text-slate-400 font-medium">By <strong className="text-slate-700 font-bold font-serif">{event.organizer}</strong></span>
                  <button className="text-white font-bold text-sm bg-primary-600 px-6 py-2.5 rounded-full hover:bg-primary-700 transition-all shadow-lg active:scale-95">RSVP</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
