import { useTeamHunts } from '../../hooks/useTeamHunts';
import type { ParticipateHuntAPI } from '../../types/api';

interface TeamHuntsLoaderProps {
  teamId: number;
  onDataLoaded: (teamId: number, hunts: ParticipateHuntAPI[]) => void;
  onError: (teamId: number) => void;
}

/**
 * Composant invisible qui charge les participations d'une équipe
 * et les transmet au parent via callback.
 *
 * Ce composant ne rend rien visuellement - il sert uniquement
 * à permettre l'utilisation du hook useTeamHunts dans une boucle.
 */
export default function TeamHuntsLoader({ teamId, onDataLoaded, onError }: TeamHuntsLoaderProps) {
  useTeamHunts({
    teamId,
    onDataLoaded: (hunts) => onDataLoaded(teamId, hunts),
    onError: () => onError(teamId),
  });

  return null;
}

