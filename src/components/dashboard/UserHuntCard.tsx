import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import {faCheckCircle, faCircle, faLocationDot, faMap, faStopwatch} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useTreasureHuntGetByIdQuery } from '../../store/slices/api';
import type { ParticipateHuntAPI } from '../../types/api';
import { getIdFromUrl } from '../../utils/api';
import formatDuration from '../../utils/formatDuration';
import { Loading } from '..';

export default function UserHuntCard({ participateHunt }: { participateHunt: ParticipateHuntAPI }) {
  const navigate = useNavigate();

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

  return (
    <button
      type="button"
      onClick={() => navigate(`/treasure-hunt/${treasureHuntId}`)}
      className={`bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-all cursor-pointer border-2 ${
        participateHunt.finished 
          ? 'border-green-300 bg-green-50/50' 
          : 'border-blue-300 bg-blue-50/30'
      }`}
    >
      {/* Badge statut */}
      {participateHunt.finished ? (
        <div className="flex items-center gap-1 text-green-700 mb-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
          <span className="text-xs font-semibold">Terminée</span>
        </div>
      ) :
      (
        <div className="flex items-center gap-1 text-blue-700 mb-2">
          <FontAwesomeIcon icon={faCircle} className="text-xs" />
          <span className="text-xs font-semibold">En cours</span>
        </div>
      )}

      {/* Titre de la chasse */}
      <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
        {treasureHunt.title}
      </h3>

      {/* Localisation */}
      <div className="flex items-center gap-1.5 text-gray-600 mb-3">
        <FontAwesomeIcon icon={faLocationDot} className="text-xs" title="Localisation" />
        <span className="text-xs truncate">{treasureHunt.location}</span>
      </div>

      {/* Informations complémentaires */}
      <div className="flex items-center justify-between text-xs text-gray-700">
        {/* Nombre de riddles */}
        <div className="flex items-center gap-1" title="Nombre d'énigmes">
          <FontAwesomeIcon icon={faMap} className="text-blue-600" />
          <span>{treasureHunt.riddleCount}</span>
        </div>

        {/* Temps estimé ou temps réalisé */}
        <div className="flex items-center gap-1" title={participateHunt.finished ? "Temps réalisé" : "Temps estimé"}>
          <FontAwesomeIcon icon={faStopwatch} className="text-purple-600" />
          <span>{formatDuration(participateHunt.finished ? participateHunt.time : treasureHunt.estimatedTime)}</span>
        </div>

        {/* Difficulté */}
        <div className="flex items-center gap-0.5" title="Difficulté">
          {"🔥".repeat(treasureHunt.difficulty)}
        </div>
      </div>

      {/* Score si terminée */}
      <div className={`mt-2 pt-2 border-t ${participateHunt.finished ? 'border-green-200' : 'border-blue-200'}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Score:</span>
          <span className="font-bold text-green-700">{participateHunt.score} pts</span>
        </div>
      </div>
    </button>
  );
}

