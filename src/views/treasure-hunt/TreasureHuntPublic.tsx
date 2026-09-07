import { useState } from "react";
import { useNavigate } from "react-router";
import {faCog, faLocationDot, faMapLocationDot, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { BackButton, CoverImage, DescriptionModal, TeamButton } from "../../components";
import HuntTypeBadge from "../../components/treasure-hunt/HuntTypebadge.tsx";
import Scoreboard from "../../components/treasure-hunt/Scoreboard.tsx";
import THButton from "../../components/treasure-hunt/thButton.tsx";
import { useUser } from "../../contexts/user";
import { useUserParticipateHunts } from "../../hooks/useUserParticipateHunts";
import { useJoinHuntMutation, useUserTeamsByIdQuery } from "../../store/slices/api.ts";
import type { TreasureHuntAPI } from "../../types/api.ts";
import { getIdFromUrl, parseApiError } from "../../utils/api.ts";
import formatDuration from "../../utils/formatDuration.ts";

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

  // Participation existante de l'utilisateur à cette chasse, s'il y en a une
  const { participateHunts } = useUserParticipateHunts(user?.id ?? 0);
  const progress = participateHunts.find((participation) => getIdFromUrl(participation.hunt) === treasureHunt.id);
  const [joinHunt, { isLoading: isJoining, error: joinError }] = useJoinHuntMutation();

  // Seules les équipes de joueurs peuvent jouer ; "" vaut « seul »
  const { data: userTeams } = useUserTeamsByIdQuery({ id: user?.id ?? 0 }, { skip: !user });
  const playerTeams = userTeams?.teams.filter((team) => team.type === 'player') ?? [];
  const [playerTeam, setPlayerTeam] = useState('');

  const handleParticipate = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (progress) {
      navigate(`/riddle/${getIdFromUrl(progress.currentRiddle)}`);
      return;
    }
    try {
      const created = await joinHunt({ hunt: treasureHunt["@id"], ...(playerTeam && { playerTeam }) }).unwrap();
      navigate(`/riddle/${getIdFromUrl(created.currentRiddle)}`);
    } catch {
      // L'erreur est affichée sous le bouton via joinError
    }
  };

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
            <div className="flex flex-row items-center gap-2" title={formatDuration(treasureHunt.estimatedTime*60)}>
              <FontAwesomeIcon icon={faStopwatch} className="text-xl text-green-600" />
              <span className="text-base font-semibold text-gray-800">{formatDuration(treasureHunt.estimatedTime*60)}</span>
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
        <DescriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          description={treasureHunt.description}
        />

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

        {/* Classement des finisseurs */}
        <Scoreboard huntId={treasureHunt.id} viewer={user?.["@id"]} />

        {/* Participer, reprendre, ou score final */}
        <div className="mt-auto px-6 pb-6">
          {progress?.finished ? (
            <div className="mt-6 mb-4 py-3 px-6 rounded-lg bg-green-50 border-2 border-green-200 text-center">
              <p className="text-green-800 font-semibold">Chasse terminée</p>
              <p className="text-green-700 text-sm">{progress.score} points</p>
            </div>
          ) : !isOwner && (
            <>
              {!progress && playerTeams.length > 0 && (
                <label className="block text-sm font-medium text-gray-700">
                  Participer en tant que
                  <select
                    value={playerTeam}
                    onChange={(event) => setPlayerTeam(event.target.value)}
                    className="mt-1 w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Joueur seul</option>
                    {playerTeams.map((team) => (
                      <option key={team["@id"]} value={team["@id"]}>
                        Équipe {team.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <THButton onClick={() => { if (!isJoining) void handleParticipate(); }}>
                {isJoining ? 'Inscription...' : progress ? 'Reprendre' : 'Participer'}
              </THButton>
              {joinError && (
                <p className="text-red-700 text-sm text-center">{parseApiError(joinError).message}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
