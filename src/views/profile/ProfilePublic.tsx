import { BackButton } from '../../components';
import { ProfileIdentity } from '../../components/profile-page/ProfileIdentity.tsx';
import ProfileStatSection from '../../components/profile-page/ProfileStatSection.tsx';
import ProfileTeamsList from '../../components/profile-page/ProfileTeamsList.tsx';
import { useUserTeamsByIdQuery } from '../../store/slices/api.ts';
import type { User } from '../../types/api.ts';

export function ProfilePublic({ user, isOwner = false }: { user: User, isOwner?: boolean }) {
  const { data: userTeams, isLoading } = useUserTeamsByIdQuery({ id: user.id });

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-gray-50 to-green-50">
      {/* Conteneur téléphone avec bordures */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl">
        {/* Profile Identity avec BackButton */}
        <div className="relative">
          {/* Bouton retour */}
          <div className="absolute top-4 left-4 z-10">
            <BackButton variant="dark" />
          </div>
          <ProfileIdentity user={user} editable={isOwner} />
        </div>

        {/* Description section */}
        {user.description && (
          <div className="px-6 pb-6 bg-gradient-to-b from-white to-green-50">
            <h2 className="pb-3 text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <span>À propos</span>
            </h2>
            <p className="text-gray-700 text-base leading-relaxed bg-white rounded-2xl p-4 border-2 border-green-100 shadow-sm">
              {user.description.length > 150
                ? `${user.description.slice(0, 150)}...`
                : user.description}
            </p>
          </div>
        )}

        {/* Teams section */}
        {!isLoading && userTeams && userTeams.teams && userTeams.teams.length > 0 && (
          <ProfileTeamsList teams={userTeams.teams} />
        )}

        {/* Stats section */}
        <ProfileStatSection user={user} />
      </div>
    </div>
  );
}
