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
export default api;