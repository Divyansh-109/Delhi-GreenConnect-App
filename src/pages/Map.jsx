import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import useLiveLocation from '../hooks/useLiveLocation';

// Fix Leaflet's default icon path issues with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom animated blue dot for user
const BlueDotIcon = L.divIcon({
  className: 'live-location-marker',
  html: `<div class="relative flex h-6 w-6">
           <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
           <span class="relative inline-flex rounded-full h-6 w-6 border-2 border-white bg-blue-500 shadow-md"></span>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Component to programmatically re-center map
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
  const parkCenter = [28.718, 77.215]; // Yamuna Biodiversity Park approx coordinates
  const { location, error } = useLiveLocation();
  const [recenterTrigger, setRecenterTrigger] = React.useState(0);

  const handleRecenter = () => {
    setRecenterTrigger(prev => prev + 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="h-[calc(100vh-120px)] w-full relative z-0 bg-slate-100"
    >
      <div className="absolute top-4 left-4 right-4 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-tight">Interactive Park Map</p>
            <p className="text-[10px] text-slate-500 font-medium">{location ? 'Live tracking active' : (error ? 'GPS Error' : 'Acquiring GPS...')}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleRecenter}
        className="absolute bottom-24 right-4 z-[400] bg-white p-3 rounded-full shadow-xl border border-slate-100 text-slate-700 hover:text-primary-600 active:scale-95 transition-all focus:outline-none"
        aria-label="Re-center map"
      >
        <Navigation size={22} className="fill-current rotate-45" />
      </button>

      <MapContainer 
        center={location ? [location.lat, location.lng] : parkCenter} 
        zoom={16} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map Controller for programmatic recentering */}
        <MapController centerPos={location} shouldRecenter={recenterTrigger > 0} />
        
        {/* User's Live Location */}
        {location && (
          <Marker position={[location.lat, location.lng]} icon={BlueDotIcon}>
            <Popup className="font-sans">
              <strong>It's You!</strong><br />Accuracy: {Math.round(location.accuracy)}m
            </Popup>
          </Marker>
        )}

        {/* Mock Static POIs */}
        <Marker position={[28.718, 77.215]}>
          <Popup className="font-sans">
            <strong>Entry Gate 1</strong><br />Scan QR here.
          </Popup>
        </Marker>

        <Marker position={[28.716, 77.218]}>
          <Popup className="font-sans">
            <strong>Neem Tree</strong><br />Flora ID: 1042
            <br/><a href="/flora/1042" className="text-primary-600 font-bold text-xs">View Details ↗</a>
          </Popup>
        </Marker>

        <Marker position={[28.719, 77.212]}>
          <Popup className="font-sans">
            <strong>Restroom</strong><br />Public Facilities
          </Popup>
        </Marker>
      </MapContainer>
    </motion.div>
  );
}
