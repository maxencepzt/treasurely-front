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
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl">
        {/* Header avec bouton retour */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 relative">
          <div className="absolute top-6 left-6">
            <BackButton variant="dark" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mt-8">
            Mon Tableau de Bord
          </h1>
          <p className="text-green-100 text-center mt-2">
            Bienvenue, {user.nickname}!
          </p>
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