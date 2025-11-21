import { useNavigate, useParams } from "react-router";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Loading } from "../../components";
import TeamProfilePicture from "../../components/teams/TeamProfilePicture";
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
      </div>
    </div>
  );
}
