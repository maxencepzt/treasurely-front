import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ParticipateHuntAPI } from '../types/api';

/**
 * Hook personnalisé qui gère la logique métier de la liste des chasses au trésor
 * d'un utilisateur à travers plusieurs équipes.
 *
 * @param teamIds - Les IDs des équipes de l'utilisateur
 * @param isLoadingTeams - Indicateur de chargement des équipes
 * @returns Les données triées, les callbacks et l'état de chargement
 */
export function useUserHuntsList(teamIds: number[], isLoadingTeams?: boolean) {
  const [allHunts, setAllHunts] = useState<ParticipateHuntAPI[]>([]);

  // Initialisation synchrone de loadingStates
  // Si on a des teamIds dès le départ, on considère qu'ils sont en chargement
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(() => {
    if (teamIds.length > 0) {
      const initial: Record<number, boolean> = {};
      teamIds.forEach(id => initial[id] = true);
      return initial;
    }
    return {};
  });

  // On initialise la ref avec la valeur actuelle pour éviter un double déclenchement inutile
  const previousTeamIdsRef = useRef<string>(JSON.stringify(teamIds));

  // Store serialized teamIds to detect real changes
  const teamIdsString = useMemo(() => JSON.stringify(teamIds), [teamIds]);

  // Reset state when teamIds change (use ref to avoid triggering on every render)
  useEffect(() => {
    // Only reset if teamIds actually changed
    if (teamIdsString === previousTeamIdsRef.current) {
      return;
    }

    previousTeamIdsRef.current = teamIdsString;
    const parsedTeamIds = JSON.parse(teamIdsString) as number[];

    if (parsedTeamIds.length === 0) {
      setAllHunts([]);
      setLoadingStates({});
      return;
    }

    const initialLoadingStates: Record<number, boolean> = {};
    parsedTeamIds.forEach(id => {
      initialLoadingStates[id] = true;
    });

    // Reset hunts and loading states when teams change
    setAllHunts([]);
    setLoadingStates(initialLoadingStates);
  }, [teamIdsString]);

  // Memoize callbacks to prevent infinite loops
  const handleTeamDataLoaded = useCallback((teamId: number, hunts: ParticipateHuntAPI[]) => {
    setAllHunts(prev => {
      // Remove existing hunts from this team and add new ones
      const filtered = prev.filter(h => {
        const huntTeamId = h.playerTeam ? parseInt(h.playerTeam.split('/').pop() || '0') : 0;
        return huntTeamId !== teamId;
      });
      return [...filtered, ...hunts];
    });

    setLoadingStates(prev => ({ ...prev, [teamId]: false }));
  }, []);

  const handleTeamError = useCallback((teamId: number) => {
    setLoadingStates(prev => ({ ...prev, [teamId]: false }));
  }, []);

  // Sort hunts: in-progress first, then by date
  const sortedHunts = useMemo(() => {
    return [...allHunts].sort((a, b) => {
      if (a.finished !== b.finished) {
        return a.finished ? 1 : -1;
      }
      return new Date(b.lastParticipate).getTime() - new Date(a.lastParticipate).getTime();
    });
  }, [allHunts]);

  // Find most recent in-progress hunt - MEMOIZED
  const mostRecentInProgress = useMemo(() => {
    return sortedHunts.find(hunt => !hunt.finished);
  }, [sortedHunts]);

  const isLoading = isLoadingTeams || Object.values(loadingStates).some(state => state);

  return {
    sortedHunts,
    mostRecentInProgress,
    isLoading,
    handleTeamDataLoaded,
    handleTeamError,
  };
}
