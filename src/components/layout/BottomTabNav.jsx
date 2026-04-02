import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Map, Leaf, Calendar, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomTabNav() {
  const tabs = [
    { name: 'Park', to: '/park/yamuna', icon: <HomeIcon size={24} /> },
    { name: 'Map', to: '/map', icon: <Map size={24} /> },
    { name: 'Flora', to: '/flora/1', icon: <Leaf size={24} /> },
    { name: 'Events', to: '/events', icon: <Calendar size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-vanilla/90 backdrop-blur-xl border-t border-white/40 flex justify-around items-center h-16 z-50 shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.03)] pb-safe px-2">
      {tabs.map((tab) => (
        <NavItem key={tab.to} to={tab.to} icon={tab.icon} label={tab.name} />
      ))}
    </nav>
  );
}

function NavItem({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to) || 
                   (to === '/park/yamuna' && location.pathname.startsWith('/park'));

  const handleTouch = () => {
    // Synthetic haptic feedback
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  return (
    <NavLink 
      to={to} 
      className="relative flex flex-col items-center justify-center w-16 h-14 transition-colors active:scale-90 touch-manipulation z-10"
      replace
      onTouchStart={handleTouch}
      onMouseDown={handleTouch}
    >
      <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-primary-700 -translate-y-0.5' : 'text-slate-400 hover:text-slate-600'}`}>
        {icon}
        <span className="text-[10px] mt-1 font-bold tracking-wide">{label}</span>
      </div>
      
      {isActive && (
        <motion.div 
          layoutId="bottomNavIndicator"
          className="absolute inset-0 bg-primary-100/50 rounded-2xl shadow-inner border border-white/50 -z-10"
          initial={false}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        />
      )}
    </NavLink>
  );
}

