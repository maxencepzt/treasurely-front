import { useParams } from "react-router";

import { Loading } from "../../components";
import { useTeamWithMembers } from "../../hooks/useTeamWithMembers";
import { parseApiError } from "../../utils/api.ts";
import ErrorView from "../Error.tsx";

export default function Teams() {
  const params = useParams();
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
    <div>test</div>
  );
}
