import { useState } from 'react';
import { faCheckCircle, faKeyboard, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BackButton } from '../../components';
import type { TextRiddleAPI } from '../../types/api';
import { validateTextAnswer } from '../../utils/riddleHelpers';

interface TextRiddleViewProps {
  riddle: TextRiddleAPI;
}

export default function TextRiddleView({ riddle }: TextRiddleViewProps) {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    // Simuler un délai de validation
    await new Promise(resolve => setTimeout(resolve, 500));

    const isCorrect = validateTextAnswer(riddle, userAnswer);

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
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-50 to-teal-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col">
        <div className="p-4">
          <BackButton variant="light" />
        </div>

        <div className="flex-1 px-6 pb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faKeyboard} className="text-green-600 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-900">Texte</h1>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">{"🔥".repeat(riddle.difficulty)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border-2 border-green-100 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{riddle.title}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{riddle.description}</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-6">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              <span>Instructions</span>
            </h3>
            <p className="text-sm text-blue-800">
              Lisez attentivement la description de l'énigme et saisissez votre réponse dans le champ ci-dessous.
              La réponse peut être sensible à la casse.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="answer" className="block text-base font-semibold text-gray-900 mb-3">
                Votre réponse
              </label>
              <textarea
                id="answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Saisissez votre réponse ici..."
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all"
              />
              <p className="mt-2 text-sm text-gray-500">
                {userAnswer.length} caractère{userAnswer.length > 1 ? 's' : ''}
              </p>
            </div>

            {userAnswer.trim() && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-green-800 font-medium mb-2">Aperçu de votre réponse :</p>
                <p className="text-gray-900 italic">&quot;{userAnswer}&quot;</p>
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
              disabled={!userAnswer.trim() || isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                !userAnswer.trim() || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
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

