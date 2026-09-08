import { Link } from "react-router";
import { faLocationDot, faMap, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { TreasureHuntAPI } from "../../types/api.ts";
import { formatMinutes } from "../../utils/formatDuration.ts";
import Difficulty from "../Difficulty.tsx";

// Une chasse ouverte n'a pas besoin d'étiquette ; les autres statuts ne se voient qu'en admin
const statusLabels = {
  closed: { label: "Fermée", color: "bg-red-100 text-red-800" },
  draft: { label: "Brouillon", color: "bg-gray-100 text-gray-800" },
};

/** Une chasse de la liste : un lien nommé par son titre, le reste est descriptif. */
export default function TreasureHuntCard({ treasureHunt }: { treasureHunt: TreasureHuntAPI }) {
  const titleId = `hunt-${treasureHunt.id}-title`;
  const status = treasureHunt.status === "opened" ? null : statusLabels[treasureHunt.status];

  return (
    <Link
      to={`/treasure-hunt/${treasureHunt.id}`}
      aria-labelledby={titleId}
      className="block h-full bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
    >
      {/* En-tête avec titre et statut */}
      <div className="flex justify-between items-start mb-3">
        <h3 id={titleId} className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
          {treasureHunt.title}
        </h3>
        {status && (
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.color}`}>
            {status.label}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {treasureHunt.description}
      </p>

      {/* Localisation */}
      <div className="flex items-center gap-2 text-gray-600 mb-3">
        <FontAwesomeIcon icon={faLocationDot} className="text-sm" aria-hidden="true" />
        <span className="text-sm truncate">{treasureHunt.location}</span>
      </div>

      {/* Types de chasse */}
      {treasureHunt.huntType.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {treasureHunt.huntType.map((type) => (
            <span key={type.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {type.title}
            </span>
          ))}
        </div>
      )}

      {/* Informations complémentaires */}
      <div className="flex items-center justify-between text-sm text-gray-700">
        <div className="flex items-center gap-1.5" title="Nombre d'énigmes">
          <FontAwesomeIcon icon={faMap} className="text-blue-600" aria-hidden="true" />
          <span>{treasureHunt.riddleCount} énigmes</span>
        </div>

        <div className="flex items-center gap-1.5" title="Temps estimé">
          <FontAwesomeIcon icon={faStopwatch} className="text-purple-600" aria-hidden="true" />
          <span>{formatMinutes(treasureHunt.estimatedTime)}</span>
        </div>

        <Difficulty level={treasureHunt.difficulty} />
      </div>
    </Link>
  );
}
