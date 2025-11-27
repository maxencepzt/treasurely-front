import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StepProgressBarProps {
  completedSteps: number;
  totalSteps: number;
}

export default function StepProgressBar({ completedSteps, totalSteps }: StepProgressBarProps) {
  const getStepStatus = (index: number) => {
    if (index < completedSteps) return 'completed';
    if (index === completedSteps) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex items-center justify-center gap-1 py-3">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const status = getStepStatus(index);
        const isCompleted = status === 'completed';
        const isCurrent = status === 'current';

        return (
          <div key={index} className="flex items-center">
            {/* Point représentant une étape */}
            <div className="relative group">
              <div
                className={`
                  w-6 h-6 rounded-full transition-all duration-300 ease-in-out transform
                  ${isCompleted 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50 scale-100' 
                    : isCurrent
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50 scale-110 animate-pulse'
                    : 'bg-gray-200 border-2 border-gray-300 scale-90'
                  }
                  ${(isCompleted || isCurrent) ? 'ring-2 ring-white ring-offset-1' : ''}
                  hover:scale-125 cursor-pointer
                `}
                title={`Énigme ${index + 1}${isCompleted ? ' (complétée)' : isCurrent ? ' (en cours)' : ''}`}
              >
                {/* Icône de validation pour les étapes complétées */}
                {isCompleted && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                {/* Point au centre pour l'étape en cours */}
                {isCurrent && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Tooltip au survol */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                Énigme {index + 1}
                {isCompleted && ' ✓'}
                {isCurrent && ' (en cours)'}
              </div>
            </div>

            {/* Ligne de connexion (sauf pour le dernier point) */}
            {index < totalSteps - 1 && (
              <div className="relative h-1 mx-1">
                {/* Ligne de fond */}
                <div className="absolute inset-0 w-12 h-1 bg-gray-200 rounded-full top-1/2 transform -translate-y-1/2"></div>

                {/* Ligne de progression animée */}
                <div
                  className={`
                    absolute inset-0 h-1 rounded-full top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out
                    ${index < completedSteps - 1 
                      ? 'w-12 bg-gradient-to-r from-green-500 to-emerald-600' 
                      : index === completedSteps - 1
                      ? 'w-6 bg-gradient-to-r from-green-500 to-blue-500'
                      : 'w-0'
                    }
                  `}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
