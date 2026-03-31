import React, { useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { X, Calendar, AlignLeft, Target, Loader2, CheckCircle2 } from 'lucide-react';

export default function OrganizeEventForm({ onClose }) {
  const { submitEvent, loading } = useFirestore();
  const [formData, setFormData] = useState({ title: '', description: '', date: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitEvent(formData);
      setSuccess(true);
      setTimeout(onClose, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="bg-primary-600 p-5 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">Organize Event</h3>
          <button onClick={onClose} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"><X size={18} /></button>
        </div>

        {success ? (
          <div className="p-10 flex flex-col items-center text-center">
            <CheckCircle2 size={72} className="text-green-500 mb-5 animate-bounce" />
            <h4 className="text-2xl font-black text-slate-800 mb-2">Request Sent!</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Your event is pending DDA Admin approval. You will be notified via email once it is live on the community feed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Event Title</label>
              <div className="relative">
                <Target size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input 
                  required type="text" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:border-primary-500 focus:bg-white transition-colors"
                  placeholder="e.g., Sunday Yoga Session"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Description</label>
              <div className="relative">
                <AlignLeft size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <textarea 
                  required rows="3"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:border-primary-500 focus:bg-white transition-colors resize-none"
                  placeholder="Describe your event agenda and what members should bring..."
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Date & Time</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input 
                  required type="datetime-local" 
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:border-primary-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-slate-900 border border-transparent text-white rounded-xl py-4 mt-2 font-bold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 shadow-lg hover:shadow-xl transition-all">
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Request Permission'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
