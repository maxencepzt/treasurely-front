import { useState } from "react";
import {faMapLocationDot} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import THButton from "../../components/treasure-hunt/thButton.tsx";
import THTeamButton from "../../components/treasure-hunt/thTeamButton.tsx";
import type { TreasureHuntAPI } from "../../types/api.ts";

export default function TreasureHuntPublic({treasureHunt}: {treasureHunt: TreasureHuntAPI}) {
  const [showModal, setShowModal] = useState(false);
  const maxLength = 250;
  const isLong = treasureHunt.description?.length > maxLength;
  const description = isLong
    ? treasureHunt.description.slice(0, maxLength) + '...'
    : treasureHunt.description;

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col">
        <img src={import.meta.env.VITE_API_BASE_URL + treasureHunt["@id"] + "/picture"} alt={"Photo de " + treasureHunt.title} className="w-full h-60 object-cover rounded-b-xl" />
        <div className="flex flex-row justify-between w-full p-4">
          <strong className="text-lg">{treasureHunt.title}</strong>
          <div className="flex flex-row gap-1 items-center">
            <span className="text-lg">Difficulté</span>
            <span>{"🔥".repeat(treasureHunt.difficulty)}</span>
          </div>
        </div>
        <THTeamButton teamRoute={treasureHunt.team} />
        {/* Stats */}
        <div className="flex flex-row pl-4 pt-4">
          <div className="flex flex-row text-lg font-medium gap-1 items-center" title={`${treasureHunt.riddleCount} énigmes`}><FontAwesomeIcon icon={faMapLocationDot} className="text-xl" />{treasureHunt.riddleCount}</div>
        </div>
        {/* Title for the description section */}
        <h2 className="px-4 pt-2 pb-1 text-lg font-semibold text-gray-800">A propos</h2>
        {/* Description section */}
        <div
          className={`px-4 pb-4 text-gray-700 whitespace-pre-line ${isLong ? "cursor-pointer select-none" : ""}`}
          onClick={() => isLong && setShowModal(true)}
          title={isLong ? "Voir la description complète" : undefined}
        >
          {description}
        </div>
        {/* Modal pour la description complete */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto relative">
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setShowModal(false)}
                aria-label="Fermer"
              >
                &times;
              </button>
              <h2 className="text-lg font-bold mb-2">Description complète</h2>
              <div className="text-gray-800 whitespace-pre-line">{treasureHunt.description}</div>
            </div>
          </div>
        )}
        <h2 className="px-4 pt-2 pb-1 text-lg font-semibold text-gray-800">Catégories</h2>
        <div className="px-4 pb-4">
          <div className="flex flex-row gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {treasureHunt.huntType.map((cat) => (
              <span
                key={cat.id}
                className="whitespace-nowrap bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
              >
                {cat.title}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-auto px-4">
          <THButton onClick={() => {alert('Implémente ça !')}}>Participer</THButton>
        </div>
      </div>
    </div>
  );
}
