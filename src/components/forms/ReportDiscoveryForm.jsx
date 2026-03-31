import React, { useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { X, MapPin, Camera, AlertTriangle, Leaf, Loader2, CheckCircle2 } from 'lucide-react';

export default function ReportDiscoveryForm({ onClose }) {
  const { submitReport, loading } = useFirestore();
  const [type, setType] = useState('discovery');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [fetchingLoc, setFetchingLoc] = useState(false);
  const [locationStr, setLocationStr] = useState('');

  const handleFetchLocation = () => {
    setFetchingLoc(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocationStr(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setFetchingLoc(false);
      },
      err => {
        console.error(err);
        setLocationStr('Failed to fetch GPS');
        setFetchingLoc(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitReport({
        type, description, location: locationStr ? { lat: 28.718, lng: 77.215 } : null 
      });
      setSuccess(true);
      setTimeout(onClose, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="bg-amber-500 p-5 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2"><Camera size={20} /> Crowdsource Report</h3>
          <button onClick={onClose} className="bg-black/10 p-2 rounded-full hover:bg-black/20 transition-colors"><X size={18} /></button>
        </div>

        {success ? (
          <div className="p-10 flex flex-col items-center text-center">
            <CheckCircle2 size={72} className="text-emerald-500 mb-5 animate-bounce" />
            <h4 className="text-2xl font-black text-slate-800 mb-2">Report Submitted!</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Thank you for helping keep the GreenConnect map updated. The community appreciates your contribution.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
            
            <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full">
              <button 
                type="button" 
                onClick={() => setType('discovery')} 
                className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${type === 'discovery' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
              >
                <Leaf size={18} /> Discovery
              </button>
              <button 
                type="button" 
                onClick={() => setType('issue')} 
                className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${type === 'issue' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
              >
                <AlertTriangle size={18} /> Issue
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Description</label>
              <textarea 
                required rows="3"
                value={description} onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium outline-none focus:border-amber-500 focus:bg-white resize-none transition-colors"
                placeholder={type === 'discovery' ? 'Spotted a rare bird or new blooming flower?' : 'Report broken bench, littering, trail blockage, etc.'}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Attach Live Geotag</label>
              <button 
                type="button" 
                onClick={handleFetchLocation}
                className="w-full bg-slate-50 border-2 border-dashed border-slate-300 text-slate-600 rounded-xl py-4 flex items-center justify-center gap-3 text-sm font-bold hover:bg-slate-100 transition-colors"
              >
                {fetchingLoc ? <Loader2 size={18} className="animate-spin text-amber-500" /> : <MapPin size={18} className={locationStr ? "text-emerald-500" : "text-amber-500"} />}
                {locationStr ? `Tag: ${locationStr}` : 'Fetch Exact GPS Coordinates'}
              </button>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-slate-900 border border-transparent text-white rounded-xl py-4 mt-2 font-bold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 shadow-lg hover:shadow-xl transition-all">
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Submit to Network'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
