import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Camera, Target, X } from 'lucide-react';
import useLiveLocation from '../hooks/useLiveLocation';
import { useGamification } from '../hooks/useGamification';
import { useFirestore } from '../hooks/useFirestore';
import mockPaths from '../data/mockPaths.json';
import L from 'leaflet';
import { Filter, ChevronRight, ChevronLeft, Search } from 'lucide-react';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const BlueDotIcon = L.divIcon({
  className: 'live-location-marker',
  html: `<div class="relative flex h-6 w-6">
           <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
           <span class="relative inline-flex rounded-full h-6 w-6 border-2 border-white bg-blue-500 shadow-md"></span>
         </div>`,
  iconSize: [24, 24], iconAnchor: [12, 12]
});

// Haversine Distance Geofencing for Gamification
function GeofenceGamifier({ location }) {
  const { awardPoint, awardBadge, showBanner, clearBanner } = useGamification();
  const [claimed, setClaimed] = useState(new Set());

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const p1 = lat1 * Math.PI/180, p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180, dl = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  };

  useEffect(() => {
    if (!location) return;
    mockPaths.greenPoints.forEach(gp => {
      if (claimed.has(gp.id)) return;
      if (getDistance(location.lat, location.lng, gp.lat, gp.lng) < 20) {
        awardPoint(gp.points, `Discovering ${gp.name}`);
        awardBadge("Trailblazer");
        setClaimed(prev => new Set(prev).add(gp.id));
      }
    });
  }, [location, claimed, awardPoint, awardBadge]);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
          className="absolute top-20 left-4 right-4 z-[500] bg-emerald-500 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between"
        >
          <div>
            <h4 className="font-black flex items-center gap-2"><Target size={18}/> {showBanner.title}</h4>
            <p className="text-sm font-medium opacity-90">{showBanner.description}</p>
          </div>
          <button onClick={clearBanner} className="p-1 bg-white/20 rounded-full hover:bg-white/30"><X size={16}/></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MapController({ centerPos, shouldRecenter }) {
  const map = useMap();
  useEffect(() => {
    if (shouldRecenter && centerPos) {
      map.flyTo([centerPos.lat, centerPos.lng], 17, { animate: true, duration: 1 });
    }
  }, [centerPos, shouldRecenter, map]);
  return null;
}

export default function MapView() {
  const { location, error } = useLiveLocation();
  const { subscribeToMemories } = useFirestore();
  const [memories, setMemories] = useState([]);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-120px)] w-full relative overflow-hidden" style={{ backgroundColor: '#F9F8F1' }}>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="flex-1 relative z-0"
      >
        <div className="absolute top-4 left-4 right-16 z-[400] bg-white/80 backdrop-blur-xl p-4 rounded-[1.5rem] shadow-xl border border-white/50 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-[#1B3022] text-base leading-tight tracking-tight">Interactive Biodiversity Map</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{location ? 'Live tracking active' : (error ? 'GPS Error' : 'Acquiring GPS...')}</p>
          </div>
        </div>

        <button onClick={() => setRecenterTrigger(p => p+1)} className="absolute bottom-24 right-4 z-[400] bg-white p-4 rounded-full shadow-2xl border border-slate-100 text-[#1B3022] hover:text-primary-600 active:scale-90 transition-all">
          <Navigation size={24} className="fill-current rotate-45" />
        </button>

        <MapContainer center={[28.718, 77.215]} zoom={16} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
          <LayersControl position="bottomleft">
            <LayersControl.BaseLayer checked name="Topographic">
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay checked name="Facilities">
              <LayerGroup>
                <Marker position={[28.718, 77.215]}><Popup><strong>Gate 1</strong></Popup></Marker>
                <Marker position={[28.719, 77.212]}><Popup><strong>Restroom</strong></Popup></Marker>
              </LayerGroup>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Flora Nodes">
              <LayerGroup>
                <Marker position={[28.716, 77.218]}><Popup><strong>Neem Tree</strong><br/><a href="/flora/1042" className="text-primary-600 font-bold">View Scientific Profile</a></Popup></Marker>
              </LayerGroup>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Memories">
              <LayerGroup>
                {memories.map(m => (
                  <Marker key={m.id} position={[m.lat, m.lng]}>
                    <Popup>
                      <div className="text-center font-sans p-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{m.userName}'s Memory</p>
                        <p className="text-sm font-bold text-slate-800 italic">"{m.text}"</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
          
          <MapController centerPos={location} shouldRecenter={recenterTrigger > 0} />
          <GeofenceGamifier location={location} />

          {location && (
            <Marker position={[location.lat, location.lng]} icon={BlueDotIcon}>
              <Popup><strong>It's You!</strong><br/>Accuracy: {Math.round(location.accuracy)}m</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating Toggle Button */}
        {!panelOpen && (
          <button 
            onClick={() => setPanelOpen(true)}
            className="absolute top-4 right-4 z-[400] bg-white border border-slate-200 shadow-xl p-3 rounded-2xl flex items-center justify-center text-[#1B3022] hover:text-primary-600 border border-white/50 active:scale-95 transition-all"
          >
            <Filter size={22} strokeWidth={2.5} />
          </button>
        )}
      </motion.div>

      {/* Filter Panel */}
      <div 
        className={`bg-white border-l border-slate-200 shadow-[-10px_0_30px_-10px_rgba(27,48,34,0.1)] transition-all duration-500 ease-out flex flex-col z-[500] ${panelOpen ? 'w-80' : 'w-0 overflow-hidden'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#F9F8F1] flex-shrink-0">
          <div style={{ fontFamily: "'Playfair Display', serif" }} className="flex items-center gap-2 text-[#1B3022] font-bold text-xl">
            <Filter size={20} className="text-primary-600" /> Sidebar
          </div>
          <button onClick={() => setPanelOpen(false)} className="text-slate-400 hover:text-[#1B3022] p-2 bg-white rounded-full shadow-sm border border-slate-100 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Search Box */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1B3022]/70 mb-3 block">Species Identity</label>
            <div className="relative">
              <input type="text" placeholder="Common name or ID..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-4 pr-10 text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all" />
              <Search size={18} className="absolute right-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          {/* Taxonomy Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1B3022]/70 mb-3 block">Scientific Group</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none appearance-none">
              <option>All Kingdoms</option>
              <option>Plantae (Plants)</option>
              <option>Animalia (Animals)</option>
              <option>Fungi</option>
            </select>
          </div>
          
          {/* Date Range - New Feature */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1B3022]/70 mb-3 block">Observation Window</label>
            <div className="flex flex-col gap-2">
              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none" />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tighter px-1">
                <span>Earliest</span>
                <span>Latest</span>
              </div>
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1B3022]/70 mb-3 block">Active Biodiversity Zone</label>
            <div className="space-y-3 mt-4">
              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-[#1B3022] group">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 transition-all accent-primary-600" />
                <span className="group-hover:text-primary-700">Yamuna Biodiversity Park</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-[#1B3022] group">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 transition-all accent-primary-600" />
                <span className="group-hover:text-primary-700">Aravalli Biodiversity Park</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-[#F9F8F1] flex-shrink-0">
          <button className="w-full bg-[#1B3022] hover:bg-black text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg active:scale-[0.98]">
            Apply Layer Filters
          </button>
        </div>
      </div>
    </div>
  );
}

