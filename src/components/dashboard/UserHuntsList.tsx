import { useUserHuntsList } from '../../hooks/useUserHuntsList';
import { Loading } from '..';
import ResumeHuntCard from './ResumeHuntCard';
import TeamHuntsLoader from './TeamHuntsLoader';
import UserHuntCard from './UserHuntCard';

interface UserHuntsListProps {
  teamIds: number[];
  isLoading?: boolean;
}

/**
 * Composant qui affiche la liste des chasses au trésor d'un utilisateur.
 * Il affiche également une section pour reprendre la chasse en cours la plus récente.
 */
export default function UserHuntsList({ teamIds, isLoading: isLoadingTeams }: UserHuntsListProps) {
  // Utiliser le hook personnalisé pour gérer toute la logique métier
  const {
    sortedHunts,
    mostRecentInProgress,
    isLoading,
    handleTeamDataLoaded,
    handleTeamError,
  } = useUserHuntsList(teamIds, isLoadingTeams);

  return (
    <>
      {/* Invisible loaders for each team using the hook */}
      {teamIds.map(teamId => (
        <TeamHuntsLoader
          key={teamId}
          teamId={teamId}
          onDataLoaded={handleTeamDataLoaded}
          onError={handleTeamError}
        />
      ))}

      {/* Affichage conditionnel : Loading ou Contenu */}
      {isLoading && sortedHunts.length === 0 ? (
        <Loading />
      ) : (
        <div className="space-y-8">
          {/* Resume hunt section */}
          {mostRecentInProgress && (
            <div>
              <ResumeHuntCard participateHunt={mostRecentInProgress} />
            </div>
          )}

          {/* List of all hunts */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3 justify-center">
              <span className="text-4xl">🗺️</span>
              <span>Vos chasses au trésor</span>
            </h2>

            {sortedHunts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedHunts.map((participateHunt) => (
                  <UserHuntCard
                    key={participateHunt["@id"]}
                    participateHunt={participateHunt}
                  />
                ))}
              </div>
            ) : (
              // Afficher le message "vide" uniquement si on ne charge plus
              <div className="px-8 py-16 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
                <p className="text-gray-500 text-lg text-center">
                  Vous n'avez participé à aucune chasse au trésor pour le moment
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}