import { useState } from 'react';
import { faCheckCircle, faListCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BackButton } from '../../components';
import type { MCQRiddleAPI } from '../../types/api';
import { validateMCQAnswer, unserializePhpArray } from '../../utils/riddleHelpers';

interface MCQRiddleViewProps {
  riddle: MCQRiddleAPI;
}

export default function MCQRiddleView({ riddle }: MCQRiddleViewProps) {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Désérialiser les choix si nécessaire
  const choices = unserializePhpArray(riddle.choices);

  const handleChoiceToggle = (choice: string) => {
    setSelectedChoices((prev) =>
      prev.includes(choice)
        ? prev.filter((c) => c !== choice)
        : [...prev, choice]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    // Simuler un délai de validation
    await new Promise(resolve => setTimeout(resolve, 500));

    const isCorrect = validateMCQAnswer(riddle, selectedChoices);

    if (isCorrect) {
      setFeedback({
        type: 'success',
        message: '✅ Bonne réponse ! Félicitations !',
      });
    } else {
      setFeedback({
        type: 'error',
        message: '❌ Réponse incorrecte. Réessayez !',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col">
        <div className="p-4">
          <BackButton variant="light" />
        </div>

        <div className="flex-1 px-6 pb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faListCheck} className="text-blue-600 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-900">QCM</h1>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">{"🔥".repeat(riddle.difficulty)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border-2 border-blue-100 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{riddle.title}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{riddle.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {choices.map((choice) => (
                <label
                  key={choice}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedChoices.includes(choice)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedChoices.includes(choice)}
                    onChange={() => handleChoiceToggle(choice)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-900 font-medium">{choice}</span>
                  {selectedChoices.includes(choice) && (
                    <FontAwesomeIcon icon={faCheckCircle} className="ml-auto text-blue-600" />
                  )}
                </label>
              ))}
            </div>

            {selectedChoices.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  {selectedChoices.length} réponse{selectedChoices.length > 1 ? 's' : ''} sélectionnée{selectedChoices.length > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {feedback && (
              <div
                className={`rounded-xl p-4 border-2 flex items-center gap-3 ${
                  feedback.type === 'success'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <FontAwesomeIcon
                  icon={feedback.type === 'success' ? faCheckCircle : faTimesCircle}
                  className={`text-2xl ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                />
                <p className={`font-semibold ${feedback.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {feedback.message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={selectedChoices.length === 0 || isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                selectedChoices.length === 0 || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isSubmitting ? 'Validation...' : 'Valider'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

