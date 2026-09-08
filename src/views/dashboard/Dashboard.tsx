import { Link } from 'react-router';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserHuntsList from '../../components/dashboard/UserHuntsList';
import StatTiles from '../../components/profile-page/StatTiles';
import ProfilePicture from '../../components/ProfilePicture';
import { submitClasses } from '../../components/settings/fields';
import { useUser } from '../../contexts/user';
import { useUserParticipateHunts } from '../../hooks/useUserParticipateHunts';
import ErrorView from '../error/Error.tsx';

/**
 * L'accueil du joueur connecté : qui il est, où il en est, et une chasse à trouver.
 * La déconnexion et l'accès à l'administration vivent dans les paramètres.
 */
export default function Dashboard() {
  const { user } = useUser();
  const { participateHunts, isLoading, error } = useUserParticipateHunts(user?.id ?? 0);

  if (!user) {
    return <ErrorView status={401} message="Vous devez être connecté pour accéder à cette page" />;
  }

  if (error) {
    return <ErrorView status={500} message="Erreur lors du chargement du tableau de bord" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <Link
            to="/profile"
            className="flex items-center gap-4 min-w-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
          >
            <ProfilePicture type="user" id={user.id} size={56} alt="" />
            <span className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Bonjour, {user.nickname}</h1>
              <span className="block text-base text-gray-700">Voir mon profil</span>
            </span>
          </Link>
          <Link to="/treasure-hunt" className={`${submitClasses} inline-flex items-center justify-center gap-2 sm:ml-auto`}>
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
            Trouver une chasse
          </Link>
        </div>

        <StatTiles user={user} className="grid-cols-2 sm:grid-cols-4" />

        <UserHuntsList
          key={user.id} // Garder la key pour forcer le refresh si l'user change
          participateHunts={participateHunts}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
