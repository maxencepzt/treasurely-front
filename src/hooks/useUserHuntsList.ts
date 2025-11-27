import { useMemo } from 'react';

import type {ParticipateHuntAPI} from '../types/api';

/**
 * Hook pour gérer la logique d'affichage (tri, filtre reprise) des chasses
 */
export function useUserHuntsList(participateHunts: ParticipateHuntAPI[]) {

  // Logique pour trouver la chasse en cours la plus récente (pour le bouton "Reprendre")
  const mostRecentInProgress = useMemo(() => {
    const inProgressHunts = participateHunts.filter(h => !h.finished);

    if (inProgressHunts.length === 0) return null;

    // On trie par date de dernière participation (le plus récent en premier)
    return inProgressHunts.sort((a, b) => {
      return new Date(b.lastParticipate).getTime() - new Date(a.lastParticipate).getTime();
    })[0];
  }, [participateHunts]);

  // Logique de tri général pour la liste (par exemple les plus récentes en premier)
  const sortedHunts = useMemo(() => {
    // Créer une copie pour ne pas muter le state original
    return [...participateHunts].sort((a, b) => {
      // Priorité aux non finies, puis par date
      if (a.finished === b.finished) {
        return new Date(b.lastParticipate).getTime() - new Date(a.lastParticipate).getTime();
      }
      return a.finished ? 1 : -1;
    });
  }, [participateHunts]);

  return {
    sortedHunts,
    mostRecentInProgress,
  };
}