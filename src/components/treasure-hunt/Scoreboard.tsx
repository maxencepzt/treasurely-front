import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useTreasureHuntScoreboardQuery } from '../../store/slices/api';
import { getIdFromUrl } from '../../utils/api';
import formatDuration from '../../utils/formatDuration';

interface ScoreboardProps {
  huntId: number;
  /** L'id de l'utilisateur connecté, pour surligner sa ligne */
  viewerId?: number;
}

/**
 * Les dix finisseurs à qui se comparer, tels que le serveur les choisit : le haut du
 * classement pour qui n'a pas fini la chasse, une fenêtre autour de soi sinon.
 */
export default function Scoreboard({ huntId, viewerId }: ScoreboardProps) {
  const { data, isLoading } = useTreasureHuntScoreboardQuery({ id: huntId });

  if (isLoading || !data) return null;

  return (
    <div className="px-6 pb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faTrophy} className="text-2xl text-yellow-500" />
        <span>Classement</span>
      </h2>
      {data.member.length === 0 ? (
        <p className="text-gray-500 text-base bg-white rounded-2xl p-4 border-2 border-green-100">
          Personne n'a encore terminé cette chasse. À vous de jouer !
        </p>
      ) : (
        <ol className="bg-white rounded-2xl border-2 border-green-100 shadow-sm divide-y divide-green-50">
          {data.member.map((row) => {
            const isViewer = viewerId !== undefined && getIdFromUrl(row.hunter['@id']) === viewerId;
            return (
              <li
                key={row['@id']}
                className={`flex items-center gap-3 px-4 py-3 ${isViewer ? 'bg-green-50 font-semibold' : ''}`}
                aria-current={isViewer ? 'true' : undefined}
              >
                <span className="w-8 text-right text-gray-500 tabular-nums">{row.rank}.</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-gray-900">{row.hunter.nickname}</span>
                  <span className="block text-xs text-gray-500">
                    {formatDuration(row.time)}
                    {row.playerTeam && ` · ${row.playerTeam.name}`}
                  </span>
                </span>
                <span className="text-green-700 font-bold tabular-nums">{row.score} pts</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
