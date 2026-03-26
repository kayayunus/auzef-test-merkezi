import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, XCircle, BarChart3 } from 'lucide-react';

export default function TabBar() {
  const navItems = [
    { to: '/', icon: Home, label: 'Sınavlar' },
    { to: '/mistakes', icon: XCircle, label: 'Yanlışlarım' },
    { to: '/stats', icon: BarChart3, label: 'Analiz' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe pt-2 px-6 z-50">
      <ul className="flex justify-between items-center max-w-md mx-auto relative pb-2">
        {navItems.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center transition-all duration-300 ${
                  isActive ? 'text-auzef font-bold transform -translate-y-1' : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              <item.icon size={26} className="mb-1" strokeWidth={2.5} />
              <span className="text-[10px] sm:text-xs font-semibold">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
