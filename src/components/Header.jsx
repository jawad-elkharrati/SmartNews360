import React, { useEffect } from 'react';
import { Search, Sun, Moon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { NotificationButton, useNotifications } from './notification-system';
import { useAuth } from '../context/AuthContext';
import { fetchHeadlines } from '../utils/groqNews';

export default function Header({ toggleDark }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addNotification } = useNotifications();

  // Load headlines every 5 minutes and push as notifications
  useEffect(() => {
    let abort = false;
    const load = async () => {
      try {
        const data = await fetchHeadlines(10);
        if (!abort && Array.isArray(data)) {
          data.forEach((t) => addNotification({ title: t }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => {
      abort = true;
      clearInterval(id);
    };
  }, [addNotification]);

  const handleDéconnexion = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur dark:bg-gray-900/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        {/* Left group */}
        <div className="flex items-center gap-2">
          <Search size={20} className="text-gray-500 dark:text-gray-400" />
        </div>

        {/* Right group */}
        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Dark mode"
          >
            <Sun className="block dark:hidden text-gray-600" size={18} />
            <Moon className="hidden dark:block text-gray-100" size={18} />
          </button>

          {/* Notifications */}
          <NotificationButton />

          {/* User / logout */}
          <button
            onClick={handleDéconnexion}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Déconnexion"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
