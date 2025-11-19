import { useNavigate } from "react-router";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTeamByIdQuery } from "../../store/slices/api.ts";
import { getIdFromUrl } from "../../utils/api.ts";
import { parseApiError } from "../../utils/api.ts";
import ErrorView from "../../views/Error.tsx";
import { Loading } from "../index.ts";

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
  if (isLoading) return <Loading />;
  if (!team) {
    return <ErrorView status={404} message="Team not found" />;
  }

  return (
    <button
      type="button"
      className="px-4 py-2 gap-2 flex items-center justify-center rounded-lg bg-green-100 hover:bg-green-200 active:bg-green-300 border border-green-300 transition-colors cursor-pointer text-green-800 font-medium"
      onClick={() => { navigate(`/teams/${team.id}`) }}
    >
      <FontAwesomeIcon icon={ faUsers } />
      <span>{team.name}</span>
    </button>
  );
}

