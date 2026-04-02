import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, MapPin, X, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMockSOSPayload } from '../../utils/mockBackend';
import useLiveLocation from '../../hooks/useLiveLocation';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import mockPaths from '../../data/mockPaths.json';
import telemetry from '../../data/mockTelemetry.json';

const RedDotIcon = L.divIcon({
  className: 'live-location-marker',
  html: `<div class="relative flex h-5 w-5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span class="relative inline-flex rounded-full h-5 w-5 border-2 border-white bg-red-600 shadow-md"></span></div>`,
  iconSize: [20, 20], iconAnchor: [10, 10]
});

// A component to force Leaflet to automatically fit bounds to the SOS Polyline
function PathFitter({ path }) {
  const map = useMap();
  React.useEffect(() => {
    if (path.length > 0) {
      const bounds = L.latLngBounds(path);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [path, map]);
  return null;
}

export default function SOSButton() {
  const [isActive, setIsActive] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const { location } = useLiveLocation();
  const [sosRoute, setSosRoute] = useState([]);

  const parkTelemetry = telemetry['yamuna-biodiversity-park'];

  const triggerSOS = async () => {
    setIsDispatched(true);
    try {
      if (location) {
        // Build a route stringing user's live location to the pre-rendered hackathon fallback exit gate path
        setSosRoute([
          [location.lat, location.lng],
          ...mockPaths.sosExitPath.map(p => [p.lat, p.lng])
        ]);
        await sendMockSOSPayload(location.lat, location.lng);
      } else {
        await sendMockSOSPayload(null, null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cancelSOS = () => {
    setIsActive(false);
    setIsDispatched(false);
    setSosRoute([]);
  };

  return (
    <>
      <button 
        onClick={() => setIsActive(true)}
        className="fixed bottom-24 right-4 z-50 bg-red-600 text-white rounded-full p-4 shadow-[0_8px_30px_rgb(220,38,38,0.4)] flex items-center justify-center hover:bg-red-700 active:scale-90 transition-all border-4 border-red-200"
        aria-label="SOS Emergency"
      >
        <ShieldAlert size={32} />
      </button>

      <AnimatePresence>
        {isActive && (
          <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 w-full max-w-sm max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col items-center relative"
            >
              {!isDispatched ? (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <AlertTriangle size={40} className="text-red-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2 truncate text-center">Emergency SOS</h2>
                  <p className="text-center text-slate-500 mb-8 text-sm leading-relaxed px-2">
                    This will alert park authorities, drop your live pin, and generate an emergency exit route instantly.
                  </p>
                  
                  <button 
                    onClick={triggerSOS}
                    className="w-full bg-red-600 text-white font-black text-lg py-5 rounded-2xl mb-4 shadow-lg hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    DISPATCH SOS
                  </button>
                  <button 
                    onClick={() => setIsActive(false)}
                    className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="flex justify-between items-center w-full mb-4">
                    <h3 className="font-black text-red-600 text-xl flex items-center gap-2 animate-pulse"><AlertTriangle /> HELP DISPATCHED</h3>
                    <button onClick={cancelSOS} className="p-2 bg-slate-100 rounded-full text-slate-600"><X size={20}/></button>
                  </div>
                  
                  {/* Telemetry Widget */}
                  <div className="bg-slate-50 w-full p-4 rounded-2xl border border-slate-200 mb-4 flex divide-x divide-slate-200 shadow-sm">
                    <div className="flex-1 px-2 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">AQI Level</p>
                      <p className="font-black text-slate-800 flex justify-center items-center gap-1"><Activity size={14} className="text-emerald-500"/> {parkTelemetry.aqi}</p>
                    </div>
                    <div className="flex-1 px-2 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Crowd-o-Meter</p>
                      <p className="font-black text-amber-600">{parkTelemetry.crowdLevel}%</p>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl w-full mb-5">
                    <p className="text-red-800 font-bold text-sm mb-2">Instructions:</p>
                    <ul className="text-xs text-red-700 space-y-2 list-disc list-inside">
                      <li>Follow the red dashed line on the map below to the nearest secure exit.</li>
                      <li>Authorities have been pinged with your exact GPS.</li>
                      <li>Stay calm and stay in visible public corridors.</li>
                    </ul>
                  </div>

                  {/* Isolated Live SOS Map */}
                  <div className="w-full h-56 rounded-2xl overflow-hidden border-4 border-red-100 shadow-inner relative z-0">
                    <MapContainer center={location ? [location.lat, location.lng] : [28.718, 77.215]} zoom={17} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {location && <Marker position={[location.lat, location.lng]} icon={RedDotIcon} />}
                      {sosRoute.length > 0 && <Polyline positions={sosRoute} color="red" weight={5} dashArray="10, 15" className="animate-pulse" />}
                      <PathFitter path={sosRoute} />
                    </MapContainer>
                  </div>

                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
