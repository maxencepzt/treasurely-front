import { useMemo } from 'react';

import { useTreasureHuntGetByIdQuery } from '../store/slices/api';
import type { ParticipateHuntAPI } from '../types/api';
import { getIdFromUrl } from '../utils/api';

/**
 * Hook personnalisé qui gère la logique métier pour reprendre une chasse au trésor.
 *
 * La progression vient de `riddlesSolved` : lire l'énigme en cours démarrerait son
 * chronomètre, ce que le tableau de bord ne doit jamais faire.
 *
 * @param participateHunt - Les données de participation à la chasse
 * @returns Les données de la chasse, l'énigme à reprendre, la progression et l'état de chargement
 */
export function useResumeHunt(participateHunt: ParticipateHuntAPI) {
  const treasureHuntId = useMemo(() => getIdFromUrl(participateHunt.hunt), [participateHunt.hunt]);
  const currentRiddleId = useMemo(() => getIdFromUrl(participateHunt.currentRiddle), [participateHunt.currentRiddle]);

  const { data: treasureHunt, isLoading } = useTreasureHuntGetByIdQuery({ id: treasureHuntId });

  const completedSteps = participateHunt.riddlesSolved;
  const totalSteps = treasureHunt?.riddleCount ?? 0;
  const isFinished = participateHunt.finished;
  const shouldDisplay = !isLoading && !!treasureHunt && !isFinished;

  return {
    treasureHuntId,
    currentRiddleId,
    treasureHunt: treasureHunt!,
    completedSteps,
    totalSteps,
    isLoading,
    isFinished,
    shouldDisplay,
  };
}
