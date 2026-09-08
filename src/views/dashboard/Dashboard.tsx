import { Link } from 'react-router';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LogoutButton } from '../../components';
import UserHuntsList from '../../components/dashboard/UserHuntsList';
import LoginSSOButton from '../../components/LoginSSOButton';
import { submitClasses } from '../../components/settings/fields';
import { useUser } from '../../contexts/user';
import { useUserParticipateHunts } from '../../hooks/useUserParticipateHunts';
import ErrorView from '../error/Error.tsx';

export default function Dashboard() {
  const { user } = useUser();
  const userId = user?.id;

  // Le hook récupère maintenant directement les chasses
  const { participateHunts, isLoading, error } = useUserParticipateHunts(userId ?? 0);

  if (!user) {
    return <ErrorView status={401} message="Vous devez être connecté pour accéder à cette page" />;
  }

  if (error) {
    return <ErrorView status={500} message="Erreur lors du chargement du tableau de bord" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec bouton de déconnexion */}
        <div className="mb-8">
          <div className="mb-6 flex justify-end gap-2">
            {user.roles?.includes('ROLE_ADMIN') && <LoginSSOButton />}
            <LogoutButton />
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">
              🎯
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Mon Tableau de Bord
            </h1>
            <p className="text-lg sm:text-xl text-gray-700">
              Bienvenue, <span className="font-semibold text-green-700">{user.nickname}</span> !
            </p>
            {/* Toujours là, chasses en cours ou non : c'est la porte vers une nouvelle partie */}
            <Link to="/treasure-hunt" className={`${submitClasses} inline-flex items-center justify-center gap-2 mt-6`}>
              <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
              Trouver une chasse
            </Link>
          </div>
        </div>

        {/* Liste des chasses */}
        <UserHuntsList
          key={user.id} // Garder la key pour forcer le refresh si l'user change
          participateHunts={participateHunts}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}