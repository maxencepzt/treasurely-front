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
        {/* Profile Identity */}
        <div>
          <ProfileIdentity user={user} editable={isOwner} />
        </div>

        {/* Description section */}
        {user.description && (
          <div className="px-4 pb-6">
            <h2 className="pb-3 text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <span>À propos</span>
            </h2>
            <p className="text-gray-700 text-base leading-relaxed bg-gradient-to-br from-white to-green-50 rounded-2xl p-4 border-2 border-green-100 shadow-sm">
              {user.description.slice(0, 150)}
            </p>
          </div>
        )}

        {/* Teams section */}
        {!isLoading && userTeams && userTeams.teams && userTeams.teams.length > 0 && (
          <ProfileTeamsList teamRoutes={userTeams.teams} />
        )}

        {/* Stats section */}
        <ProfileStatSection user={user} />
      </div>
    </div>
  );
}
