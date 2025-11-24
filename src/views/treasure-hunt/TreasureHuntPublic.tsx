import { useState } from "react";
import { useNavigate } from "react-router";
import { faCog, faLocationDot, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { BackButton, CoverImage, TeamButton } from "../../components";
import HuntTypeBadge from "../../components/treasure-hunt/HuntTypebadge.tsx";
import THButton from "../../components/treasure-hunt/thButton.tsx";
import { useUser } from "../../contexts/user";
import type { TreasureHuntAPI } from "../../types/api.ts";
import { getIdFromUrl } from "../../utils/api.ts";

export default function TreasureHuntPublic({treasureHunt}: {treasureHunt: TreasureHuntAPI}) {
  const navigate = useNavigate();
  const { user } = useUser();

  const [showModal, setShowModal] = useState(false);
  const maxLength = 250;
  const isLong = treasureHunt.description?.length > maxLength;
  const description = isLong
    ? treasureHunt.description.slice(0, maxLength) + '...'
    : treasureHunt.description;

  const isOwner = user && getIdFromUrl(treasureHunt.owner) === user.id;

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col">
        {/* Image de couverture avec boutons */}
        <CoverImage
          type="treasure-hunt"
          id={treasureHunt.id}
          alt={"Photo de " + treasureHunt.title}
          backButton={<BackButton variant="dark" />}
          actionButton={
            isOwner ? (
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-gray-800/70 hover:bg-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                onClick={() => navigate(`/treasure-hunts/${treasureHunt.id}/edit`)}
                aria-label="Éditer"
                title="Éditer la chasse au trésor"
              >
                <FontAwesomeIcon icon={faCog} className="text-xl text-white" />
              </button>
            ) : undefined
          }
        />

        {/* Titre et difficulté */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-white to-green-50">
          <div className="flex flex-row justify-between items-start gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">{treasureHunt.title}</h1>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-medium text-gray-600">Difficulté</span>
              <div className="flex items-center gap-1">
                <span className="text-xl">{"🔥".repeat(treasureHunt.difficulty)}</span>
              </div>
            </div>
          </div>

          {/* Équipe conceptrice */}
          <TeamButton teamRoute={treasureHunt.designerTeam} />
        </div>

        {/* Stats */}
        <div className="px-6 pb-4 bg-gradient-to-b from-green-50 to-white">
          <div className="flex flex-row gap-6 bg-white rounded-2xl p-4 border-2 border-green-100 shadow-sm">
            <div className="flex flex-row items-center gap-2" title={`${treasureHunt.riddleCount} énigmes`}>
              <FontAwesomeIcon icon={faMapLocationDot} className="text-xl text-green-600" />
              <span className="text-base font-semibold text-gray-800">{treasureHunt.riddleCount} énigmes</span>
            </div>
            <div className="flex flex-row items-center gap-2" title={treasureHunt.location}>
              <FontAwesomeIcon icon={faLocationDot} className="text-xl text-green-600" />
              <span className="text-base font-semibold text-gray-800">{treasureHunt.location}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span>À propos</span>
          </h2>
          <div
            className={`text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gradient-to-br from-white to-green-50 rounded-2xl p-4 border-2 border-green-100 shadow-sm ${
              isLong ? "cursor-pointer hover:border-green-200" : ""
            }`}
            onClick={() => isLong && setShowModal(true)}
            title={isLong ? "Voir la description complète" : undefined}
          >
            {description}
          </div>
        </div>

        {/* Modal pour la description complete */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative mx-4 shadow-2xl">
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-light leading-none"
                onClick={() => setShowModal(false)}
                aria-label="Fermer"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 pr-8">Description complète</h2>
              <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line">{treasureHunt.description}</div>
            </div>
          </div>
        )}

        {/* Catégories */}
        <div className="px-6 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🏷️</span>
            <span>Catégories</span>
          </h2>
          <div className="flex flex-row gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {treasureHunt.huntType.map((cat) => (
              <HuntTypeBadge key={cat.id}>
                {cat.title}
              </HuntTypeBadge>
            ))}
          </div>
        </div>

        {/* Bouton participer */}
        <div className="mt-auto px-6 pb-6">
          <THButton onClick={() => {alert('Implémente ça !')}}>Participer</THButton>
        </div>
      </div>
    </div>
  );
}
