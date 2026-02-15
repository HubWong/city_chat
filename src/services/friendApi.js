import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./commonRtk";

export const friendApi = createApi({
  reducerPath: "friendApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["friends"],
  endpoints: (builder) => ({
    getMyFriends: builder.query({
      query: ({ pg = 1, limit = 15, type = 1 }) => `/friends/list/${pg}/${limit}/${type}`,
      providesTags: ["friends"],

    }),
    getStatus: builder.query({
      query: (toUid) => ({
        url: `/friends/status/${toUid}`,
        method: 'get'
      })
    }),
    checkIsFollowing: builder.query({
      query: (toUid) => ({
        url: `/friends/is_following/${toUid}`,
        method: 'get'
      })
    }),
    toggleFollowing: builder.mutation({
      query: (toUid) => ({
        url: `/friends/followingToggle/${toUid}`,
        method: 'get'
      }),
      invalidatesTags: ['friends']
    }),

    addRelation: builder.mutation({
      query: ({ toUid, action }) => ({
        url: `/friends/relation`,
        method: "post",
        body: { target_user_id: toUid, action }
      }),
      invalidatesTags: ["friends"],
    }),
  }),
});

export const {
  useAddRelationMutation,
  useLazyGetStatusQuery,
  useGetMyFriendsQuery,
  useToggleFollowingMutation,
  useLazyCheckIsFollowingQuery,
} = friendApi;
