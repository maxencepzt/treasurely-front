import { useNavigate, useParams } from 'react-router';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BackButton, Loading } from '../../components';
import Difficulty from '../../components/Difficulty';
import { useUser } from '../../contexts/user';
import { useUserParticipateHunts } from '../../hooks/useUserParticipateHunts';
import { useAttemptRiddleMutation, useRiddleGetByIdQuery } from '../../store/slices/api';
import type { RiddleAttempt } from '../../types/api';
import { getIdFromUrl, parseApiError } from '../../utils/api';
import ErrorView from '../error/Error';
import AnswerForm from './AnswerForm';

const typeLabels = { text: 'Texte', mcq: 'QCM', qr: 'QR code', gps: 'Lieu' } as const;

/**
 * Page d'une énigme. La lire démarre son chronomètre côté serveur ; chaque réponse est
 * arbitrée par POST /riddles/{id}/attempt, qui fait avancer la chasse en cas de réussite.
 *
 * Le routeur garde le composant monté d'une énigme à la suivante : la clé remet à zéro
 * le résultat et le formulaire à chaque changement d'énigme.
 */
export default function Riddle() {
  const params = useParams();
  if (!params.id) {
    throw new Error('No id provided.');
  }
  const riddleId = parseInt(params.id);

  return <RiddlePage key={riddleId} riddleId={riddleId} />;
}

function RiddlePage({ riddleId }: { riddleId: number }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const { data: riddle, isLoading, error } = useRiddleGetByIdQuery({ id: riddleId });
  const { participateHunts } = useUserParticipateHunts(user?.id ?? 0);
  const [attemptRiddle, { data: result, isLoading: isSubmitting, error: submitError }] = useAttemptRiddleMutation();

  if (isLoading) return <Loading />;

  if (error) {
    const { status, message } = parseApiError(error);
    return <ErrorView status={status} message={message} />;
  }

  if (!riddle) return <ErrorView status={404} message="Énigme introuvable" />;

  // La liste des participations est invalidée à chaque réponse : après une réussite,
  // `progress` désigne déjà l'énigme suivante, ou la chasse terminée.
  const progress = participateHunts.find((participation) => participation.hunt === riddle.hunt);
  const isCurrent = progress?.currentRiddle === riddle['@id'] && !progress.finished;
  const solved = result?.solved === true;
  const submitMessage = submitError ? parseApiError(submitError).message : null;

  const submit = (attempt: RiddleAttempt) => {
    void attemptRiddle({ id: riddleId, attempt });
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col">
        <div className="p-4">
          <BackButton variant="light" />
        </div>

        <div className="flex-1 px-6 pb-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Énigme {riddle.orderNumber} · {typeLabels[riddle.type]}
              </p>
              <h1 className="text-2xl font-bold text-gray-900">{riddle.title}</h1>
            </div>
            <Difficulty level={riddle.difficulty} className="text-xl shrink-0" />
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border-2 border-green-100 shadow-sm">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{riddle.description}</p>
          </div>

          <p className="text-sm text-gray-600">
            Essais notés : {result ? `${result.attemptsRemaining} sur ${riddle.maxScoringAttempts}` : riddle.maxScoringAttempts}
            {result && !solved && result.attemptsRemaining === 0 && ' · une réussite ne rapportera plus de points'}
          </p>

          {result && (
            <div
              className={`rounded-xl p-4 border-2 flex items-center gap-3 ${
                solved ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
              }`}
            >
              <FontAwesomeIcon
                icon={solved ? faCheckCircle : faTimesCircle}
                className={`text-2xl ${solved ? 'text-green-600' : 'text-red-600'}`}
              />
              <p className={`font-semibold ${solved ? 'text-green-800' : 'text-red-800'}`}>
                {solved ? `Bonne réponse ! ${result.score} points` : 'Mauvaise réponse, réessayez.'}
              </p>
            </div>
          )}

          {submitMessage && <p className="text-sm text-red-700">{submitMessage}</p>}

          {solved && progress?.finished && (
            <div className="space-y-3 text-center">
              <p className="text-lg font-bold text-gray-900">Chasse terminée : {progress.score} points</p>
              <button
                type="button"
                onClick={() => navigate(`/treasure-hunt/${getIdFromUrl(progress.hunt)}`)}
                className="w-full py-3 px-6 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors"
              >
                Retour à la chasse
              </button>
            </div>
          )}

          {solved && progress && !progress.finished && (
            <button
              type="button"
              onClick={() => navigate(`/riddle/${getIdFromUrl(progress.currentRiddle)}`)}
              className="w-full py-3 px-6 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors"
            >
              Énigme suivante
            </button>
          )}

          {!solved && isCurrent && <AnswerForm riddle={riddle} disabled={isSubmitting} onSubmit={submit} />}

          {!solved && !isCurrent && progress && (
            <p className="text-sm text-gray-600">
              {progress.finished ? 'Vous avez terminé cette chasse.' : 'Cette énigme est déjà résolue.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
