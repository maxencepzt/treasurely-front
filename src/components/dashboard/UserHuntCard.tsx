import { useMemo } from 'react';
import { Link } from 'react-router';
import {faCheckCircle, faCircle, faLocationDot, faMap, faStopwatch} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useTreasureHuntGetByIdQuery } from '../../store/slices/api';
import type { ParticipateHuntAPI } from '../../types/api';
import { getIdFromUrl } from '../../utils/api';
import formatDuration, { formatMinutes } from '../../utils/formatDuration';
import { Loading } from '..';
import Difficulty from '../Difficulty';

export default function UserHuntCard({ participateHunt }: { participateHunt: ParticipateHuntAPI }) {
  const treasureHuntId = useMemo(() => {
    return getIdFromUrl(participateHunt.hunt);
  }, [participateHunt.hunt]);

  const { data: treasureHunt, isLoading } = useTreasureHuntGetByIdQuery({ id: treasureHuntId });

  if (isLoading) {
    return <Loading />;
  }

  if (!treasureHunt) {
    return null;
  }

  const titleId = `participation-${participateHunt.id}-title`;

  return (
    <Link
      to={`/treasure-hunt/${treasureHuntId}`}
      aria-labelledby={titleId}
      className="block h-full bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
    >
      {/* Badge statut */}
      {participateHunt.finished ? (
        <div className="flex items-center gap-2 text-green-700 mb-3">
          <FontAwesomeIcon icon={faCheckCircle} className="text-sm" aria-hidden="true" />
          <span className="text-sm font-semibold">Terminée</span>
        </div>
      ) :
      (
        <div className="flex items-center gap-2 text-blue-700 mb-3">
          <FontAwesomeIcon icon={faCircle} className="text-sm" aria-hidden="true" />
          <span className="text-sm font-semibold">En cours</span>
        </div>
      )}

      {/* Titre de la chasse */}
      <h3 id={titleId} className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
        {treasureHunt.title}
      </h3>

      {/* Localisation */}
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <FontAwesomeIcon icon={faLocationDot} className="text-sm" title="Localisation" />
        <span className="text-sm truncate">{treasureHunt.location}</span>
      </div>

      {/* Informations complémentaires */}
      <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
        {/* Nombre de riddles */}
        <div className="flex items-center gap-1.5" title="Nombre d'énigmes">
          <FontAwesomeIcon icon={faMap} className="text-blue-600" />
          <span>{treasureHunt.riddleCount}</span>
        </div>

        {/* Temps estimé ou temps réalisé */}
        <div className="flex items-center gap-1.5" title={participateHunt.finished ? "Temps réalisé" : "Temps estimé"}>
          <FontAwesomeIcon icon={faStopwatch} className="text-purple-600" />
          <span>{participateHunt.finished ? formatDuration(participateHunt.time) : formatMinutes(treasureHunt.estimatedTime)}</span>
        </div>

        {/* Difficulté */}
        <Difficulty level={treasureHunt.difficulty} />
      </div>

      {/* Score si terminée */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Score:</span>
          <span className="font-bold text-lg text-green-700">{participateHunt.score} pts</span>
        </div>
      </div>
    </Link>
  );
}

