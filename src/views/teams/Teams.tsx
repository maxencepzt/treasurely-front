import { useParams } from "react-router";

import { Loading } from "../../components";
import TeamMemberItem from "../../components/teams/TeamMemberItem";
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
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white min-h-screen">
        {/* Header avec nom et description */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{team.name}</h1>
          <p className="text-gray-700">{team.description}</p>
        </div>

        {/* Section membres */}
        <div className="mt-4">
          <h2 className="px-4 pb-3 text-lg font-semibold text-gray-800">
            Membres ({team.members?.length || 0})
          </h2>

          <div className="bg-white">
            {team.members && team.members.length > 0 ? (
              team.members.map((member, index) => (
                <TeamMemberItem
                  key={member["@id"]}
                  member={member}
                  isLast={index === team.members!.length - 1}
                />
              ))
            ) : (
              <div className="px-4 py-6">
                <p className="text-gray-500 italic text-center">Aucun membre dans cette équipe</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
