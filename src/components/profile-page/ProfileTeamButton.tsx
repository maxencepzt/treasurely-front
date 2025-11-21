import { useNavigate } from "react-router";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTeamByIdQuery } from "../../store/slices/api.ts";
import { getIdFromUrl } from "../../utils/api.ts";
import { parseApiError } from "../../utils/api.ts";
import ErrorView from "../../views/Error.tsx";

/**
 * Button affichant une équipe d'un utilisateur
 * @param teamRoute Forme "/api/teams/1"
 * @example <ProfileTeamButton teamRoute={team} />
 */
export default function ProfileTeamButton({teamRoute}: {teamRoute: string}) {
  const navigate = useNavigate();
  const { data: team, isLoading, error } = useTeamByIdQuery({id: getIdFromUrl(teamRoute)});

  if (error) {
    const { status, message } = parseApiError(error);
    return <ErrorView status={status} message={message} />;
  }
  if (isLoading) return null;
  if (!team) {
    return <ErrorView status={404} message="Team not found" />;
  }

  return (
    <button
      type="button"
      className="px-5 py-3 gap-2 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:scale-95 shadow-md hover:shadow-lg border-2 border-green-800 transition-all duration-200 cursor-pointer text-white font-semibold whitespace-nowrap flex-shrink-0"
      onClick={() => { navigate(`/teams/${team.id}`) }}
    >
      <FontAwesomeIcon icon={ faUsers } />
      <span>{team.name}</span>
    </button>
  );
}

