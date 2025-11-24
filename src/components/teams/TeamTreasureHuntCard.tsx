import { useNavigate } from "react-router";
import { faLocationDot, faMap, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type {TeamTreasureHuntsAPI} from "../../types/api.ts";
import { getIdFromUrl } from "../../utils/api.ts";
import formatDuration from "../../utils/formatDuration.ts";

export default function TeamTreasureHuntCard({teamTreasureHunt}: {teamTreasureHunt: TeamTreasureHuntsAPI}) {
  const navigate = useNavigate();
  const treasureHuntId = getIdFromUrl(teamTreasureHunt["@id"]);

  return (
    <button
      type="button"
      onClick={() => navigate(`/treasure-hunt/${treasureHuntId}`)}
      className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
    >
      {/* Titre de la chasse */}
      <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
        {teamTreasureHunt.title}
      </h3>

      {/* Localisation */}
      <div className="flex items-center gap-1.5 text-gray-600 mb-3">
        <FontAwesomeIcon icon={faLocationDot} className="text-xs" title="Localisation" />
        <span className="text-xs truncate">{teamTreasureHunt.location}</span>
      </div>

      {/* Informations complémentaires */}
      <div className="flex items-center justify-between text-xs text-gray-700">
        {/* Nombre de riddles */}
        <div className="flex items-center gap-1" title="Nombre d'énigmes">
          <FontAwesomeIcon icon={faMap} className="text-blue-600" />
          <span>{teamTreasureHunt.riddleCount}</span>
        </div>

        {/* Temps estimé */}
        <div className="flex items-center gap-1" title="Temps estimé">
          <FontAwesomeIcon icon={faStopwatch} className="text-purple-600" />
          <span>{formatDuration(teamTreasureHunt.estimatedTime)}</span>
        </div>

        {/* Difficulté */}
        <div className="flex items-center gap-0.5" title="Difficulté">
          {"🔥".repeat(teamTreasureHunt.difficulty)}
        </div>
      </div>
    </button>
  );
}
