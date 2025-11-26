interface StepProgressBarProps {
  completedSteps: number;
  totalSteps: number;
}

export default function StepProgressBar({ completedSteps, totalSteps }: StepProgressBarProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          {/* Point représentant une étape */}
          <div
            className={`w-3 h-3 rounded-full transition-colors ${
              index < completedSteps
                ? 'bg-green-600'
                : 'bg-gray-300'
            }`}
            title={`Énigme ${index + 1}${index < completedSteps ? ' (complétée)' : ''}`}
          />

          {/* Ligne de connexion (sauf pour le dernier point) */}
          {index < totalSteps - 1 && (
            <div
              className={`w-4 h-0.5 ${
                index < completedSteps - 1
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

