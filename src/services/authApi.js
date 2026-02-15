import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./commonRtk";
import { updateProfile } from "../store/slices/authSlice";
import { userApi } from "../pages/ViewUser/hook/userApi";

export const authApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Token", "Friend", "Message", "Search", "Me", 'Avatar'],
  reducerPath: "authApi",
  endpoints: (builder) => ({
    // 认证相关
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // 可选：这里可以 dispatch(updateProfile(data.user)) 如果 login 返回用户信息
        } catch (err) {
          console.log(err);
        }
      },
    }),

    putAvatar: builder.mutation({
      query: (body) => ({
        url: "files/avatar",
        method: "PUT", // ✅ 大写
        body,
      }),
      invalidatesTags: ["Me"],
    }),

    loadMyAvatar: builder.query({
      query: () => 'auth/my_avatar',
      providesTags: ['Avatar']
    }),
    putWinAvatar: builder.mutation({
      query: (data) => ({
        url: 'auth/me_avatar',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Avatar']
    }),
    getMe: builder.query({
      query: () => "auth/me",
      providesTags: ["Me"],
    }),
    
    putProfile: builder.mutation({
      query: (body) => ({
        url: "auth/me",
        method: "PUT", // ✅ 大写
        body,
      }),
      invalidatesTags: ["Me"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: metaData } = await queryFulfilled;
          const { data } = metaData
          dispatch(updateProfile({ ...data }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
    putDownCv: builder.mutation({
      query: body => ({
        url: `auth/downMycv`,
        method: 'put',
        invalidateTags: ["Me"]
      })
    }),
    hostLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Token", "Message", "Friend", "Me"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(userApi.util.invalidateTags(["Photos"]));
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
    // 密码重置
    requestPasswordReset: builder.mutation({
      query: (email) => ({
        url: "/auth/request-password-reset",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/newpwd",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Token"],
    }),

    lostPwdReset: builder.mutation({
      query: (data) => ({
        url: "/auth/pwd_lost_reset",
        method: "POST",
        body: data,
      }),
    }),
    // 好友相关
    getFriends: builder.query({
      query: () => "/friends",
    }),
    sendFriendRequest: builder.mutation({
      query: (userId) => ({
        url: "/friends/requests",
        method: "POST",
        body: { userId },
      }),
    }),
    handleFriendRequest: builder.mutation({
      query: ({ requestId, accept }) => ({
        url: `/friends/requests/${requestId}`,
        method: "PUT",
        body: { accept },
      }),
    }),
    deleteFriend: builder.mutation({
      query: (friendId) => ({
        url: `/friends/${friendId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoadMyAvatarQuery,
  usePutWinAvatarMutation, //window avatar updating.
  useLoginMutation,
  useRequestPasswordResetMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  usePutProfileMutation,
  usePutDownCvMutation,
  usePutAvatarMutation,
  useResetPasswordMutation,
  useLostPwdResetMutation,
  useHostLogoutMutation,
} = authApi;