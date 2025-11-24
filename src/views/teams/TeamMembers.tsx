import { useParams } from "react-router";

import { BackButton, Loading } from "../../components";
import TeamMemberItem from "../../components/teams/TeamMemberItem";
import { useTeamWithMembers } from "../../hooks/useTeamWithMembers";
import { parseApiError } from "../../utils/api";
import ErrorView from "../Error";

export default function TeamMembers() {
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
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-gray-50 to-green-50">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl">
        {/* Header avec bouton retour et nom de l'équipe */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
          <div className="flex items-center gap-3 p-4">
            <BackButton variant="light" />
            <h1 className="text-xl font-bold text-gray-900">{team.name}</h1>
          </div>
        </div>

        {/* Liste des membres */}
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
            <div className="px-4 py-12">
              <p className="text-gray-500 italic text-center">Aucun membre dans cette équipe</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

