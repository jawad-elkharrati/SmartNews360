import React from 'react';
import { useTheme } from './context/ThemeContext';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Tableau de bord from './pages/Tableau de bord';
import StrategicView from './pages/StrategicView';
import ContentGenerator from './pages/ContentGenerator';
import TitleGenerator from './pages/TitleGenerator';
import Paramètres from './pages/Paramètres';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

export default function App() {
  const { dark, toggle } = useTheme();
  const location = useLocation();

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleDark={toggle} />
          <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Tableau de bord />} />
                  <Route path="/strategic" element={<StrategicView />} />
                  <Route path="/content" element={<ContentGenerator />} />
                  <Route path="/titles" element={<TitleGenerator />} />
                  <Route path="/settings" element={<Paramètres />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        
      </div>
    </div>
  );
}
