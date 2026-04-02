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

  useEffect(() => {
    let unsub = () => {};
    if (subscribeToMemories) unsub = subscribeToMemories(setMemories);
    return () => unsub();
  }, [subscribeToMemories]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[calc(100vh-120px)] w-full relative z-0 bg-slate-100">
      <div className="absolute top-4 left-4 right-16 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
        <div>
          <p className="font-bold text-slate-800 text-sm leading-tight">Layered Interactive Map</p>
          <p className="text-[10px] text-slate-500 font-medium">{location ? 'Live tracking active' : (error ? 'GPS Error' : 'Acquiring GPS...')}</p>
        </div>
      </div>

      <button onClick={() => setRecenterTrigger(p => p+1)} className="absolute bottom-24 right-4 z-[400] bg-white p-3 rounded-full shadow-xl border border-slate-100 text-slate-700 hover:text-primary-600 active:scale-95 transition-all">
        <Navigation size={22} className="fill-current rotate-45" />
      </button>

      <MapContainer center={[28.718, 77.215]} zoom={16} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
        <LayersControl position="bottomleft">
          
          <LayersControl.BaseLayer checked name="Park Map (OSM)">
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Facilities & Gates">
            <LayerGroup>
              <Marker position={[28.718, 77.215]}><Popup><strong>Gate 1</strong></Popup></Marker>
              <Marker position={[28.719, 77.212]}><Popup><strong>Restroom</strong></Popup></Marker>
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Flora & Fauna">
            <LayerGroup>
              <Marker position={[28.716, 77.218]}><Popup><strong>Neem Tree</strong><br/><a href="/flora/1042">View Details</a></Popup></Marker>
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Community Memories">
            <LayerGroup>
              {memories.map(m => (
                <Marker key={m.id} position={[m.lat, m.lng]}>
                  <Popup>
                    <div className="text-center font-sans">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{m.userName}'s Memory</p>
                      <p className="text-sm font-bold text-slate-800 italic">"{m.text}"</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Green Points (Hidden)">
            <LayerGroup>
              {mockPaths.greenPoints.map(gp => (
                <Marker key={gp.id} position={[gp.lat, gp.lng]}><Popup>Unlock to earn {gp.points} PTS!</Popup></Marker>
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
    </motion.div>
  );
}
