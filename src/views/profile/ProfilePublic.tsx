import { ProfileIdentity } from '../../components/profile-page/ProfileIdentity.tsx';
import ProfileStatSection from '../../components/profile-page/ProfileStatSection.tsx';
import ProfileTeamButton from '../../components/profile-page/ProfileTeamButton.tsx';
import type { User } from '../../types/api.ts';

export function ProfilePublic({ user, isOwner = false }: { user: User, isOwner?: boolean }) {
  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      {/* Conteneur téléphone avec bordures */}
      <div className="w-full max-w-md bg-white min-h-screen">
        {/* Profile Identity */}
        <div>
          <ProfileIdentity user={user} editable={isOwner} />
        </div>

        {/* Description section */}
        {user.description && (
          <div className="px-4 pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">À propos</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {user.description.slice(0, 150)}
            </p>
          </div>
        )}

        {/* Teams section */}
        {user.teams && user.teams.length > 0 && (
          <div className="px-4 pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Équipes</h2>
            <div className="flex flex-wrap gap-2">
              {user.teams.map((teamRoute) => (
                <ProfileTeamButton key={teamRoute} teamRoute={teamRoute} />
              ))}
            </div>
          </div>
        )}

        {/* Stats section */}
        <ProfileStatSection user={user} />
      </div>
    </div>
  );
}
