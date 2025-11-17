import type { FormEvent } from 'react';

import { Loading, UploadForm } from '../components';
import { useUserUploadProfilePictureMutation, useUserProfilePictureDeleteMutation } from '../store/slices/api';
import { useUser } from '../contexts/user';

function UploadImage() {
  const [userProfilePictureDelete, { isLoading: isLoadingDelete, error: errorDelete }] = useUserProfilePictureDeleteMutation();
  const [uploadImagePost, { isLoading: isLoadingUpload, error: errorUpload }] = useUserUploadProfilePictureMutation();
  const { user } = useUser();

  async function handleSubmit() {
    if (!user) return;

    try {
      await userProfilePictureDelete(user.id).unwrap();

      window.location.reload();
    } catch (error) {
      console.error('Failed to delete profile picture:', error);
    }
  }

  async function handleChange(e: FormEvent<HTMLInputElement>) {
    if (!user) return;

    const formData = new FormData(e.currentTarget.form!);

    try {
      await uploadImagePost({userId: user.id, formData }).unwrap();

      window.location.reload();
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }

  return (
    <>
      {(isLoadingUpload || isLoadingDelete) ? (<Loading/>) : (<UploadForm onSubmit={handleSubmit} error={errorUpload || errorDelete} onChange={handleChange}/>)}
    </>
  );
}

export default UploadImage;