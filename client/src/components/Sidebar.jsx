'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/store';
import {
  Menu,
  Home,
  User,
  Map,
  Zap,
  AlertCircle,
  Link2,
  Folder,
} from 'lucide-react';

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const rol = useUserStore((state) => state.rol);
  const sidebarDesktopExpanded = useUserStore((state) => state.sidebarDesktopExpanded);
  const setSidebarDesktopExpanded = useUserStore((state) => state.setSidebarDesktopExpanded);

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.includes(href);
  };

  const links = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/identidad', label: 'Identidad', icon: User },
    { href: '/ruta-de-vuelo', label: 'Ruta de Vuelo', icon: Map },
    { href: '/competencias', label: 'Competencias', icon: Zap },
    { href: '/incertidumbre', label: 'Incertidumbre', icon: AlertCircle },
    { href: '/trazabilidad', label: 'Trazabilidad', icon: Link2 },
    { href: '/proyectos', label: 'Proyectos', icon: Folder },
  ];

  const handleNavClick = () => {
    if (!sidebarDesktopExpanded) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile */}
      <aside
        className={`glass-effect fixed lg:hidden w-64  text-white p-4 h-full overflow-y-auto z-50 top-0 left-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
        >
          <Menu size={24} />
        </button>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Colibrí OS</h2>
          <p className="text-sm text-gray-400 mb-6">Rol: {rol}</p>

          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className={`px-4 py-2 rounded transition-colors flex items-center gap-3 ${
                    isActive(link.href)
                      ? 'bg-blue-600 font-semibold'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Desktop */}
      <aside
        className={` border-right hidden lg:flex flex-col glass-effect-dark text-white h-screen overflow-y-auto fixed left-0 top-0 z-45 transition-all duration-300 ${
          sidebarDesktopExpanded ? 'w-64 p-4' : 'w-24 p-3'
        }`}
      >
        {/* Botón de toggle */}
        <button
          onClick={() => setSidebarDesktopExpanded(!sidebarDesktopExpanded)}
          className="p-3 hover:bg-gray-800 rounded-lg transition-colors flex justify-center mb-4"
          title={sidebarDesktopExpanded ? 'Contraer' : 'Expandir'}
        >
          <Menu size={24} />
        </button>

        {/* Header */}
        {sidebarDesktopExpanded && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Colibrí OS</h2>
            <p className="text-sm text-gray-400">Rol: {rol}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`p-3 rounded transition-colors flex items-center gap-3 ${
                  isActive(link.href)
                    ? 'bg-blue-600 font-semibold'
                    : 'text-gray-300 hover:bg-gray-800'
                } ${sidebarDesktopExpanded ? 'justify-start' : 'justify-center'}`}
                title={!sidebarDesktopExpanded ? link.label : ''}
              >
                <Icon size={20} className="shrink-0" />
                {sidebarDesktopExpanded && <span className="whitespace-nowrap">{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
