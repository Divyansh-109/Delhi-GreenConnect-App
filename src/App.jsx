import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Note: These will be moved to separate files soon.
import Home from './pages/Home';
import Park from './pages/Park';
import MapView from './pages/Map';
import Flora from './pages/Flora';
import Community from './pages/Community';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import SOSButton from './components/safety/SOSButton';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const [showPWA, setShowPWA] = useState(false);

  useEffect(() => {
    // 10 second timeout for "Add to Home Screen" standard flow
    const timer = setTimeout(() => {
      setShowPWA(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/park/:parkId" element={<Park />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/flora/:floraId" element={<Flora />} />
              
              {/* Protected UGC Route */}
              <Route path="/events" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Layout>

        <SOSButton />
        
        {showPWA && (
          <div className="fixed bottom-24 left-4 right-4 bg-primary-600 text-white p-4 rounded-xl shadow-lg flex justify-between items-center z-[100] animate-bounce">
            <div className="flex flex-col">
              <span className="font-bold">Add Delhi GreenConnect</span>
              <span className="text-sm opacity-90">to your Home Screen</span>
            </div>
            <button 
              className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold shadow-sm"
              onClick={() => setShowPWA(false)}
            >
              Add
            </button>
          </div>
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
