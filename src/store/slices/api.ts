import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {user} from "../../types/api";
import { API_CONFIG } from '../../config/api';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (build) => ({
    getAuthentifiedUser: build.query<user, null>({
      query: () => 'me',
    }),
    login: build.mutation<{ token: string; refreshToken: string }, { nickname: string; password: string }>({
      query: ({ nickname, password }) => ({
        url: 'auth',
        method: 'POST',
        body: { nickname, password },
      }),
    }),
    uploadImage: build.mutation<{ message: string }, FormData>({
      query: (formData) => ({
        url: 'pictures/upload',
        method: 'POST',
        body: formData,
      }),
    }),
    userProfilePictureDelete: build.mutation<{ message: string }, null>({
      query: () => ({
        url: 'users/picture',
        method: 'DELETE',
      }),
    }),
  }),
});

export const getErrorMessage = (error?: FetchBaseQueryError | SerializedError) =>{
  if (!error) return null;

  if ('status' in error) {
    // FetchBaseQueryError
    if ('data' in error && typeof error.data === 'object' && error.data !== null) {
      const data = error.data as { message?: string };
      return data.message || `Erreur ${error.status}`;
    }
    return `Erreur ${error.status}`;
  }

  // SerializedError
  return error.message || 'Une erreur est survenue';
};

export const { useGetAuthentifiedUserQuery, useLoginMutation, useUploadImageMutation, useUserProfilePictureDeleteMutation } = api;
export default api;