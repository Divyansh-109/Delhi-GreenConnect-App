import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react';
import useGeolocation from '../../hooks/useGeolocation';
import { sendMockSOSPayload } from '../../utils/mockBackend';

export default function SOSButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, confirming, sending, sent, error
  const { location, error, loading, requestLocation } = useGeolocation();

  const handleSosClick = () => {
    setStatus('confirming');
    setIsModalOpen(true);
  };

  const confirmSOS = async () => {
    setStatus('sending');
    requestLocation();
    
    // We observe the hook's state changes via a simulated timeout.
    // In a real app we'd wait for exact location coordinates.
    setTimeout(async () => {
      try {
        await sendMockSOSPayload({
          parkName: 'Yamuna Biodiversity Park',
          coordinates: location || { latitude: 28.718, longitude: 77.215 },
          timestamp: new Date().toISOString()
        });
        setStatus('sent');
      } catch (err) {
        setStatus('error');
      }
    }, 2000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setStatus('idle'), 300);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={handleSosClick}
        className="fixed bottom-24 right-4 z-[60] bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full shadow-[0_8px_16px_-4px_rgba(220,38,38,0.5)] flex items-center justify-center transition-transform active:scale-90"
        aria-label="Emergency SOS"
      >
        <AlertTriangle size={28} />
      </button>

      {/* SOS Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-xs shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {status === 'confirming' && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 inner-shadow">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Send SOS?</h3>
                <p className="text-slate-500 text-sm mb-6">This will alert park security and share your exact location.</p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button onClick={closeModal} className="bg-slate-100 text-slate-700 py-3 rounded-xl font-bold active:scale-95">Cancel</button>
                  <button onClick={confirmSOS} className="bg-red-600 text-white py-3 rounded-xl font-bold shadow-md shadow-red-200 active:scale-95">Yes, Help</button>
                </div>
              </div>
            )}

            {status === 'sending' && (
              <div className="flex flex-col items-center text-center py-6">
                <Loader2 size={48} className="text-red-500 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Acquiring Location...</h3>
                <p className="text-sm text-slate-500 mt-2">Transmitting emergency signal</p>
              </div>
            )}

            {status === 'sent' && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">SOS Sent</h3>
                <p className="text-slate-500 text-sm mb-6">Security has been dispatched to your location.</p>
                <button onClick={closeModal} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Close</button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
