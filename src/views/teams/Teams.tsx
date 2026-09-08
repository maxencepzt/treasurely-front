import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { faChevronRight, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { BackButton, CoverImage, DescriptionModal, Loading } from "../../components";
import DangerAction from "../../components/DangerAction";
import JoinRequestButton from "../../components/teams/JoinRequestButton";
import PendingRequests from "../../components/teams/PendingRequests";
import TeamCode from "../../components/teams/TeamCode";
import TeamTreasureHuntCard from "../../components/teams/TeamTreasureHuntCard";
import { useUser } from "../../contexts/user";
import { useTeamWithMembers } from "../../hooks/useTeamWithMembers";
import { useDeleteTeamMutation, useLeaveTeamMutation } from "../../store/slices/api";
import { getIdFromUrl, parseApiError } from "../../utils/api.ts";
import ErrorView from "../error/Error.tsx";

export default function Teams() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [leave, { isLoading: leaving, error: leaveError }] = useLeaveTeamMutation();
  const [remove, { isLoading: removing, error: removeError }] = useDeleteTeamMutation();

  if (!params.id) {
    throw new Error('No id provided.');
  }
  const teamId = parseInt(params.id);
  const { data: team, isLoading, error } = useTeamWithMembers(teamId);

  if (isLoading) return <Loading />;

  if (error) {
    const { status, message } = parseApiError(error);
    return <ErrorView status={status} message={message} />;
  }

  if (!team) return <ErrorView status={404} message="Team introuvable" />;

  // Ma place dans l'équipe : le propriétaire tranche les demandes, un membre partage le code.
  // Par id numérique : l'IRI de `/api/me` est `/api/me`, pas `/api/users/{id}`.
  const isOwner = !!user && getIdFromUrl(team.owner) === user.id;
  const isMember = isOwner || (!!user && (team.members ?? []).some((member) => getIdFromUrl(member["@id"]) === user.id));
  const isPlayerTeam = team.type === 'player';

  const maxLength = 250;
  const isLong = team.description && team.description.length > maxLength;
  const description = isLong
    ? team.description.slice(0, maxLength) + '...'
    : team.description;

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl">
        {/* Image de couverture avec bouton retour */}
        <CoverImage
          type="team"
          id={team.id}
          alt={`Photo de ${team.name}`}
          backButton={<BackButton variant="dark" />}
        />

        {/* Nom de l'équipe */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-white to-green-50">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            {team.name}
          </h1>
        </div>

        {/* Description section */}
        {team.description && (
          <div className="px-6 py-6 bg-gradient-to-b from-white to-green-50">
            <h2 className="text-xl font-bold text-gray-900 mb-3">À propos</h2>
            <div
              className={`text-gray-700 text-base leading-relaxed bg-white rounded-2xl p-4 border-2 border-green-100 shadow-sm ${
                isLong ? "cursor-pointer hover:border-green-200" : ""
              }`}
              onClick={() => isLong && setShowModal(true)}
              title={isLong ? "Voir la description complète" : undefined}
            >
              {description}
            </div>
          </div>
        )}

        {/* Modal pour la description complete */}
        <DescriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          description={team.description || ""}
        />

        {/* Section membres cliquable */}
        <div className="px-6 pb-4">
          <button
            type="button"
            onClick={() => navigate(`/teams/${params.id}/members`)}
            className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-green-50 active:bg-green-100 transition-colors rounded-2xl border-2 border-green-100 shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-800">Membres</span>
              <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                {team.members?.length || 0}
              </span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-green-600 text-lg" />
          </button>
        </div>

        {/* Ma place : code à partager, demandes à trancher, départ ou suppression */}
        {isPlayerTeam && user && (
          <div className="px-6 pb-6 flex flex-col gap-6">
            {isMember && <TeamCode teamId={teamId} />}
            {isOwner && <PendingRequests teamId={teamId} />}
            {isOwner ? (
              <DangerAction
                label="Supprimer l'équipe"
                question="Supprimer l'équipe ? Ses membres la perdent, ses participations restent."
                confirmLabel="Supprimer"
                busy={removing}
                onConfirm={async () => {
                  await remove({ id: teamId }).unwrap();
                  navigate('/teams');
                }}
              />
            ) : isMember ? (
              <DangerAction
                label="Quitter l'équipe"
                question="Quitter l'équipe ? Il faudra son code, ou une nouvelle demande, pour y revenir."
                confirmLabel="Quitter"
                busy={leaving}
                onConfirm={async () => {
                  await leave({ id: teamId }).unwrap();
                  navigate('/teams');
                }}
              />
            ) : (
              <JoinRequestButton teamId={teamId} teamIri={team["@id"]} isMember={false} />
            )}
            {(leaveError || removeError) && (
              <p className="text-sm text-red-700">{parseApiError(leaveError ?? removeError).message}</p>
            )}
          </div>
        )}

        {/* Liste des chasses au trésor */}
        <div className="px-6 pb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faMapLocationDot} className="text-green-700" aria-hidden="true" />
            <span>Chasses au trésor</span>
          </h2>
          {team.treasureHunts && team.treasureHunts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {team.treasureHunts.map((hunt) => (
                <TeamTreasureHuntCard
                  key={hunt["@id"]}
                  teamTreasureHunt={hunt}
                />
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 bg-white rounded-2xl border-2 border-green-100 shadow-sm">
              <p className="text-gray-500 italic text-center">Aucune chasse au trésor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
