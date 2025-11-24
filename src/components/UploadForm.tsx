import { type FormEvent, useCallback } from 'react';
import { faFileImage, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useUser } from '../contexts/user';
import { parseApiError } from '../utils/api';
import ProfilePicture from './ProfilePicture';

type uploadFormProps = {
  onSubmit: () => void;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  error?: FetchBaseQueryError | SerializedError;
}

function UploadForm ({onSubmit, onChange, error}: uploadFormProps) {
  const { user } = useUser();

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  }, [onSubmit]);

  const handleChange = useCallback((e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    onChange(e);
  }, [onChange]);

  if (!user) return null;

  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      className="bg-white flex flex-col p-6 sm:p-8 border border-gray-300 rounded-2xl shadow-lg gap-4"
    >
      <h1 className="text-3xl font-bold">Télécharger une photo de profil</h1>

      <ProfilePicture type="user" id={user.id} size={80} />

      {error && (<div className="text-red-600 text-sm">{parseApiError(error).message}</div>)}

      <label className="cursor-pointer">
        <FontAwesomeIcon icon={faFileImage} className="me-1" />
        Choisir une image à télécharger
        <input
          onChange={handleChange}
          type="file"
          name="image"
          accept="image/*"
          className="mt-2 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            cursor-pointer
          "
        />
      </label>

      <button
        type="submit"
        className="text-red-600 hover:text-red-700 cursor-pointer text-left"
      >
        <FontAwesomeIcon icon={faTrash} className="me-1" />
        Supprimer l'image
      </button>
    </form>
  );
}

export default UploadForm;