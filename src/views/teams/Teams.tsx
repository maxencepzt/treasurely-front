import { useNavigate, useParams } from "react-router";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Loading } from "../../components";
import TeamProfilePicture from "../../components/teams/TeamProfilePicture";
import TeamTreasureHuntCard from "../../components/teams/TeamTreasureHuntCard";
import { useTeamWithMembers } from "../../hooks/useTeamWithMembers";
import { useTeamTreasureHuntsByIdQuery } from "../../store/slices/api";
import { parseApiError } from "../../utils/api.ts";
import ErrorView from "../Error.tsx";

export default function Teams() {
  const params = useParams();
  const navigate = useNavigate();

  if (!params.id) {
    throw new Error('No id provided.');
  }
  const { data: team, isLoading, error } = useTeamWithMembers(parseInt(params.id));
  const { data: treasureHuntsData, isLoading: isLoadingHunts } = useTeamTreasureHuntsByIdQuery({ id: parseInt(params.id) });
  const treasureHunts = treasureHuntsData?.hunts || [];

  if (isLoading || isLoadingHunts) return <Loading />;

  if (error) {
    const { status, message } = parseApiError(error);
    return <ErrorView status={status} message={message} />;
  }

  if (!team) return <ErrorView status={404} message="Team introuvable" />;

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white min-h-screen">
        {/* Header avec nom et description */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <TeamProfilePicture teamId={team.id} size="md" />
            <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
          </div>
          <p className="text-gray-700">{team.description}</p>
        </div>

        {/* Section membres cliquable */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => navigate(`/teams/${params.id}/members`)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-800">Membres</span>
              <span className="bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {team.members?.length || 0}
              </span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          </button>
        </div>

        {/* Liste des chasses au trésor */}
        <div className="p-4 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Chasses au trésor</h2>
          {treasureHunts && treasureHunts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {treasureHunts.map((hunt) => (
                <TeamTreasureHuntCard
                  key={hunt["@id"]}
                  teamTreasureHunt={hunt}
                />
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 bg-white rounded-lg">
              <p className="text-gray-500 italic text-center">Aucune chasse au trésor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
