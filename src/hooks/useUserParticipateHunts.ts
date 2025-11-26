import { useMemo } from 'react';

import { useUserTeamsByIdQuery } from '../store/slices/api';
import { getIdFromUrl } from '../utils/api';

/**
 * Hook custom qui récupère les IDs des équipes de l'utilisateur
 * @param userId - L'ID de l'utilisateur
 * @returns Les IDs des équipes, l'état de chargement et les erreurs
 */
export function useUserParticipateHunts(userId: number) {
  const {
    data: userTeams,
    isLoading,
    error
  } = useUserTeamsByIdQuery({ id: userId }, { skip: !userId });

  // Serialize teams array to get stable reference
  const teamsString = useMemo(() => {
    return JSON.stringify(userTeams?.teams || []);
  }, [userTeams?.teams]);

  const teamIds = useMemo(() => {
    const teams = JSON.parse(teamsString);
    if (!teams || teams.length === 0) return [];
    return teams.map((teamUrl: string) => getIdFromUrl(teamUrl));
  }, [teamsString]);


  return {
    teamIds,
    isLoading,
    error
  };
}
