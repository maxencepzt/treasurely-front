import TeamButton from '../TeamButton.tsx';

/**
 * Button affichant une équipe d'un utilisateur
 * @param teamRoute Forme "/api/teams/1"
 * @example <ProfileTeamButton teamRoute={team} />
 * @deprecated Utiliser TeamButton directement
 */
export default function ProfileTeamButton({teamRoute}: {teamRoute: string}) {
  return <TeamButton teamRoute={teamRoute} />;
}

