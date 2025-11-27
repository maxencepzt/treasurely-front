import { useMemo } from 'react';

import { useRiddleGetByIdQuery, useTreasureHuntGetByIdQuery } from '../store/slices/api';
import type { ParticipateHuntAPI } from '../types/api';
import { getIdFromUrl } from '../utils/api';

/**
 * Hook personnalisé qui gère la logique métier pour reprendre une chasse au trésor.
 *
 * @param participateHunt - Les données de participation à la chasse
 * @returns Les données de la chasse, l'énigme actuelle, la progression et l'état de chargement
 */
export function useResumeHunt(participateHunt: ParticipateHuntAPI) {
  // Récupérer l'ID de la TreasureHunt
  const treasureHuntId = useMemo(() => {
    if (!participateHunt?.hunt) return 0;
    return getIdFromUrl(participateHunt.hunt);
  }, [participateHunt?.hunt]);

  // Récupérer les données de la TreasureHunt
  const { data: treasureHunt, isLoading: isLoadingHunt } = useTreasureHuntGetByIdQuery(
    { id: treasureHuntId },
    { skip: !treasureHuntId }
  );

  // Récupérer l'ID de l'énigme actuelle
  const currentRiddleId = useMemo(() => {
    if (!participateHunt?.currentRiddle) return 0;
    return getIdFromUrl(participateHunt.currentRiddle);
  }, [participateHunt?.currentRiddle]);

  // Récupérer les données de l'énigme actuelle
  const { data: currentRiddle, isLoading: isLoadingRiddle } = useRiddleGetByIdQuery(
    { id: currentRiddleId },
    { skip: !currentRiddleId }
  );

  // Calculer le nombre d'énigmes complétées
  const completedSteps = useMemo(() => {
    if (!currentRiddle) return 0;
    // orderNumber commence à 1, donc on prend orderNumber - 1 pour les énigmes complétées
    return currentRiddle.orderNumber - 1;
  }, [currentRiddle]);

  // Nombre total d'énigmes
  const totalSteps = treasureHunt?.riddleCount ?? 0;

  // État de chargement global
  const isLoading = isLoadingHunt || isLoadingRiddle;

  // Vérifier si la chasse est terminée
  const isFinished = participateHunt.finished;

  // Vérifier si on peut afficher la carte (données complètes et non terminée)
  const shouldDisplay = !isLoading && !!treasureHunt && !!currentRiddle && !isFinished;

  return {
    treasureHuntId,
    treasureHunt: treasureHunt!,
    currentRiddle: currentRiddle!,
    completedSteps,
    totalSteps,
    isLoading,
    isFinished,
    shouldDisplay,
  };
}

