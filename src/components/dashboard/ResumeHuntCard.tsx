import { Link } from 'react-router';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useResumeHunt } from '../../hooks/useResumeHunt';
import type { ParticipateHuntAPI } from '../../types/api';
import { Loading } from '..';
import { submitClasses } from '../settings/fields';
import StepProgressBar from './StepProgressBar';

interface ResumeHuntCardProps {
  participateHunt: ParticipateHuntAPI;
}

/**
 * La chasse en cours la plus récente : sa progression et le bouton qui rouvre l'énigme
 * du moment. La progression vient de la participation, pas de l'énigme, dont la lecture
 * lancerait le chronomètre.
 */
export default function ResumeHuntCard({ participateHunt }: ResumeHuntCardProps) {
  const {
    currentRiddleId,
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
    <section aria-labelledby="resume-title" className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-green-200 flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-green-800">Chasse en cours</p>
        <h2 id="resume-title" className="text-2xl font-bold text-gray-900">{treasureHunt.title}</h2>
      </div>

      <StepProgressBar completedSteps={completedSteps} totalSteps={totalSteps} />

      <p className="text-base text-gray-700 text-center">
        <span className="font-bold text-green-800">{completedSteps}</span> énigme{completedSteps > 1 ? 's' : ''} sur{' '}
        <span className="font-bold">{totalSteps}</span> résolue{completedSteps > 1 ? 's' : ''}
      </p>

      <Link to={`/riddle/${currentRiddleId}`} className={`${submitClasses} inline-flex items-center justify-center gap-2 sm:self-center sm:min-w-64`}>
        <FontAwesomeIcon icon={faPlay} aria-hidden="true" />
        {completedSteps === 0 ? 'Commencer' : 'Reprendre'}
      </Link>
    </section>
  );
}
