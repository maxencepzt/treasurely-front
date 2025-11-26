import { useNavigate } from 'react-router';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { User } from '../../types/api.ts';
import ProfilePicture from '../ProfilePicture.tsx';

export function ProfileIdentity({ user, editable = false }: { user: User, editable?: boolean }) {
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate(`/settings/profile/${user.id}`);
  };
  return (
    <div className="relative bg-gradient-to-br from-green-600 to-green-700 px-4 py-6 mb-4 shadow-lg">
      {/* Bouton d'édition en haut à droite */}
      {editable && (
        <button
          type="button"
          onClick={goToSettings}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800/70 hover:bg-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Éditer le profil"
          title="Éditer le profil"
        >
          <FontAwesomeIcon icon={faCog} className="text-xl text-white" />
        </button>
      )}

      {/* Avatar et Nickname centrés */}
      <div className="flex flex-col items-center gap-3">
        <div className="ring-4 ring-white rounded-full">
          <ProfilePicture type="user" id={user.id} size={80} alt={`Photo de ${user.nickname}`} />
        </div>
        <span className="text-2xl font-bold text-white drop-shadow-md">{user.nickname}</span>
      </div>
    </div>
  );
}
