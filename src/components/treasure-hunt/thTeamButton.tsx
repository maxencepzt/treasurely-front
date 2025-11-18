import { useNavigate } from "react-router";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTeamByIdQuery } from "../../store/slices/api.ts";
import { getIdFromUrl } from "../../utils/api.ts";
import { parseApiError } from "../../utils/api.ts";
import ErrorView from "../../views/Error.tsx";
import { Loading } from "../index.ts";

/**
 * Button affichant l'équipe d'une chasse au trésor
 * @param teamRoute Forme "/api/teams/1"
 * @example <THTeamButton team={treasureHunt.team} />
 */
export default function THTeamButton({teamRoute}: {teamRoute: string}) {
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
      className="p-2 ml-4 gap-2 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-colors cursor-pointer"
      onClick={() => { navigate(`/teams/${team.id}`) }}
    >
      <FontAwesomeIcon icon={ faUsers } />
      <span>{team.name}</span>
    </button>
  )
}