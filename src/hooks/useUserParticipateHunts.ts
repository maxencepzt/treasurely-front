import { useMemo } from 'react';

import { useGetUserParticipateHuntsByIdQuery } from '../store/slices/api';

/**
 * Hook custom qui récupère les participations aux chasses de l'utilisateur connecté
 * @param userId - L'ID de l'utilisateur
 */
export function useUserParticipateHunts(userId: number) {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useGetUserParticipateHuntsByIdQuery({ id: userId }, {
    skip: !userId || userId === 0
  });

  const participateHunts = useMemo(() => {
    return data?.participateHunts || [];
  }, [data]);

  return {
    participateHunts,
    isLoading,
    error,
    refetch
  };
}
