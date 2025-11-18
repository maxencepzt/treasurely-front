import { ProfileIdentity } from '../../components/profile-page/ProfileIdentity.tsx';
import ProfileStatSection from '../../components/profile-page/ProfileStatSection.tsx';
import type { User } from '../../types/api.ts';

export function ProfilePublic({ user, isOwner = false }: { user: User, isOwner?: boolean }) {
  return (
    <div className="min-h-screen flex justify-center">
      {/* Conteneur téléphone avec bordures */}
      <div className="w-full max-w-md bg-white min-h-screen">
        <div>
          <ProfileIdentity user={user} editable={isOwner} />
        </div>
        {/* Stats section */}
        <ProfileStatSection user={user} />
      </div>
    </div>
  );
}
