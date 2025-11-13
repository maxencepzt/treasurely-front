import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ProfileIdentity } from '../../components/profile-page/ProfileIdentity.tsx';
import type { User } from '../../types/api.ts';

export function ProfilePrivate({ user }: { user: User }) {
  return (
    <div className="min-h-screen flex justify-center">
      {/* Conteneur téléphone avec bordures */}
      <div className="w-full max-w-md bg-white min-h-screen">
        <div>
        <ProfileIdentity user={user} />
        </div>
        {/* Zone centrée pour le cadenas et le message */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] gap-4">
          <FontAwesomeIcon icon={faLock} className="text-gray-800 text-6xl" />
          <p className="text-gray-600 text-xl font-semibold">Ce profil est privé</p>
        </div>
      </div>
    </div>
  );
}
