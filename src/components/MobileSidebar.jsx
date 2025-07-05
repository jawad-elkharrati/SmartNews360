import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Sidebar, { navItems } from './Sidebar';

export default function MobileSidebar({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-950 z-50 shadow-lg flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <img src="/tek_logo.png" alt="Tek Afrika" className="h-8" />
              <button
                onClick={onClose}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Fermer"
              >
                <X size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <nav className="mt-4 space-y-1 flex-1 overflow-y-auto">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-6 py-3 rounded-r-full transition text-sm ${
                      isActive
                        ? 'bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
