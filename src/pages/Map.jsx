import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Filter, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import useLiveLocation from '../hooks/useLiveLocation';

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

export default function MapView() {
  const parkCenter = [28.718, 77.215];
  const { location } = useLiveLocation();
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-gray-100">
      {/* Map Area */}
      <div className="flex-1 relative z-0 h-full">
        <MapContainer 
          center={location ? [location.lat, location.lng] : parkCenter} 
          zoom={15} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {location && (
            <Marker position={[location.lat, location.lng]}>
              <Popup className="font-sans">
                <strong>Current Position</strong><br />Accuracy: {Math.round(location.accuracy)}m
              </Popup>
            </Marker>
          )}

          <Marker position={[28.718, 77.215]}>
            <Popup className="font-sans">
              <strong>Entry Gate 1</strong>
            </Popup>
          </Marker>

          <Marker position={[28.716, 77.218]}>
            <Popup className="font-sans">
              <strong>Azadirachta indica</strong><br />ID: 1042<br/><a href="/flora/1" className="text-primary-600 font-bold">View Detail</a>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Floating Toggle Button (visible when panel closed) */}
        {!panelOpen && (
          <button 
            onClick={() => setPanelOpen(true)}
            className="absolute top-4 right-4 z-[400] bg-white border border-gray-300 shadow-sm p-2 flex items-center justify-center text-header hover:text-primary-600"
          >
            <Filter size={20} />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      <div 
        className={`bg-white border-l border-divider shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col z-[500] ${panelOpen ? 'w-80' : 'w-0 overflow-hidden'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-divider bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2 text-header font-bold">
            <Filter size={18} className="text-primary-600" /> Options
          </div>
          <button onClick={() => setPanelOpen(false)} className="text-gray-500 hover:text-header p-1">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search Box */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Search Node</label>
            <div className="relative">
              <input type="text" placeholder="Species name or ID..." className="w-full border border-gray-300 rounded-sm py-2 pl-3 pr-8 text-sm focus:outline-none focus:border-primary-500" />
              <Search size={16} className="absolute right-2.5 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Taxonomy Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Taxonomy</label>
            <select className="w-full border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-primary-500 bg-white">
              <option>All Kingdoms</option>
              <option>Plantae (Plants)</option>
              <option>Animalia (Animals)</option>
              <option>Fungi</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Date Range</label>
            <input type="date" className="w-full border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-primary-500 bg-white" />
          </div>

          {/* Region */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Region</label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-header">
                <input type="checkbox" defaultChecked className="accent-primary-600" /> Yamuna Biodiversity Park
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-header">
                <input type="checkbox" defaultChecked className="accent-primary-600" /> Aravalli Biodiversity Park
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-header">
                <input type="checkbox" className="accent-primary-600" /> Neela Hauz
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-divider bg-gray-50 flex-shrink-0">
          <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 rounded-sm text-sm transition-colors">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

