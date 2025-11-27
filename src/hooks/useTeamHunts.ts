import { useEffect, useRef } from 'react';

import { useTeamParticipateHuntsByIdQuery } from '../store/slices/api';
import type { ParticipateHuntAPI } from '../types/api';

interface UseTeamHuntsOptions {
  teamId: number;
  onDataLoaded: (hunts: ParticipateHuntAPI[]) => void;
  onError: () => void;
}

/**
 * Hook qui récupère les participations d'une équipe
 * et les transmet via callback.
 *
 * @param teamId - L'ID de l'équipe
 * @param onDataLoaded - Callback appelé quand les données sont chargées
 * @param onError - Callback appelé en cas d'erreur
 */
export function useTeamHunts({ teamId, onDataLoaded, onError }: UseTeamHuntsOptions) {
  const { data, isSuccess, isError } = useTeamParticipateHuntsByIdQuery({ id: teamId });
  const hasLoadedRef = useRef(false);
  const hasErroredRef = useRef(false);
  const onDataLoadedRef = useRef(onDataLoaded);
  const onErrorRef = useRef(onError);

  // Keep refs updated
  useEffect(() => {
    onDataLoadedRef.current = onDataLoaded;
    onErrorRef.current = onError;
  }, [onDataLoaded, onError]);

  // Reset hasLoadedRef when teamId changes
  useEffect(() => {
    hasLoadedRef.current = false;
    hasErroredRef.current = false;
  }, [teamId]);

  // Handle successful data loading
  useEffect(() => {
    if (isSuccess && data?.participateHunts && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      onDataLoadedRef.current(data.participateHunts);
    }
  }, [isSuccess, data, teamId]);

  // Handle errors
  useEffect(() => {
    if (isError && !hasErroredRef.current) {
      hasErroredRef.current = true;
      onErrorRef.current();
    }
  }, [isError, teamId]);
}

