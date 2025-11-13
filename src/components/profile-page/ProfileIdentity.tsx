import type { User } from '../../types/api.ts';
import UserProfilePicture from '../UserProfilePicture.tsx';

export function ProfileIdentity({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <UserProfilePicture userData={user} />

      {/* Nickname */}
      <div className="flex flex-col">
        <span className="text-xl font-semibold">{user.nickname}</span>
      </div>
    </div>
  );
}
