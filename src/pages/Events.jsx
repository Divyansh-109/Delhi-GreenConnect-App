import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';

import eventsData from '../data/events.json';

export default function Events() {
  const events = eventsData;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="p-4 sm:p-6"
    >
      <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Upcoming Events</h2>
      
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 flex flex-col gap-3 transition-transform hover:-translate-y-1 active:scale-[0.98]">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-slate-800 leading-tight">{event.title}</h3>
              <span className="bg-primary-50 border border-primary-100 text-primary-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {event.tag}
              </span>
            </div>
            
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
                <Clock size={16} className="text-primary-500" />
                <span className="font-medium text-slate-700">{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
                <MapPin size={16} className="text-primary-500" />
                <span className="font-medium text-slate-700">{event.location}</span>
              </div>
            </div>
            
            <div className="mt-2 pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-medium">By <strong className="text-slate-600">{event.organizer}</strong></span>
              <button className="text-primary-600 font-bold text-sm hover:underline">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
