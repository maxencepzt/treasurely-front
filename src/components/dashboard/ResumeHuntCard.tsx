import { useNavigate } from 'react-router';

import { useResumeHunt } from '../../hooks/useResumeHunt';
import type { ParticipateHuntAPI } from '../../types/api';
import { Loading } from '..';
import StepProgressBar from './StepProgressBar';

interface ResumeHuntCardProps {
  participateHunt: ParticipateHuntAPI;
}

/**
 * Composant qui affiche une carte pour reprendre une chasse au trésor en cours.
 * Affiche la progression avec une barre d'étapes et un bouton pour continuer.
 */
export default function ResumeHuntCard({ participateHunt }: ResumeHuntCardProps) {
  const navigate = useNavigate();

  // Utiliser le hook personnalisé pour gérer toute la logique métier
  const {
    treasureHuntId,
    treasureHunt,
    completedSteps,
    totalSteps,
    isLoading,
    shouldDisplay,
  } = useResumeHunt(participateHunt);

  if (isLoading) {
    return <Loading />;
  }

  if (!shouldDisplay) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border-2 border-green-200">
      {/* Titre de la section */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h2 className="text-xl font-bold text-gray-900">Reprendre votre chasse</h2>
      </div>

      {/* Nom de la TreasureHunt */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {treasureHunt.title}
      </h3>

      {/* Step Progress Bar */}
      <div className="mb-4">
        <StepProgressBar completedSteps={completedSteps} totalSteps={totalSteps} />
      </div>

      {/* Texte de progression */}
      <p className="text-sm text-gray-700 mb-4 text-center">
        <span className="font-semibold text-green-700">{completedSteps}</span> énigme{completedSteps > 1 ? 's' : ''} sur{' '}
        <span className="font-semibold">{totalSteps}</span> résolue{completedSteps > 1 ? 's' : ''}
      </p>

      {/* Bouton Reprendre */}
      <button
        type="button"
        onClick={() => navigate(`/treasure-hunt/${treasureHuntId}`)}
        className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors"
      >
        Reprendre
      </button>
    </div>
  );
}
