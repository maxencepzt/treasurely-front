import { useState } from 'react';
import { faCheckCircle, faLightbulb, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BackButton, Loading } from '../../components';
import { useRiddleGetByIdQuery } from '../../store/slices/api';
import type { AnyRiddleAPI, MCQRiddleAPI, ParticipateHuntAPI } from '../../types/api';
import { validateRiddleAnswer, unserializePhpArray } from '../../utils/riddleHelpers';

type RiddleViewProps = {
  participateHunt: ParticipateHuntAPI;
  onRiddleChange: () => void;
};

export default function RiddleView({ participateHunt, onRiddleChange }: RiddleViewProps) {
  const { data: riddle, isLoading, error } = useRiddleGetByIdQuery({ id: participateHunt.currentRiddle });

  const [answer, setAnswer] = useState<string | number | string[]>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    // Simuler un délai de validation
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!riddle) {
      setFeedback({ type: 'error', message: 'Erreur : énigme non trouvée' });
      setIsSubmitting(false);
      return;
    }

    // Convertir answer en format approprié pour la validation
    let answerToValidate: string | string[];
    if (Array.isArray(answer)) {
      answerToValidate = answer;
    } else {
      answerToValidate = String(answer);
    }

    const isCorrect = validateRiddleAnswer(riddle, answerToValidate);

    if (isCorrect) {
      setFeedback({ type: 'success', message: '✅ Bonne réponse ! Passage à l\'énigme suivante...' });
      setTimeout(() => {
        setAnswer(Array.isArray(answer) ? [] : '');
        setFeedback(null);
        setIsSubmitting(false);
        onRiddleChange();
      }, 2000);
    } else {
      setFeedback({ type: 'error', message: '❌ Réponse incorrecte. Réessayez !' });
      setIsSubmitting(false);
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
  answer: string | number | string[],
  setAnswer: (value: string | number | string[]) => void
) {
  // MCQ Riddle - Support pour réponses multiples
  if ('choices' in riddle) {
    const mcqRiddle = riddle as MCQRiddleAPI;
    // Désérialiser les choices et answers
    const choices = unserializePhpArray(mcqRiddle.choices);
    const answers = unserializePhpArray(mcqRiddle.answers);
    const isMultiple = answers.length > 1;
    const selectedAnswers = Array.isArray(answer) ? answer : [];

    const handleChoiceClick = (choice: string) => {
      if (isMultiple) {
        // Mode checkbox - plusieurs réponses possibles
        if (selectedAnswers.includes(choice)) {
          setAnswer(selectedAnswers.filter(a => a !== choice));
        } else {
          setAnswer([...selectedAnswers, choice]);
        }
      } else {
        // Mode radio - une seule réponse
        setAnswer([choice]);
      }
    };

    return (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {isMultiple ? 'Choisissez vos réponses (plusieurs possibles) :' : 'Choisissez votre réponse :'}
        </label>
        {choices.map((choice) => {
          const isSelected = selectedAnswers.includes(choice);
          return (
            <div
              key={choice}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleChoiceClick(choice)}
            >
              <div className="flex items-center gap-3">
                {isMultiple ? (
                  // Checkbox pour réponses multiples
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ) : (
                  // Radio pour réponse unique
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <div className="w-3 h-3 rounded-full bg-green-500" />}
                  </div>
                )}
                <p className="text-gray-900">{choice}</p>
              </div>
            </div>
          );
        })}
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

