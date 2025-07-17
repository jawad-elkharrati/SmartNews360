import React, { useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import StrategicView from './pages/StrategicView';
import ContentGenerator from './pages/ContentGenerator';
import TitleGenerator from './pages/TitleGenerator';
import ImageSearch from './pages/ImageSearch';
import DeepResearch from './pages/DeepResearch';
import ArticleEditor from './pages/ArticleEditor';
import ContentPlanning from './pages/ContentPlanning';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Humanize from "./pages/Humanize";
import ChatBotWidget from './components/ChatBotWidget';
import { ChatProvider } from './context/ChatContext';
import AutoTranslate from './pages/AutoTranslate';
import LaureataResources from './pages/LaureataResources';
import LessonPython from './pages/LessonPython';

export default function App() {
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ChatProvider>
      <div className={dark ? 'dark' : ''}>
      <div className="h-screen flex">
        <Sidebar />
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleDark={toggle} onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-auto p-6 bg-white dark:bg-gray-900 shadow md:rounded-2xl m-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/strategic" element={<StrategicView />} />
                  <Route path="/content" element={<ContentGenerator />} />
                  <Route path="/titles" element={<TitleGenerator />} />
                  <Route path="/research" element={<DeepResearch />} />
                  <Route path="/images" element={<ImageSearch />} />
                  <Route path="/editor" element={<ArticleEditor />} />
                  <Route path="/humanize" element={<Humanize />} />
                  <Route path="/translate" element={<AutoTranslate />} />
                  <Route path="/planning" element={<ContentPlanning />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/laureata-resources" element={<LaureataResources />} />
                  <Route path="/lesson-python" element={<LessonPython />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <ChatBotWidget />
    </div>
    </ChatProvider>
  );
}
