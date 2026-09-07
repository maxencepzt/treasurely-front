import type { TeamSummaryAPI } from '../../types/api.ts';
import { TeamButton } from "../index.ts";

/**
 * Liste des équipes d'un utilisateur
 * @param teams Équipes telles que listées par /users/{id}/teams
 * @example <ProfileTeamsList teams={userTeams.teams} />
 */
export default function ProfileTeamsList({ teams }: { teams: TeamSummaryAPI[] }) {
  return (
    <div className="px-4 pb-6">
      <h2 className="pb-3 text-xl font-bold text-gray-900 flex items-center gap-2">
        <span className="text-2xl">👥</span>
        <span>Équipes</span>
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {teams.map((team) => (
          <TeamButton key={team["@id"]} teamRoute={team["@id"]} />
        ))}
      </div>
    </div>
  );
}
