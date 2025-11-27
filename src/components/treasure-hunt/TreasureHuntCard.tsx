import { useNavigate } from "react-router";
import { faLocationDot, faMap, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { TreasureHuntAPI } from "../../types/api.ts";
import formatDuration from "../../utils/formatDuration.ts";

const statusLabels = {
  opened: { label: "Ouverte", color: "bg-green-100 text-green-800" },
  closed: { label: "Fermée", color: "bg-red-100 text-red-800" },
  draft: { label: "Brouillon", color: "bg-gray-100 text-gray-800" },
};

export default function TreasureHuntCard({ treasureHunt }: { treasureHunt: TreasureHuntAPI }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/treasure-hunt/${treasureHunt.id}`)}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 w-full text-left"
    >
      {/* En-tête avec titre et statut */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
          {treasureHunt.title}
        </h3>
        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusLabels[treasureHunt.status].color}`}>
          {statusLabels[treasureHunt.status].label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {treasureHunt.description}
      </p>

      {/* Localisation */}
      <div className="flex items-center gap-2 text-gray-600 mb-3">
        <FontAwesomeIcon icon={faLocationDot} className="text-sm" title="Localisation" />
        <span className="text-sm truncate">{treasureHunt.location}</span>
      </div>

      {/* Types de chasse */}
      {treasureHunt.huntType && treasureHunt.huntType.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {treasureHunt.huntType.map((type) => (
            <span
              key={type.id}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {type.title}
            </span>
          ))}
        </div>
      )}

      {/* Informations complémentaires */}
      <div className="flex items-center justify-between text-sm text-gray-700">
        {/* Nombre de riddles */}
        <div className="flex items-center gap-1.5" title="Nombre d'énigmes">
          <FontAwesomeIcon icon={faMap} className="text-blue-600" />
          <span>{treasureHunt.riddleCount} énigmes</span>
        </div>

        {/* Temps estimé */}
        <div className="flex items-center gap-1.5" title="Temps estimé">
          <FontAwesomeIcon icon={faStopwatch} className="text-purple-600" />
          <span>{formatDuration(treasureHunt.estimatedTime)}</span>
        </div>

        {/* Difficulté */}
        <div className="flex items-center gap-0.5" title="Difficulté">
          {"🔥".repeat(treasureHunt.difficulty)}
        </div>
      </div>
    </button>
  );
}

