import { BackButton } from '../../components';
import UserHuntsList from '../../components/dashboard/UserHuntsList';
import { useUser } from '../../contexts/user';
import { useUserParticipateHunts } from '../../hooks/useUserParticipateHunts';
import ErrorView from '../error/Error.tsx';

export default function Dashboard() {
  const { user } = useUser();

  // Si le provider fait son travail, user est chargé.
  // On passe user.id s'il existe, sinon on évite de passer 0 si possible,
  // mais gardons le comportement actuel en sécurisant juste la logique.
  const userId = user?.id;

  // Note: Idéalement le hook useUserParticipateHunts devrait accepter 'skip' ou null
  const { teamIds, isLoading, error } = useUserParticipateHunts(userId ?? 0);

  if (!user) {
    return <ErrorView status={401} message="Vous devez être connecté pour accéder à cette page" />;
  }

  if (error) {
    return <ErrorView status={500} message="Erreur lors du chargement du tableau de bord" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <div className="mb-6">
            <BackButton variant="light" />
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
          </div>
        </div>

        {/* Liste des chasses avec section de reprise intégrée */}
        {/* Ajout d'une clé key basée sur l'ID user pour forcer le remount si l'utilisateur change */}
        <UserHuntsList
          key={user.id}
          teamIds={teamIds}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}