import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/park/yamuna-biodiversity-park' },
    { label: 'Species Map', path: '/map' },
    { label: 'Flora Detail', path: '/flora/1042' },
    { label: 'Upcoming Events', path: '/events' },
    { label: 'About', path: '/about' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col relative w-full h-full font-sans">
      <header className="bg-header text-white sticky top-0 z-[500] w-full shadow-sm border-b border-header">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight border-r border-white/20 pr-6 mr-2">DELHI GREEN CONNECT</h1>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6 items-center">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className={`text-sm font-semibold hover:text-primary-500 transition-colors ${location.pathname.startsWith(link.path) ? 'text-primary-500' : 'text-gray-300'}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <Link to="/profile" className="hidden md:block bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold px-5 py-2 rounded transition-colors shadow-md">
                My Profile
              </Link>
            ) : (
              <Link to="/login" className="hidden md:block bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold px-5 py-2 rounded transition-colors shadow-md">
                Login
              </Link>
            )}
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[600] bg-black/50 md:hidden flex justify-end">
          <div className="w-64 bg-white h-full p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-divider pb-4">
              <span className="font-bold text-lg text-header">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} className="text-header" /></button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 hover:text-primary-600">
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-divider pt-4 mt-2">
                <Link to={currentUser ? "/profile" : "/login"} onClick={() => setMobileMenuOpen(false)} className="w-full text-left font-bold text-primary-600">
                  {currentUser ? "My Profile" : "Login"}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 w-full bg-divider/10">
        <div className="max-w-[1400px] mx-auto w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
