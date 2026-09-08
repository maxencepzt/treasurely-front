import { type ChangeEvent, useState } from 'react';
import { faCamera, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useUserProfilePictureDeleteMutation, useUserUploadProfilePictureMutation } from '../../store/slices/api';
import type { User } from '../../types/api';
import { parseApiError } from '../../utils/api';
import { ProfilePicture } from '../';
import FormFeedback from './FormFeedback';

/** Les limites du serveur (`ImageUploadService`), rappelées avant l'envoi. */
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = 'image/jpeg,image/png,image/gif,image/webp';

const buttonClasses =
  'inline-flex items-center gap-2 min-h-11 px-4 rounded-lg border border-gray-300 bg-white text-base font-medium text-gray-900 hover:bg-green-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-within:ring-2 focus-within:ring-green-700 focus-visible:ring-2 focus-visible:ring-green-700 focus:outline-none';

/**
 * La photo de profil, changée ou supprimée sur place : le fichier part dès qu'il est choisi.
 * Les autres avatars de l'application se rafraîchissent par la version du store.
 */
export default function ProfilePictureEditor({ user }: { user: User }) {
  const [upload, { isLoading: uploading }] = useUserUploadProfilePictureMutation();
  const [remove, { isLoading: removing }] = useUserProfilePictureDeleteMutation();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = uploading || removing;

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Vide le champ : le même fichier peut être choisi de nouveau
    event.target.value = '';
    if (!file) return;

    setSuccess(null);
    setError(null);
    if (file.size > MAX_SIZE) {
      setError("L'image dépasse 5 Mo.");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    try {
      await upload({ userId: user.id, formData }).unwrap();
      setSuccess('Photo mise à jour.');
    } catch (failure) {
      setError(parseApiError(failure).message);
    }
  }

  async function handleDelete() {
    setSuccess(null);
    setError(null);
    try {
      await remove(user.id).unwrap();
      setSuccess('Photo supprimée.');
    } catch (failure) {
      setError(parseApiError(failure).message);
    }
  }

  return (
    <section aria-labelledby="settings-picture" className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <ProfilePicture type="user" id={user.id} size={96} alt={`Photo de ${user.nickname}`} />
        <div className="flex flex-col gap-2 min-w-0">
          <h2 id="settings-picture" className="text-lg font-semibold truncate">{user.nickname}</h2>
          <label className={buttonClasses}>
            <FontAwesomeIcon icon={faCamera} aria-hidden="true" />
            {uploading ? 'Envoi…' : 'Changer la photo'}
            <input type="file" accept={ACCEPTED} className="sr-only" disabled={busy} onChange={handleChange} />
          </label>
          <button type="button" onClick={handleDelete} disabled={busy} className={`${buttonClasses} text-red-700 hover:bg-red-50`}>
            <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
            {removing ? 'Suppression…' : 'Supprimer la photo'}
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600">JPEG, PNG, GIF ou WEBP, 5 Mo au plus.</p>
      <FormFeedback success={success} error={error} />
    </section>
  );
}
