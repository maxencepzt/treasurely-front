import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_CONFIG } from '../../config/api';
import type {
  AnyRiddleAPI,
  ParticipateHuntAPI,
  TeamAPI,
  TeamMembersAPI,
  TeamTreasureHuntsAPI,
  TreasureHuntAPI,
  User,
  UserTeamsAPI
} from "../../types/api";
import { getIdFromUrl } from '../../utils/api';
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
    userUploadProfilePicture: build.mutation<
      { message: string | undefined; id: number | undefined; error: string | undefined },
      { userId: number, formData: FormData }
    >({
      query: ({ userId, formData }) => ({
        url: `users/${userId}/picture`,
        method: 'POST',
        body: formData,
      }),
    }),
    userProfilePictureDelete: build.mutation<{ message: string }, number>({
      query: (userId) => ({
        url: `users/${userId}/picture`,
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
    teamById: build.query<TeamAPI, { id: number }>({
      query: ({ id }) => ({
        url: `teams/${id}`,
        method: 'GET',
      }),
    }),
    userTeamsById: build.query<UserTeamsAPI, { id: number }>({
      query: ({ id }) => ({
        url: `users/${id}/teams`,
        method: 'GET',
      }),
    }),
    teamMembersById: build.query<TeamMembersAPI, { id: number }>({
      query: ({ id }) => ({
        url: `teams/${id}/members`,
        method: 'GET',
      }),
    }),
    teamTreasureHuntsById: build.query<{ hunts: TeamTreasureHuntsAPI[] }, { id: number }>({
      query: ({ id }) => ({
        url: `teams/${id}/treasure_hunts`,
        method: 'GET',
      }),
    }),
    riddleGetById: build.query<AnyRiddleAPI, { id: number }>({
      query: ({ id }) => ({
        url: `riddles/${id}`,
        method: 'GET',
      }),
    }),
    getTreasureHuntRiddles: build.query<AnyRiddleAPI[], { huntId: number }>({
      query: ({ huntId }) => ({
        url: `treasure_hunts/${huntId}/riddles`,
        method: 'GET',
      }),
    }),
    getParticipateHuntByUserAndHunt: build.query<
      ParticipateHuntAPI | null,
      { userId: number; huntId: number }
    >({
      query: ({ userId }) => ({
        url: `users/${userId}/participate_hunts`,
        method: 'GET',
      }),
      transformResponse: (response: any, _meta, arg) => {
        console.log('🔍 Participations de l\'utilisateur:', response);
        console.log('🎯 Recherche pour huntId:', arg.huntId);

        let participations: ParticipateHuntAPI[] = [];

        // Gérer les réponses Hydra (avec hydra:member)
        if (response && typeof response === 'object' && 'hydra:member' in response) {
          participations = response['hydra:member'];
        } else if (Array.isArray(response)) {
          participations = response;
        }

        console.log('📊 Nombre de participations trouvées:', participations.length);

        // Filtrer pour trouver la participation à cette chasse spécifique
        const matchingParticipation = participations.find((p: ParticipateHuntAPI) => {
          // Comparer avec l'IRI
          if (typeof p.treasureHunt === 'string') {
            const huntId = getIdFromUrl(p.treasureHunt);
            return huntId === arg.huntId;
          }
          // Ou comparer directement si c'est un ID
          return p.treasureHunt === arg.huntId;
        });

        if (matchingParticipation) {
          console.log('✅ Participation trouvée pour cette chasse:', matchingParticipation);
          return matchingParticipation;
        }

        console.log('❌ Aucune participation pour cette chasse');
        return null;
      },
    }),
    createParticipateHunt: build.mutation<
      ParticipateHuntAPI,
      {
        lastParticipate: string;
        hunter: string;
        hunt: string;
        playerTeam?: string;
        currentRiddle: string;
      }
    >({
      query: (body) => ({
        url: 'participate_hunts/new',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetAuthentifiedUserQuery,
  useLoginMutation,
  useUserUploadProfilePictureMutation,
  useUserProfilePictureDeleteMutation,
  useRefreshTokenMutation,
  useLazyGetAuthentifiedUserQuery,
  useLogoutMutation,
  useUserByIdQuery,
  useLogoutSSOMutation,
  useTreasureHuntGetByIdQuery,
  useTeamByIdQuery,
  useTeamMembersByIdQuery,
  useTeamTreasureHuntsByIdQuery,
  useUserTeamsByIdQuery,
  useRiddleGetByIdQuery,
  useGetTreasureHuntRiddlesQuery,
  useGetParticipateHuntByUserAndHuntQuery,
  useLazyGetParticipateHuntByUserAndHuntQuery,
  useCreateParticipateHuntMutation,
} = api;
export default api;