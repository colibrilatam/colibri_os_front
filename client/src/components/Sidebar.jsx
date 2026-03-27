'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/store';

export default function Sidebar() {
  const pathname = usePathname();
  const rol = useUserStore((state) => state.rol);

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.includes(href);
  };

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/identidad', label: 'Identidad' },
    { href: '/ruta-de-vuelo', label: 'Ruta de Vuelo' },
    { href: '/competencias', label: 'Competencias' },
    { href: '/incertidumbre', label: 'Incertidumbre' },
    { href: '/trazabilidad', label: 'Trazabilidad' },
    { href: '/proyectos', label: 'Proyectos' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 absolute h-fit rounded-br-3xl overflow-y-auto z-98 top-21 left-0">
      <h2 className="text-lg font-bold mb-4">Colibrí OS</h2>
      <p className="text-sm text-gray-400 mb-6">Rol: {rol}</p>

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded transition-colors ${
              isActive(link.href)
                ? 'bg-blue-600 text-(text-link) font-semibold'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
