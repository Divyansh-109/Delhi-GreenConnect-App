import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Map, Leaf, Calendar, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Layout({ children }) {
  const location = useLocation();
  const { currentUser } = useAuth();
  const isHome = location.pathname === '/' || location.pathname === '/home';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative w-full h-full">
      <header className="bg-primary-600 text-white p-4 shadow-md sticky top-0 z-40 flex justify-between items-center h-16">
        <h1 className="text-xl font-bold">Delhi GreenConnect</h1>
        {currentUser ? (
          <img src={currentUser.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-white/50 shadow-sm" />
        ) : (
          !isHome && <div className="text-sm bg-primary-700 px-3 py-1 rounded-full shadow-inner">DDA Park View</div>
        )}
      </header>

      <main className="flex-1 w-full relative bg-slate-50 overflow-auto pb-24">
        {children}
      </main>

      {!isHome && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
          <NavItem to="/park/yamuna" icon={<HomeIcon size={24} />} label="Park" />
          <NavItem to="/map" icon={<Map size={24} />} label="Map" />
          <NavItem to="/flora/1" icon={<Leaf size={24} />} label="Flora" />
          <NavItem to="/events" icon={<Calendar size={24} />} label="Events" />
        </nav>
      )}
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to} 
      className={({isActive}) => `flex flex-col items-center justify-center relative w-20 h-full transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {({ isActive }) => (
        <>
          {icon}
          <span className="text-[10px] sm:text-xs mt-1 font-medium">{label}</span>
          <div className={`h-1 w-8 rounded-t-full absolute bottom-0 transition-opacity ${isActive ? 'bg-primary-600 opacity-100' : 'opacity-0'}`} />
        </>
      )}
    </NavLink>
  );
}
