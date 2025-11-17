import type { SerializedError } from '@reduxjs/toolkit';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_CONFIG } from '../../config/api';
import type { TreasureHuntAPI, User } from "../../types/api";
import type { rootState } from '../index';
import { logout, setCredentials } from './authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl + '/api',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as rootState).auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// baseQuery sans authentification pour le refresh
const baseQueryWithoutAuth = fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl + '/api',
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
            const refreshResult = await baseQueryWithoutAuth(
                {
                    url: '/token/refresh',
                    method: 'POST',
                    body: { refresh_token: refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                api.dispatch(setCredentials(refreshResult.data as {token: string; refresh_token: string}));
                // Réexécuter la requête originale
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};

const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getAuthentifiedUser: build.query<User, null>({
      query: () => ({
        url: 'me',
        method: 'GET',
      }),
    }),
    login: build.mutation<{ token: string; refresh_token: string }, { nickname: string; password: string }>({
      query: ({ nickname, password }) => ({
        url: 'auth',
        method: 'POST',
        body: { nickname, password },
      }),
    }),
    logout: build.mutation<{ message: string }, { refresh_token: string }>({
      query: ({ refresh_token }) => ({
        url: 'token/invalidate',
        method: 'POST',
        body: { refresh_token },
      }),
    }),
    logoutSSO: build.mutation<{ message: string }, void>({
      query: () => ({
        url: 'sso/logout',
        method: 'POST',
      }),
    }),
    refreshToken: build.mutation<{ token: string; refresh_token: string }, { refresh_token: string }>({
        query: ({ refresh_token }) => ({
            url: 'token/refresh',
            method: 'POST',
            body: { refresh_token },
        }),
    }),
    uploadImage: build.mutation<{ message: string|undefined, id: number|undefined, error: string|undefined }, FormData>({
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
    userById: build.query<User, { id: number }>({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: 'GET',
      }),
    }),
    treasureHuntGetById: build.query<TreasureHuntAPI, { id: number }>({
      query: ({ id }) => ({
        url: `treasure_hunts/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

/**
 * Récupère un message d'erreur lisible à partir d'une erreur FetchBaseQueryError ou SerializedError
 * @param error
 */
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

export const {
  useGetAuthentifiedUserQuery,
  useLoginMutation,
  useUploadImageMutation,
  useUserProfilePictureDeleteMutation,
  useRefreshTokenMutation,
  useLazyGetAuthentifiedUserQuery,
  useLogoutMutation,
  useUserByIdQuery,
  useLogoutSSOMutation,
  useTreasureHuntGetByIdQuery,
} = api;
export default api;