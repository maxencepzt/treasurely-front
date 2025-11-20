import { useTeamByIdQuery } from '../../store/slices/api.ts';
import { getIdFromUrl } from '../../utils/api.ts';
import ProfileTeamButton from './ProfileTeamButton.tsx';

/**
 * Liste des équipes d'un utilisateur
 * Ne s'affiche que lorsque toutes les équipes sont chargées
 * @param teamRoutes Tableau de routes d'équipes (ex: ["/api/teams/1", "/api/teams/2"])
 * @example <ProfileTeamsList teamRoutes={userTeams.teams} />
 */
export default function ProfileTeamsList({ teamRoutes }: { teamRoutes: string[] }) {
  // Récupérer toutes les équipes
  const teamQueries = teamRoutes.map((teamRoute) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTeamByIdQuery({ id: getIdFromUrl(teamRoute) });
  });

  // Vérifier si au moins une équipe est en cours de chargement
  const isAnyLoading = teamQueries.some((query) => query.isLoading);

  // Vérifier s'il y a des erreurs
  const hasErrors = teamQueries.some((query) => query.error);

  // Ne rien afficher tant que toutes les équipes ne sont pas chargées
  if (isAnyLoading || hasErrors) {
    return null;
  }

  return (
    <div className="px-4 pb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Équipes</h2>
      <div className="flex flex-wrap gap-2">
        {teamRoutes.map((teamRoute) => (
          <ProfileTeamButton key={teamRoute} teamRoute={teamRoute} />
        ))}
      </div>
    </div>
  );
}

