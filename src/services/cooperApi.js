// src/services/cooperApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './commonRtk';


export const cooperApi = createApi({
  reducerPath: 'cooperApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Coopers', 'User', 'Notification'], // RTK Query 的缓存标签，用于自动重载
  endpoints: (builder) => ({
    // 获取用户所有项目
    getCoopers: builder.query({
      query: ({ pg = 1, limit = 10 }) => `/coopers/${pg}/${limit}`,
      providesTags: ['Coopers'],
    }),

    getCooper: builder.query({
      query: () => `/coopers/user_cooper`,
      providesTags: (result, error) => [{ type: 'Coopers' }],
    }),

    // 创建新项目
    createCooper: builder.mutation({
      query: (projectData) => ({
        url: '/coopers',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: ['Coopers'],
    }),

    // 更新项目
    updateCooper: builder.mutation({
      query: ({ cooperId, ...cooper_update }) => ({
        url: `/coopers/${cooperId}`,
        method: 'PUT',
        body: cooper_update,
      }),
      invalidatesTags: (result, error, { cooperId }) => [
        { type: 'Coopers', id: cooperId },
        'Coopers',
      ],
    }),
    
    cooperValidated: builder.mutation({
      query: ({ id, valid }) => ({
        url: `/coopers/validate/${id}/${valid}`,
        method: 'PATCH'
      }),

      invalidatesTags: ['Coopers'] // ← 必须和 getCoopers 的 providesTags 一致
    }),


    // 删除项目
    deleteProject: builder.mutation({
      query: (cooperId) => ({
        url: `/coopers/${cooperId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coopers'],
    }),

    // 获取协作者列表（项目成员）
    getProjectMembers: builder.query({
      query: (cooperId) => `/coopers/${cooperId}/members`,
      providesTags: (result, error, cooperId) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'User', id })),
            { type: 'User', id: 'MEMBERS' },
          ]
          : [{ type: 'User', id: 'MEMBERS' }],
    }),

    getMyMembers: builder.query({
      query: () => '/coopers/cooper_users',
      providesTags: ['Cooper'], // 根据实际需求调整
    }),
    // 添加协作者
    addMember: builder.mutation({
      query: ({ cooperId, userId, role }) => ({
        url: `/coopers/${cooperId}/members`,
        method: 'POST',
        body: { userId, role },
      }),
      invalidatesTags: (result, error, { cooperId }) => [
        { type: 'User', id: 'MEMBERS' },
        { type: 'Coopers', id: cooperId },
      ],
    }),

    // 获取未读通知
    getUnreadNotifications: builder.query({
      query: () => '/notifications?status=unread',
      providesTags: ['Notification'],
    }),

    // 标记通知为已读
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),

    // 批量标记为已读
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

// 自动导出 hooks（由 RTK Query 自动生成）
export const {
  useCooperValidatedMutation,
  useGetCoopersQuery,
  useGetCooperQuery,
  useCreateCooperMutation,
  useGetMyMembersQuery, // my members
  useUpdateCooperMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
  useAddMemberMutation,
  useGetUnreadNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = cooperApi;