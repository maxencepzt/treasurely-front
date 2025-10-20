import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {user} from "../../types/api";

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
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