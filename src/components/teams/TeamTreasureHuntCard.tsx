import { Link } from "react-router";
import { faLocationDot, faMap, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type {TeamTreasureHuntsAPI} from "../../types/api.ts";
import { getIdFromUrl } from "../../utils/api.ts";
import { formatMinutes } from "../../utils/formatDuration.ts";

export default function TeamTreasureHuntCard({teamTreasureHunt}: {teamTreasureHunt: TeamTreasureHuntsAPI}) {
  const treasureHuntId = getIdFromUrl(teamTreasureHunt["@id"]);
  const titleId = `team-hunt-${treasureHuntId}-title`;

  return (
    <Link
      to={`/treasure-hunt/${treasureHuntId}`}
      aria-labelledby={titleId}
      className="block bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
    >
      {/* Titre de la chasse */}
      <h3 id={titleId} className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
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
          <span>{formatMinutes(teamTreasureHunt.estimatedTime)}</span>
        </div>

        {/* Difficulté */}
        <span role="img" aria-label={`Difficulté ${teamTreasureHunt.difficulty} sur 3`} title="Difficulté">
          {"🔥".repeat(teamTreasureHunt.difficulty)}
        </span>
      </div>
    </Link>
  );
}
