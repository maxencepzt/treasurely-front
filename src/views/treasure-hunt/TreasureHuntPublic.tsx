import { useState } from "react";
import { useNavigate } from "react-router";
import { faCog, faLocationDot, faMapLocationDot, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { BackButton, CoverImage, DescriptionModal, TeamButton } from "../../components";
import Difficulty from "../../components/Difficulty.tsx";
import { inputClasses, secondaryClasses, submitClasses } from "../../components/settings/fields";
import FormFeedback from "../../components/settings/FormFeedback";
import HuntTypeBadge from "../../components/treasure-hunt/HuntTypebadge.tsx";
import Scoreboard from "../../components/treasure-hunt/Scoreboard.tsx";
import { useUser } from "../../contexts/user";
import { useDesignerSso } from "../../hooks/useDesignerSso";
import { useUserParticipateHunts } from "../../hooks/useUserParticipateHunts";
import { useJoinHuntMutation, useReplayHuntMutation, useUserTeamsByIdQuery } from "../../store/slices/api.ts";
import type { TreasureHuntAPI } from "../../types/api.ts";
import { getIdFromUrl, parseApiError } from "../../utils/api.ts";
import { formatMinutes } from "../../utils/formatDuration.ts";

const statusLabels = {
  closed: { label: "Fermée", color: "bg-red-100 text-red-800" },
  draft: { label: "Brouillon", color: "bg-gray-100 text-gray-800" },
};

/**
 * La page d'une chasse. S'inscrire ne lance rien : le chronomètre part à l'ouverture de
 * l'énigme, le bouton le dit avant. Une chasse fermée se lit encore, sans inscription.
 */
export default function TreasureHuntPublic({treasureHunt}: {treasureHunt: TreasureHuntAPI}) {
  const navigate = useNavigate();
  const { user } = useUser();

  const [showModal, setShowModal] = useState(false);
  const maxLength = 250;
  const isLong = treasureHunt.description?.length > maxLength;
  const description = isLong
    ? treasureHunt.description.slice(0, maxLength) + '...'
    : treasureHunt.description;

  const opened = treasureHunt.status === "opened";
  const status = treasureHunt.status === "opened" ? null : statusLabels[treasureHunt.status];
  const isOwner = user && getIdFromUrl(treasureHunt.owner) === user.id;
  // La conception se fait dans la façade du back : l'engrenage y ouvre une session
  const openDesigner = useDesignerSso();

  // Participation existante de l'utilisateur à cette chasse, s'il y en a une
  const { participateHunts } = useUserParticipateHunts(user?.id ?? 0);
  const progress = participateHunts.find((participation) => getIdFromUrl(participation.hunt) === treasureHunt.id);
  const [joinHunt, { isLoading: isJoining, error: joinError }] = useJoinHuntMutation();
  const [replayHunt, { isLoading: isReplaying, error: replayError }] = useReplayHuntMutation();
  const [joined, setJoined] = useState(false);

  // Refaire une chasse terminée : le prochain score remplacera celui-ci
  const handleReplay = async () => {
    if (!progress || isReplaying) return;
    try {
      const restarted = await replayHunt({ id: progress.id }).unwrap();
      navigate(`/riddle/${getIdFromUrl(restarted.currentRiddle)}`);
    } catch {
      // L'erreur est affichée sous le bouton via replayError
    }
  };

  // Seules les équipes de joueurs peuvent jouer ; "" vaut « seul »
  const { data: userTeams } = useUserTeamsByIdQuery({ id: user?.id ?? 0 }, { skip: !user });
  const playerTeams = userTeams?.teams.filter((team) => team.type === 'player') ?? [];
  const [playerTeam, setPlayerTeam] = useState('');

  // S'inscrire reste sur la page : l'énigme ne s'ouvre, et le chrono ne part, que sur « Commencer »
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
      await joinHunt({ hunt: treasureHunt["@id"], ...(playerTeam && { playerTeam }) }).unwrap();
      setJoined(true);
    } catch {
      // L'erreur est affichée sous le bouton via joinError
    }
  };

  const ctaLabel = isJoining ? 'Inscription…' : !progress ? 'Participer' : progress.riddlesSolved === 0 ? 'Commencer' : 'Reprendre';

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
                onClick={() => void openDesigner()}
                aria-label="Ouvrir l'espace concepteur"
                title="Ouvrir l'espace concepteur"
              >
                <FontAwesomeIcon icon={faCog} className="text-xl text-white" />
              </button>
            ) : undefined
          }
        />

        {/* Titre, statut et difficulté */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-white to-green-50">
          <div className="flex flex-row justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              {status && (
                <span className={`inline-block mb-2 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900">{treasureHunt.title}</h1>
            </div>
            <Difficulty level={treasureHunt.difficulty} className="text-xl shrink-0 mt-1" />
          </div>

          {/* Équipe conceptrice */}
          <TeamButton teamRoute={treasureHunt.designerTeam} />
        </div>

        {/* Stats */}
        <div className="px-6 pb-4 bg-gradient-to-b from-green-50 to-white">
          <dl className="flex flex-row gap-6 bg-white rounded-2xl p-4 border-2 border-green-100 shadow-sm">
            <div className="flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faMapLocationDot} className="text-xl text-green-600" aria-hidden="true" />
              <dt className="sr-only">Énigmes</dt>
              <dd className="text-base font-semibold text-gray-800">{treasureHunt.riddleCount} énigmes</dd>
            </div>
            <div className="flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-xl text-green-600" aria-hidden="true" />
              <dt className="sr-only">Lieu</dt>
              <dd className="text-base font-semibold text-gray-800">{treasureHunt.location}</dd>
            </div>
            <div className="flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faStopwatch} className="text-xl text-green-600" aria-hidden="true" />
              <dt className="sr-only">Durée estimée</dt>
              <dd className="text-base font-semibold text-gray-800">{formatMinutes(treasureHunt.estimatedTime)}</dd>
            </div>
          </dl>
        </div>

        {/* Description */}
        <div className="px-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">À propos</h2>
          <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gradient-to-br from-white to-green-50 rounded-2xl p-4 border-2 border-green-100 shadow-sm">
            {description}
            {isLong && (
              <button type="button" onClick={() => setShowModal(true)} className="block mt-2 text-green-800 font-medium underline">
                Lire la suite
              </button>
            )}
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
          <h2 className="text-xl font-bold text-gray-900 mb-3">Catégories</h2>
          <div className="flex flex-row gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {treasureHunt.huntType.map((cat) => (
              <HuntTypeBadge key={cat.id}>
                {cat.title}
              </HuntTypeBadge>
            ))}
          </div>
        </div>

        {/* Classement des finisseurs */}
        <Scoreboard huntId={treasureHunt.id} viewerId={user?.id} />

        {/* Participer, commencer, reprendre, rejouer : collé en bas de l'écran, au-dessus des onglets */}
        <div className="mt-auto sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] md:bottom-0 px-6 py-4 bg-white border-t border-gray-200 flex flex-col gap-3">
          {progress?.finished ? (
            <>
              <div className="py-3 px-6 rounded-lg bg-green-50 border border-green-200 text-center">
                <p className="text-green-800 font-semibold">Chasse terminée</p>
                <p className="text-green-700 text-sm">{progress.score} points</p>
              </div>
              {opened ? (
                <>
                  <button type="button" onClick={() => void handleReplay()} disabled={isReplaying} className={secondaryClasses}>
                    {isReplaying ? 'Remise à zéro…' : 'Rejouer'}
                  </button>
                  <p className="text-sm text-gray-600 text-center">Le score de la nouvelle partie remplacera celui-ci.</p>
                  {replayError && <p className="text-sm text-red-700 text-center">{parseApiError(replayError).message}</p>}
                </>
              ) : (
                <p className="text-sm text-gray-600 text-center">Cette chasse est maintenant fermée.</p>
              )}
            </>
          ) : !opened ? (
            <p className="text-base text-gray-700 text-center">
              {treasureHunt.status === 'closed' ? "Cette chasse est fermée : on ne peut plus la rejoindre." : "Ce brouillon n'est pas encore ouvert aux joueurs."}
            </p>
          ) : isOwner ? (
            <p className="text-base text-gray-700 text-center">Vous concevez cette chasse : elle se joue sans vous.</p>
          ) : (
            <>
              {!progress && playerTeams.length > 0 && (
                <label htmlFor="playerTeam" className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Participer en tant que</span>
                  <select id="playerTeam" value={playerTeam} onChange={(event) => setPlayerTeam(event.target.value)} className={`${inputClasses} bg-white`}>
                    <option value="">Joueur seul</option>
                    {playerTeams.map((team) => (
                      <option key={team["@id"]} value={team["@id"]}>
                        Équipe {team.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {joined && progress && <FormFeedback success="Inscription enregistrée. Prêt ?" />}
              <button type="button" onClick={() => void handleParticipate()} disabled={isJoining} className={submitClasses}>
                {ctaLabel}
              </button>
              {progress && (
                <p className="text-sm text-gray-600 text-center">Le chronomètre démarre à l'ouverture de l'énigme.</p>
              )}
              {joinError && <p className="text-sm text-red-700 text-center">{parseApiError(joinError).message}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
