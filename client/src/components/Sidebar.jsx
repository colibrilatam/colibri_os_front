'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/store';
import {
  Menu,
  Home,
  User,
  Map,
  AlertCircle,
  Link2,
  Folder,
  Layers,
  Building2,
  SearchCheck,
} from 'lucide-react';
import Button from './Button';
import { useRouter } from 'next/navigation';
import NotificationPopup from './NotificationPopup';
import { useState } from 'react';
import EntrepreneurCard from './Contact';
import TourButton from './tutoriales/TourButton';
import { useProject } from '@/lib/projectContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { logout } = useUserStore();
  const { t } = useTranslation('sidebar');
  const rol = useUserStore((state) => state.rol);
  const { dbProject } = useProject();
  //console.log(dbProject);
  const sidebarDesktopExpanded = useUserStore(
    (state) => state.sidebarDesktopExpanded,
  );
  const setSidebarDesktopExpanded = useUserStore(
    (state) => state.setSidebarDesktopExpanded,
  );
  const router = useRouter();

  const [notification, setNotification] = useState(false);

  // obtencion del id por parametro
  const pathname = usePathname();

  const capaActual = pathname.split('/').pop();

  // 1. Dividimos por "/" -> ["", "dashboard", "1", "senial"]
  // 2. El "1" está en la posición 2 del array
  const segments = pathname.split('/');
  const id = segments[2];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.includes(href);
  };

  const links = [
    {
      href: `/home`,
      label: t('home'),
      icon: Home,
      excludeRoles: ['mecenas_semilla', 'entrepreneur'],
    },
    {
      href: `/dashboard/${id}/about`,
      label: t('projectProfile'),
      icon: Building2,
      excludeRoles: null,
    },
    {
      href: `/dashboard/${id}/identidad`,
      label: t('identity'),
      icon: User,
      excludeRoles: null,
    },
    {
      href: `/dashboard/${id}/reputacion`,
      label: t('reputation'),
      icon: Layers,
      excludeRoles: null,
    },
    {
      href: `/dashboard/${id}/tramo`,
      label: t('segment'),
      icon: AlertCircle,
      excludeRoles: null,
    },
    {
      href: `/dashboard/${id}/trayectoria`,
      label: t('trajectory'),
      icon: Map,
      excludeRoles: null,
    },
    {
      href: `/dashboard/${id}/evidencia`,
      label: t('evidence'),
      icon: Link2,
      excludeRoles: null,
    },
    {
      href: '/user/nft',
      label: t('nfts'),
      icon: Folder,
      roles: ['mecenas_semilla'],
    },
  ].filter((link) => {
    if (link.excludeRoles) return !link.excludeRoles.includes(rol); // excluir si el rol está en la lista
    if (link.roles) return link.roles.includes(rol); // incluir solo si el rol está en la lista
    return true; // visible para todos
  });

  const handleNavClick = () => {
    if (!sidebarDesktopExpanded) {
      onClose();
    }
  };

  function handleLogout() {
    logout();
    router.push('/login');
  }

  function handleContact() {
    setNotification(true);
  }
  function handleCloseNotification() {
    setNotification(false);
  }

  return (
    <>
      {notification && (
        <NotificationPopup
          isOpen={notification}
          message={t('entrepreneurData')}
          onClose={handleCloseNotification}
        >
          <EntrepreneurCard
            name="Valentina Moreno"
            email="valentina.moreno@empresa.com"
            phone="+54 11 4234 5678"
            linkedin="linkedin.com/in/valentina-moreno"
          />
        </NotificationPopup>
      )}
      {/* Mobile */}
      <aside
        className={`flex flex-col justify-between surface-dark border-theme-right fixed lg:hidden w-64 p-4 h-full overflow-y-auto z-50 top-0 left-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <button
            onClick={onClose}
            className="z-50 p-2 glass-effect-dark rounded-lg transition-colors flex items-center justify-center"
          >
            <Menu size={24} />
          </button>

          <div className="mt-6">
            <h2 className="text-h3 mb-2">Colibrí OS</h2>
            {/*<p className="text-helper mb-6">Rol: {rol}</p>*/}

            <nav className="flex flex-col gap-2">
              {links.map((link) => {
                if (!link) return null;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={`px-4 py-2 rounded transition-colors flex items-center gap-3 ${
                      isActive(link.href)
                        ? 'sidebar-item-active'
                        : 'sidebar-item'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <TourButton tourName={capaActual}></TourButton>
          <Button
            color="blue"
            content="Contactar al emprendedor"
            onClick={handleContact}
          ></Button>
          <Button color="red" content="Cerrar sesión" onClick={handleLogout} />
        </div>
      </aside>

      {/* Desktop */}
      <aside
        className={`border-theme-right surface hidden lg:flex flex-col h-screen overflow-y-auto fixed left-0 top-0 z-50 transition-all duration-300 ${
          sidebarDesktopExpanded ? 'w-64 p-4' : 'w-24 p-3'
        }`}
      >
        {/* Botón de toggle */}
        <button
          onClick={() => setSidebarDesktopExpanded(!sidebarDesktopExpanded)}
          className="p-3 mb-2 rounded-lg glass-effect-dark hover:surface-secondary text-(--text-primary) transition-colors flex justify-center "
          title={
            sidebarDesktopExpanded ? t('collapse') : t('expand')
          }
        >
          <Menu size={24} />
        </button>

        {/* Header */}
        {sidebarDesktopExpanded && (
          <div className="mb-6">
            <h2 className="text-h3 flex justify-center mb-2">
              {dbProject?.projectName ?? 'Colibrí OS'}
            </h2>
            {/*<p className="text-helper">Rol: {rol}</p>*/}
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
                  isActive(link.href) ? 'sidebar-item-active' : 'sidebar-item'
                } ${
                  sidebarDesktopExpanded ? 'justify-start' : 'justify-center'
                }`}
                title={!sidebarDesktopExpanded ? link.label : ''}
              >
                <Icon size={20} className="shrink-0" />
                {sidebarDesktopExpanded && (
                  <span className="whitespace-nowrap">{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
        {sidebarDesktopExpanded && (
          <div className="flex flex-col gap-4">
            <TourButton tourName={capaActual}></TourButton>
            <Button
              color="blue"
              /* content="Contactar al emprendedor" */
              content={t('contactEntrepreneur')}

              onClick={handleContact}
            ></Button>
            <Button
              color="red"
              /* content="Cerrar sesión" */
             content={t('logout')}
              onClick={handleLogout}
            />
          </div>
        )}
      </aside>
    </>
  );
}
