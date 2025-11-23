import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BackButton } from '../../components';
import { ProfileIdentity } from '../../components/profile-page/ProfileIdentity.tsx';
import type { User } from '../../types/api.ts';

export function ProfilePrivate({ user }: { user: User }) {
  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-gray-50 to-green-50">
      {/* Conteneur téléphone avec bordures */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl">
        {/* Bouton retour */}
        <div className="absolute top-4 left-4 z-10">
          <BackButton variant="dark" />
        </div>

        <div>
          <ProfileIdentity user={user} />
        </div>

        {/* Zone centrée pour le cadenas et le message */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-6 px-4">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 shadow-lg">
            <FontAwesomeIcon icon={faLock} className="text-gray-600 text-6xl" />
          </div>
          <p className="text-gray-700 text-2xl font-bold text-center">Ce profil est privé</p>
          <p className="text-gray-500 text-base text-center max-w-xs">
            Seul le propriétaire de ce profil peut voir ses informations.
          </p>
        </div>
      </div>
    </div>
  );
}
