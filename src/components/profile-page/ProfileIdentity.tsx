import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { User } from '../../types/api.ts';
import UserProfilePicture from '../UserProfilePicture.tsx';

export function ProfileIdentity({ user, editable = false }: { user: User, editable?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3">
      {/* Avatar à gauche */}
      <UserProfilePicture userData={user} size={52} />

      {/* Nickname au centre */}
      <span className="text-xl font-semibold">{user.nickname}</span>

      {/* Icon d'édition à droite */}
      <div className="w-10">
        {editable ? (
          <FontAwesomeIcon icon={faGear} className="text-3xl" />
        ) : null}
      </div>
    </div>
  );
}
