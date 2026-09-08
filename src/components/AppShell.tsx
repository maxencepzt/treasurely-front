import { Link, useLocation } from 'react-router';
import { faHouse, faMapLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useUser } from '../contexts/user';
import InstallPWA from './installPWA';

const tabs = [
  { to: '/', label: 'Accueil', icon: faHouse, isActive: (pathname: string) => pathname === '/' },
  {
    to: '/treasure-hunt',
    label: 'Chasses',
    icon: faMapLocationDot,
    isActive: (pathname: string) => pathname.startsWith('/treasure-hunt') || pathname.startsWith('/riddle'),
  },
  {
    to: '/profile',
    label: 'Profil',
    icon: faUser,
    isActive: (pathname: string) => ['/profile', '/settings', '/teams'].some((prefix) => pathname.startsWith(prefix)),
  },
];

/**
 * Le cadre de l'application : la page, la bannière d'installation, puis la barre de
 * navigation basse à trois onglets pour un joueur connecté. Un visiteur (page d'accueil,
 * connexion) n'a pas de barre, ni de réserve en bas.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { pathname } = useLocation();
  const withNav = user !== null && pathname !== '/login';

  return (
    <>
      <div className={withNav ? 'pb-[calc(4rem+env(safe-area-inset-bottom))]' : undefined}>{children}</div>

      <InstallPWA raised={withNav} />

      {withNav && (
        <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
          <ul className="mx-auto max-w-md grid grid-cols-3">
            {tabs.map((tab) => {
              const active = tab.isActive(pathname);
              return (
                <li key={tab.to}>
                  <Link
                    to={tab.to}
                    aria-current={active ? 'page' : undefined}
                    className={`flex flex-col items-center justify-center gap-1 h-16 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-700 ${
                      active ? 'text-green-800' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="text-xl" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}
