import { useMemo } from 'react';

import { useTeamByIdQuery, useTeamMembersByIdQuery } from '../store/slices/api';
import type { TeamAPI } from '../types/api';

/**
 * Hook custom qui combine les données d'une équipe avec ses membres
 * @param id - L'ID de l'équipe
 * @returns Les données de l'équipe avec les membres, l'état de chargement et les erreurs
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

  const teamWithMembers = useMemo<TeamAPI | undefined>(() => {
    if (!team) return undefined;

    return {
      ...team,
      members: membersResponse?.members || []
    };
  }, [team, membersResponse]);

  return {
    data: teamWithMembers,
    isLoading: isLoadingTeam || isLoadingMembers,
    error: teamError || membersError
  };
}

