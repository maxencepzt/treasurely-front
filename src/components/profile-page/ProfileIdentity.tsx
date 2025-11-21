import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { User } from '../../types/api.ts';
import UserProfilePicture from '../UserProfilePicture.tsx';

export function ProfileIdentity({ user, editable = false }: { user: User, editable?: boolean }) {
  return (
    <div className="relative bg-gradient-to-br from-green-600 to-green-700 px-4 py-6 mb-4 shadow-lg">
      {/* Icon d'édition en haut à droite */}
      {editable && (
        <div className="absolute top-4 right-4">
          <FontAwesomeIcon icon={faGear} className="text-2xl text-white hover:text-green-100 transition-colors cursor-pointer" />
        </div>
      )}

      {/* Avatar et Nickname centrés */}
      <div className="flex flex-col items-center gap-3">
        <div className="ring-4 ring-white rounded-full">
          <UserProfilePicture userData={user} size={80} />
        </div>
        <span className="text-2xl font-bold text-white drop-shadow-md">{user.nickname}</span>
      </div>
    </div>
  );
}
