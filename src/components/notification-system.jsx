
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Notification context
 */
const NotificationContext = createContext(null);

export const NotificationProvider = ({ children, initial = [] }) => {
  const [notifications, setNotifications] = useState(initial);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addNotification = useCallback((notif) => {
    setNotifications(prev => {
      // avoid duplicate by title+desc
      const exists = prev.some(n => n.title === notif.title && n.desc === notif.desc);
      if (exists) return prev;
      return [{ id: Date.now()+Math.random(), read: false, ...notif }, ...prev];
    });
  }, []);

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markRead, markAllRead, unreadCount, drawerOpen, setDrawerOpen }}>
      {children}
      <NotificationDrawer />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

/**
 * Drawer component rendered via portal
 */
const NotificationDrawer = () => {
  const { drawerOpen, setDrawerOpen, notifications, markRead, markAllRead } = useNotifications();

  // close on escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keyup', onKey);
    return () => window.removeEventListener('keyup', onKey);
  }, [setDrawerOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          />
          {/* panel */}
          <motion.aside
            key="panel"
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 z-50 shadow-xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          >
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <button
                className="text-sm text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-30"
                disabled={notifications.every(n => n.read)}
                onClick={markAllRead}
              >
                Tout marquer lu
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4">
  {notifications.length === 0 ? (
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-20">Aucune notification</p>
  ) : (
    <ul className="space-y-3">
      {notifications.map(n => (
        <motion.li
          key={n.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={() => !n.read && markRead(n.id)}
          className={[
            'border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer transition-colors',
            n.read ? 'bg-white dark:bg-gray-900' : 'bg-white dark:bg-gray-900 border-l-4 border-l-[#1e90ff] hover:bg-blue-50 dark:hover:bg-blue-950'
          ].join(' ')}
        >
          <p className="font-medium leading-snug">{n.title}</p>
          {n.desc && <p className="text-sm text-gray-600 dark:text-gray-400">{n.desc}</p>}
        </motion.li>
      ))}
    </ul>
  )}
</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

/**
 * Notification button – can be used anywhere
 */
export const NotificationButton = ({ className = '' }) => {
  const { unreadCount, setDrawerOpen } = useNotifications();
  return (
    <button
      className={['relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition', className].join(' ')}
      onClick={() => setDrawerOpen(true)}
      aria-label="Notifications"
    >
      <Bell size={20} className="text-gray-600 dark:text-gray-100" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] leading-none h-4 w-4">
          {unreadCount}
        </span>
      )}
    </button>
  );
};
