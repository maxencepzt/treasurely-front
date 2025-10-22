import type { SerializedError } from '@reduxjs/toolkit';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_CONFIG } from '../../config/api';
import type { user } from "../../types/api";
import type { rootState } from '../index';

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const state = api.getState() as rootState;
  const token = state.auth?.token;

  const baseQuery = fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  return baseQuery(args, api, extraOptions);
};

const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getAuthentifiedUser: build.query<user, null>({
      query: () => 'me',
    }),
    login: build.mutation<{ token: string; refresh_token: string }, { nickname: string; password: string }>({
      query: ({ nickname, password }) => ({
        url: 'auth',
        method: 'POST',
        body: { nickname, password },
      }),
    }),
    refreshToken: build.mutation<{ token: string; refresh_token: string }, { refresh_token: string }>({
        query: ({ refresh_token }) => ({
            url: 'token/refresh',
            method: 'POST',
            body: { refresh_token },
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

export const { useGetAuthentifiedUserQuery, useLoginMutation, useUploadImageMutation, useUserProfilePictureDeleteMutation, useRefreshTokenMutation } = api;
export default api;