import { Link, useLocation } from 'react-router';
import { faGear, faHouse, faMapLocationDot, faPuzzlePiece, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useUser } from '../contexts/user';
import InstallPWA from './installPWA';
import ProfilePicture from './ProfilePicture';

const tabs = [
  { to: '/', label: 'Accueil', icon: faHouse, isActive: (pathname: string) => pathname === '/' },
  {
    to: '/treasure-hunt',
    label: 'Chasses',
    icon: faMapLocationDot,
    isActive: (pathname: string) => pathname.startsWith('/treasure-hunt') || pathname.startsWith('/riddle'),
  },
  {
    to: '/teams',
    label: 'Équipes',
    icon: faUsers,
    isActive: (pathname: string) => pathname.startsWith('/teams'),
  },
  {
    to: '/profile',
    label: 'Profil',
    icon: faUser,
    isActive: (pathname: string) => ['/profile', '/settings'].some((prefix) => pathname.startsWith(prefix)),
  },
];

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700';

/**
 * Le cadre de l'application : la page, la bannière d'installation et, pour un joueur connecté,
 * la navigation à trois entrées, Accueil, Chasses, Profil. À partir de 768 px c'est un en-tête,
 * en dessous une barre d'onglets fixée en bas de l'écran. Un visiteur (page d'accueil,
 * connexion) n'a ni l'un ni l'autre.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { pathname } = useLocation();
  const withNav = user !== null && pathname !== '/login';

  return (
    <>
      {withNav && user && (
        <header className="hidden md:block sticky top-0 z-40 bg-white border-b border-gray-200">
          <nav aria-label="Navigation principale" className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-8">
            <Link to="/" className={`flex items-center gap-2 text-lg font-bold text-gray-900 rounded ${focusRing}`}>
              <FontAwesomeIcon icon={faPuzzlePiece} className="text-green-700" aria-hidden="true" />
              Treasurely
            </Link>

            <ul className="flex items-center gap-1 flex-1">
              {tabs.map((tab) => {
                const active = tab.isActive(pathname);
                return (
                  <li key={tab.to}>
                    <Link
                      to={tab.to}
                      aria-current={active ? 'page' : undefined}
                      className={`inline-flex items-center gap-2 min-h-11 px-3 rounded-lg text-base font-medium transition-colors ${focusRing} ${
                        active ? 'text-green-800 bg-green-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <FontAwesomeIcon icon={tab.icon} aria-hidden="true" />
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link to="/profile" className={`flex items-center gap-2 min-h-11 px-2 rounded-lg text-base font-medium text-gray-900 hover:bg-gray-50 ${focusRing}`}>
              <ProfilePicture type="user" id={user.id} size={32} alt="" />
              <span className="max-w-40 truncate">{user.nickname}</span>
            </Link>
            <Link
              to={`/settings/profile/${user.id}`}
              aria-label="Paramètres"
              title="Paramètres"
              className={`flex items-center justify-center w-11 h-11 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 ${focusRing}`}
            >
              <FontAwesomeIcon icon={faGear} className="text-lg" aria-hidden="true" />
            </Link>
          </nav>
        </header>
      )}

      <div className={withNav ? 'pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0' : undefined}>{children}</div>

      <InstallPWA raised={withNav} />

      {withNav && (
        <nav aria-label="Navigation principale" className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
          <ul className="mx-auto max-w-md grid grid-cols-4">
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
