import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {user} from "../../types/api";
import { API_CONFIG } from '../../config/api';

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
  }),
});

export const { useGetAuthentifiedUserQuery, useLoginMutation } = api;
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

export default api;