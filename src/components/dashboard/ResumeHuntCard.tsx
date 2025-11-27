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
    <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 shadow-lg border-2 border-green-300">
      {/* Titre de la section */}
      <div className="flex items-center gap-3 mb-6 justify-center">
        <span className="text-4xl">🎯</span>
        <h2 className="text-2xl font-bold text-gray-900">Reprendre votre chasse</h2>
      </div>

      {/* Nom de la TreasureHunt */}
      <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        {treasureHunt.title}
      </h3>

      {/* Step Progress Bar */}
      <div className="mb-6">
        <StepProgressBar completedSteps={completedSteps} totalSteps={totalSteps} />
      </div>

      {/* Texte de progression */}
      <p className="text-base text-gray-700 mb-6 text-center">
        <span className="font-bold text-green-700 text-lg">{completedSteps}</span> énigme{completedSteps > 1 ? 's' : ''} sur{' '}
        <span className="font-bold text-lg">{totalSteps}</span> résolue{completedSteps > 1 ? 's' : ''}
      </p>

      {/* Bouton Reprendre */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => navigate(`/treasure-hunt/${treasureHuntId}`)}
          className="w-full md:w-auto md:min-w-[200px] md:px-12 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-colors text-lg"
        >
          Reprendre
        </button>
      </div>
    </div>
  );
}
