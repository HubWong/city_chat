import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/commonRtk";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["svcs", "photos", 'appMsgs'],
  endpoints: (builder) => ({
    getConsoleData: builder.query({
      query: () => ({
        url: "admin/dashboard",
        method: "GET",
      }),
    }),

    createOrUpdateServices: builder.mutation({
      query: (data) => ({
        url: "admin/service-plans",
        method: "POST",
        body: data,
      }),
    }),

    getServices: builder.query({
      query: () => ({
        url: "admin/service-plans",
        method: "GET",
      }),
    }),

    getPaymentList: builder.query({
      query: (pg) => ({
        url: `admin/payments/${pg}`,
        method: "GET",
      }),
    }),
    getUserList: builder.query({
      query: (pg) => ({
        url: `admin/users/${pg}`,
        method: "get",
      }),
    }),
    getPhotoList: builder.query({
      query: (pg) => ({
        url: `admin/photos/${pg}`,
        method: "get",
      }),
      providesTags: ["photos"],
    }),

    delPhoto: builder.mutation({
      query: (id) => ({
        url: `admin/photos/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["photos"],
    }),

    getAppMsgs: builder.query({
      query: (pg) => ({
        url: `admin/user_messages/${pg}`,
        method: 'get'
      })
    }),
    updateAppMsg: builder.mutation({
      query: (id) => ({
        url: `admin/user_messages/${id}`,
        method: 'put'
      }),
      invalidatesTags: ['appMsgs']
    }),
    createAppMsg: builder.mutation({
      query: (data) => ({
        url: `admin/user_message`,
        method: 'post',
        body: data
      }),
      invalidatesTags: ['appMsgs']
    })
  }),
});

export const {
  useGetConsoleDataQuery,
  useCreateOrUpdateServicesMutation,
  useGetUserListQuery,
  useGetPaymentListQuery,
  useGetPhotoListQuery,
  useDelPhotoMutation,
  useGetAppMsgsQuery,
  useUpdateAppMsgMutation,
  useCreateAppMsgMutation
} = adminApi;
