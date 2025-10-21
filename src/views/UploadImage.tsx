import { useUploadImageMutation, useUserProfilePictureDeleteMutation } from '../store/slices/api';
import { FormEvent } from 'react';
import { Loading, UploadForm } from '../components';

function UploadImage() {
  const [userProfilePictureDelete, { isLoading: isLoadingDelete, error: errorDelete }] = useUserProfilePictureDeleteMutation();
  const [uploadImagePost, { isLoading: isLoadingUpload, error: errorUpload }] = useUploadImageMutation();

  async function handleSubmit() {
    try {
      await userProfilePictureDelete(null).unwrap();
    } catch (error) {
      console.error('Failed to delete profile picture:', error);
    }
  }

  async function handleChange(e: FormEvent<HTMLInputElement>) {
    const formData = new FormData(e.currentTarget.form!);

    try {
      await uploadImagePost(formData).unwrap();
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