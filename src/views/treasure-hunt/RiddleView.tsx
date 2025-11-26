import { useState } from 'react';
import { faCheckCircle, faLightbulb, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BackButton, Loading } from '../../components';
import { useRiddleGetByIdQuery, useSubmitRiddleAnswerMutation } from '../../store/slices/api';
import type { AnyRiddleAPI, MCQRiddleAPI, ParticipateHuntAPI } from '../../types/api';
import { parseApiError } from '../../utils/api';

type RiddleViewProps = {
  participateHunt: ParticipateHuntAPI;
  onComplete: (score: number, totalTime: number) => void;
  onRiddleChange: () => void;
};

export default function RiddleView({ participateHunt, onComplete, onRiddleChange }: RiddleViewProps) {
  const { data: riddle, isLoading, error } = useRiddleGetByIdQuery({ id: participateHunt.currentRiddle });
  const [submitAnswer, { isLoading: isSubmitting }] = useSubmitRiddleAnswerMutation();

  const [answer, setAnswer] = useState<string | number>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      const result = await submitAnswer({
        participateHuntId: participateHunt.id,
        riddleId: participateHunt.currentRiddle,
        answer,
      }).unwrap();

      if (result.correct) {
        if (result.completed) {
          // Chasse terminée
          setFeedback({ type: 'success', message: '🎉 Félicitations ! Vous avez terminé la chasse !' });
          setTimeout(() => {
            onComplete(result.score || 0, result.totalTime || 0);
          }, 2000);
        } else {
          // Bonne réponse, passer à l'énigme suivante
          setFeedback({ type: 'success', message: '✅ Bonne réponse ! Passage à l\'énigme suivante...' });
          setTimeout(() => {
            setAnswer('');
            setFeedback(null);
            onRiddleChange();
          }, 2000);
        }
      } else {
        setFeedback({ type: 'error', message: '❌ Réponse incorrecte. Réessayez !' });
      }
    } catch (err) {
      const { message } = parseApiError(err);
      setFeedback({ type: 'error', message: `Erreur : ${message}` });
    }
  };

  if (isLoading) return <Loading />;

  if (error || !riddle) {
    return (
      <div className="min-h-screen flex justify-center bg-gradient-to-br from-gray-50 to-red-50">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl p-6">
          <BackButton variant="light" />
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-red-600 font-semibold">Erreur lors du chargement de l'énigme</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col">
        <div className="p-4">
          <BackButton variant="light" />
        </div>

        <div className="flex-1 px-6 pb-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-900">Énigme</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Difficulté :</span>
              <span className="text-lg">{"🔥".repeat(riddle.difficulty)}</span>
            </div>
          </div>

          {/* Riddle Content */}
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border-2 border-green-100 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{riddle.title}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{riddle.description}</p>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderAnswerInput(riddle, answer, setAnswer)}

            {/* Feedback */}
            {feedback && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  feedback.type === 'success' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                }`}
              >
                <FontAwesomeIcon
                  icon={feedback.type === 'success' ? faCheckCircle : faTimesCircle}
                  className={`text-xl ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                />
                <p className={`font-medium ${feedback.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {feedback.message}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !answer || feedback?.type === 'success'}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                'Valider ma réponse'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function renderAnswerInput(
  riddle: AnyRiddleAPI,
  answer: string | number,
  setAnswer: (value: string | number) => void
) {
  // MCQ Riddle
  if ('choices' in riddle) {
    const mcqRiddle = riddle as MCQRiddleAPI;
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Choisissez votre réponse :</label>
        {mcqRiddle.choices.map((choice, index) => (
          <div
            key={index}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
              answer === choice ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setAnswer(choice)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  answer === choice ? 'border-green-500' : 'border-gray-300'
                }`}
              >
                {answer === choice && <div className="w-3 h-3 rounded-full bg-green-500" />}
              </div>
              <p className="text-gray-900">{choice}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // GPS Riddle
  if ('latitude' in riddle) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Entrez les coordonnées GPS :</label>
        <input
          type="text"
          placeholder="Latitude, Longitude"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
        />
        <p className="text-xs text-gray-500">Format attendu : latitude, longitude (ex: 48.8566, 2.3522)</p>
      </div>
    );
  }

  // QR Code Riddle
  if ('code' in riddle) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Scannez le code QR et entrez le code :</label>
        <input
          type="text"
          placeholder="Code QR"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
        />
      </div>
    );
  }

  // Text Riddle (default)
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Votre réponse :</label>
      <input
        type="text"
        placeholder="Entrez votre réponse"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
      />
    </div>
  );
}

