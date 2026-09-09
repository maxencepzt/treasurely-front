import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_CONFIG } from '../../config/api';
import type {
  AnyRiddleAPI,
  ParticipateHuntAPI,
  ParticipateRiddleAPI,
  PlayerTeamInput,
  RiddleAttempt,
  ScoreboardAPI,
  TeamAPI,
  TeamCollectionAPI,
  TeamJoinRequestAPI,
  TeamJoinRequestCollectionAPI,
  TeamMembersAPI,
  TeamParticipateHuntsAPI,
  TeamTreasureHuntsAPI,
  TreasureHuntAPI, TreasureHuntCollectionAPI,
  User, UserParticipateHuntsAPI,
  UserRegistration,
  UserTeamsAPI,
  UserUpdate
} from "../../types/api";
import type { rootState } from '../index';
import { logout, setCredentials } from './authSlice';
import { pictureChanged } from './pictureSlice';

/**
 * fetchBaseQuery ne sérialise un corps en JSON que si le Content-Type ressemble à
 * application/json : les types d'API Platform (JSON-LD, merge-patch) partiraient en
 * « [object Object] ». On les reconnaît aussi.
 */
const isJsonContentType = (headers: Headers) =>
    /application\/(ld\+|merge-patch\+|vnd\.api\+)?json/.test(headers.get('content-type') ?? '');

const baseQuery = fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl + '/api',
    isJsonContentType,
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
  // Les participations changent à chaque jointure et à chaque énigme résolue :
  // les mutations concernées invalident la liste plutôt que de la recharger à la main.
  // `Me` et `User` suivent le profil : sa mise à jour rafraîchit le contexte et la page profil.
  // `Teams` suit la liste des équipes du joueur et l'annuaire, `Team` une équipe et ses membres,
  // `TeamRequests` les demandes d'adhésion, des deux côtés.
  tagTypes: ['Participations', 'Me', 'User', 'Teams', 'Team', 'TeamRequests'],
  endpoints: (build) => ({
    getAuthentifiedUser: build.query<User, null>({
      query: () => ({
        url: 'me',
        method: 'GET',
      }),
      providesTags: ['Me'],
    }),
    login: build.mutation<{ token: string; refresh_token: string }, { nickname: string; password: string }>({
      query: ({ nickname, password }) => ({
        url: 'auth',
        method: 'POST',
        body: { nickname, password },
      }),
    }),
    register: build.mutation<User, UserRegistration>({
      query: (body) => ({
        url: 'register',
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body,
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
      // Les avatars gardent leur adresse : la version du store leur fait redemander l'image
      async onQueryStarted(_arguments, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(pictureChanged());
      },
    }),
    userProfilePictureDelete: build.mutation<{ message: string }, number>({
      query: (userId) => ({
        url: `users/${userId}/picture`,
        method: 'DELETE',
      }),
      async onQueryStarted(_arguments, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(pictureChanged());
      },
    }),
    userById: build.query<User, { id: number }>({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'User', id }],
    }),
    updateUser: build.mutation<User, { id: number } & UserUpdate>({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/merge-patch+json' },
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Me', { type: 'User', id }],
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
      providesTags: (_result, _error, { id }) => [{ type: 'Team', id }],
    }),
    userTeamsById: build.query<UserTeamsAPI, { id: number }>({
      query: ({ id }) => ({
        url: `users/${id}/teams`,
        method: 'GET',
      }),
      providesTags: ['Teams'],
    }),
    teamMembersById: build.query<TeamMembersAPI, { id: number }>({
      query: ({ id }) => ({
        url: `teams/${id}/members`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'Team', id }],
    }),
    playerTeams: build.query<TeamCollectionAPI, { name?: string }>({
      query: ({ name }) => ({
        url: 'player_teams',
        method: 'GET',
        params: name ? { name } : undefined,
      }),
      providesTags: ['Teams'],
    }),
    createPlayerTeam: build.mutation<TeamAPI, PlayerTeamInput>({
      query: (body) => ({
        url: 'player_teams',
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body,
      }),
      invalidatesTags: ['Teams'],
    }),
    joinTeamByCode: build.mutation<TeamAPI, { code: string }>({
      query: (body) => ({
        url: 'player_teams/join',
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body,
      }),
      invalidatesTags: (result) => (result ? ['Teams', { type: 'Team', id: result.id }] : ['Teams']),
    }),
    leaveTeam: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `teams/${id}/leave`,
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body: {},
      }),
      invalidatesTags: (_result, _error, { id }) => ['Teams', { type: 'Team', id }],
    }),
    deleteTeam: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teams'],
    }),
    // Le code de jointure n'est servi qu'aux membres
    teamCode: build.query<{ code: string }, { id: number }>({
      query: ({ id }) => ({
        url: `player_teams/${id}/code`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'Team', id }],
    }),
    requestToJoin: build.mutation<TeamJoinRequestAPI, { id: number }>({
      query: ({ id }) => ({
        url: `player_teams/${id}/requests`,
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body: {},
      }),
      invalidatesTags: ['TeamRequests'],
    }),
    myTeamRequests: build.query<TeamJoinRequestCollectionAPI, void>({
      query: () => ({
        url: 'me/team_requests',
        method: 'GET',
      }),
      providesTags: ['TeamRequests'],
    }),
    teamRequests: build.query<TeamJoinRequestCollectionAPI, { id: number }>({
      query: ({ id }) => ({
        url: `player_teams/${id}/requests`,
        method: 'GET',
      }),
      providesTags: ['TeamRequests'],
    }),
    // Accepter fait entrer le joueur : l'équipe et ses membres se rechargent
    decideRequest: build.mutation<TeamJoinRequestAPI, { id: number; teamId: number; decision: 'accept' | 'refuse' }>({
      query: ({ id, decision }) => ({
        url: `team_requests/${id}/${decision}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body: {},
      }),
      invalidatesTags: (_result, _error, { teamId }) => ['TeamRequests', 'Teams', { type: 'Team', id: teamId }],
    }),
    withdrawRequest: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `team_requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TeamRequests'],
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
    participateHuntGetById: build.query<ParticipateHuntAPI, { id: number }>({
      query: ({ id }) => ({
        url: `participate_hunts/${id}`,
        method: 'GET',
      }),
    }),
    teamParticipateHuntsById: build.query<TeamParticipateHuntsAPI, { id: number }>({
      query: ({ id }) => ({
        url: `teams/${id}/participate_hunts`,
        method: 'GET',
      }),
    }),
    getUserParticipateHuntsById: build.query<UserParticipateHuntsAPI, { id: number }>({
      query: ({ id }) => ({
        url: `users/${id}/participate_hunts`,
        method: 'GET',
      }),
      providesTags: ['Participations'],
    }),
    treasureHuntScoreboard: build.query<ScoreboardAPI, { id: number }>({
      query: ({ id }) => ({
        url: `treasure_hunts/${id}/scoreboard`,
        method: 'GET',
      }),
      // Le classement dépend du spectateur et bouge à chaque chasse terminée
      providesTags: ['Participations'],
    }),
    joinHunt: build.mutation<ParticipateHuntAPI, { hunt: string; playerTeam?: string }>({
      query: (body) => ({
        url: 'participate_hunts',
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body,
      }),
      invalidatesTags: ['Participations'],
    }),
    leaveHunt: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `participate_hunts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Participations'],
    }),
    replayHunt: build.mutation<ParticipateHuntAPI, { id: number }>({
      query: ({ id }) => ({
        url: `participate_hunts/${id}/replay`,
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body: {},
      }),
      invalidatesTags: ['Participations'],
    }),
    attemptRiddle: build.mutation<ParticipateRiddleAPI, { id: number; attempt: RiddleAttempt }>({
      query: ({ id, attempt }) => ({
        url: `riddles/${id}/attempt`,
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body: attempt,
      }),
      invalidatesTags: ['Participations'],
    }),
    getAllTreasureHunts: build.query<TreasureHuntCollectionAPI, void>({
      query: () => ({
        url: 'treasure_hunts',
        method: 'GET',
      }),
    }),
    userDelete: build.mutation<{ message: string }, { userId: number }>({
      query: ({ userId }) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAuthentifiedUserQuery,
  useLoginMutation,
  useRegisterMutation,
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
  usePlayerTeamsQuery,
  useCreatePlayerTeamMutation,
  useJoinTeamByCodeMutation,
  useLeaveTeamMutation,
  useDeleteTeamMutation,
  useTeamCodeQuery,
  useRequestToJoinMutation,
  useMyTeamRequestsQuery,
  useTeamRequestsQuery,
  useDecideRequestMutation,
  useWithdrawRequestMutation,
  useTeamTreasureHuntsByIdQuery,
  useUserTeamsByIdQuery,
  useRiddleGetByIdQuery,
  useParticipateHuntGetByIdQuery,
  useTeamParticipateHuntsByIdQuery,
  useGetUserParticipateHuntsByIdQuery,
  useGetAllTreasureHuntsQuery,
  useUserDeleteMutation,
  useUpdateUserMutation,
  useJoinHuntMutation,
  useReplayHuntMutation,
  useLeaveHuntMutation,
  useAttemptRiddleMutation,
  useTreasureHuntScoreboardQuery,
} = api;
export default api;