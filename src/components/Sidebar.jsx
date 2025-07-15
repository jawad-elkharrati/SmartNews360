import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Sparkles,
  Image as ImageIcon,
  Search,
  Settings as SettingsIcon,
  Bell,
} from 'lucide-react';

export const navItems = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/strategic', label: 'Vue stratégique', icon: Layers },
  { to: '/content', label: 'Générateur de contenu', icon: FileText },
  { to: '/titles', label: 'Générateur de titres', icon: Sparkles },
  { to: '/research', label: 'Deep Research', icon: Search },
  { to: '/images', label: 'Banque d\'images', icon: ImageIcon },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Paramètres', icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-950 border-r dark:border-gray-800 hidden md:block">
      <div className="p-6 flex items-center space-x-3">
        <img src="/tek_logo.png" alt="Tek Afrika" className="h-8" />
      </div>
      <nav className="mt-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
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
    </aside>
  );
}
