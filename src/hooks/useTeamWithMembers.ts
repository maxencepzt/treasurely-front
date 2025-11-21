import { useMemo } from 'react';

import { useTeamByIdQuery, useTeamMembersByIdQuery, useTeamTreasureHuntsByIdQuery } from '../store/slices/api';
import type { TeamAPI, TeamTreasureHuntsAPI } from '../types/api';

/**
 * Hook custom qui combine les données d'une équipe avec ses membres et ses chasses au trésor
 * @param id - L'ID de l'équipe
 * @returns Les données de l'équipe avec les membres et les chasses, l'état de chargement et les erreurs
 */
export function useTeamWithMembers(id: number) {
  const {
    data: team,
    isLoading: isLoadingTeam,
    error: teamError
  } = useTeamByIdQuery({ id });

  const {
    data: membersResponse,
    isLoading: isLoadingMembers,
    error: membersError
  } = useTeamMembersByIdQuery({ id });

  const {
    data: treasureHuntsResponse,
    isLoading: isLoadingHunts,
    error: huntsError
  } = useTeamTreasureHuntsByIdQuery({ id });

  const teamWithMembersAndHunts = useMemo<(TeamAPI & { treasureHunts: TeamTreasureHuntsAPI[] }) | undefined>(() => {
    if (!team) return undefined;

    return {
      ...team,
      members: membersResponse?.members || [],
      treasureHunts: treasureHuntsResponse?.hunts || []
    };
  }, [team, membersResponse, treasureHuntsResponse]);

  return {
    data: teamWithMembersAndHunts,
    isLoading: isLoadingTeam || isLoadingMembers || isLoadingHunts,
    error: teamError || membersError || huntsError
  };
}
