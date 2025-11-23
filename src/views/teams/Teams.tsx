import { useNavigate, useParams } from "react-router";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { BackButton, Loading } from "../../components";
import TeamProfilePicture from "../../components/teams/TeamProfilePicture";
import TeamTreasureHuntCard from "../../components/teams/TeamTreasureHuntCard";
import { useTeamWithMembers } from "../../hooks/useTeamWithMembers";
import { parseApiError } from "../../utils/api.ts";
import ErrorView from "../Error.tsx";

export default function Teams() {
  const params = useParams();
  const navigate = useNavigate();

  if (!params.id) {
    throw new Error('No id provided.');
  }
  const { data: team, isLoading, error } = useTeamWithMembers(parseInt(params.id));

  if (isLoading) return <Loading />;

  if (error) {
    const { status, message } = parseApiError(error);
    return <ErrorView status={status} message={message} />;
  }

  if (!team) return <ErrorView status={404} message="Team introuvable" />;

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl">
        {/* Header avec gradient et nom de l'équipe */}
        <div className="relative bg-gradient-to-br from-green-600 to-green-700 px-6 py-8 shadow-lg">
          {/* Bouton retour */}
          <div className="absolute top-4 left-4">
            <BackButton variant="dark" />
          </div>

          {/* Contenu centré */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="ring-4 ring-white rounded-full">
              <TeamProfilePicture teamId={team.id} size="lg" />
            </div>
            <h1 className="text-3xl font-bold text-white text-center drop-shadow-md">
              {team.name}
            </h1>
          </div>
        </div>

        {/* Description section */}
        {team.description && (
          <div className="px-6 py-6 bg-gradient-to-b from-white to-green-50">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <span>À propos</span>
            </h2>
            <p className="text-gray-700 text-base leading-relaxed bg-white rounded-2xl p-4 border-2 border-green-100 shadow-sm">
              {team.description.slice(0, 250)}
            </p>
          </div>
        )}

        {/* Section membres cliquable */}
        <div className="px-6 pb-4">
          <button
            type="button"
            onClick={() => navigate(`/teams/${params.id}/members`)}
            className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-green-50 active:bg-green-100 transition-colors rounded-2xl border-2 border-green-100 shadow-sm"
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

        {/* Liste des chasses au trésor */}
        <div className="px-6 pb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
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
