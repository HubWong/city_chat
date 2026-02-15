import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./commonRtk";


export const roomApi = createApi({
    reducerPath: "roomApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["UserRooms", "RoomList", "MyRooms"],
    endpoints: (builder) => ({
        // ✅ 获取我的房间列表
        getMyRooms: builder.query({
            query: (pg) => `/room/my_rooms/${pg}`,
            providesTags: ['MyRooms']
        }),

        // ✅ 获取单个房间详情
        getJoinRoom: builder.query({
            query: ({ id,fromSid }) => `/room/join/${id}/${fromSid}`,
            providesTags: (result, error, id) => [
                { type: 'UserRooms', id },
                { type: 'MyRooms', id }
            ]
        }),
        getRoom: builder.query({
            query: ({ id }) => `/room/${id}`,
            providesTags: (result, error, id) => [
                { type: 'UserRooms', id },
                { type: 'MyRooms', id }
            ]
        }),
        // ✅ 搜索房间
        searchRooms: builder.query({
            query: ({ query, city, isPublic = true, page = 1, limit = 15 }) => ({
                url: `/room/search`,
                method: 'post',
                body: {
                    query,
                    city,
                    is_pub: isPublic, // 转换为后端要求的 snake_case
                    page,
                    limit
                }
            }),
            providesTags: (result, error, arg) => {
                const rooms = result?.data || []
                return [
                    ...rooms.map(room => ({ type: 'UserRooms', id: room.id })),
                    { type: 'UserRooms', id: 'LIST' }
                ]
            }
        }),

        // ✅ 创建房间（修正：使用 invalidatesTags）
        createRoom: builder.mutation({
            query: (data) => ({
                url: `/room`,
                method: 'post',
                body: data
            }),
            invalidatesTags: ['MyRooms', 'RoomList', { type: 'UserRooms', id: 'LIST' }]
        }),

        // ✅ 删除房间
        delRoom: builder.mutation({
            query: (id) => ({
                url: `/room/${id}`,
                method: 'delete'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'UserRooms', id },
                { type: 'MyRooms', id },
                'MyRooms',
                'RoomList',
                { type: 'UserRooms', id: 'LIST' }
            ]
        }),

        // ✅ 编辑房间（修正：tag 名称改为 MyRooms）
        editRoom: builder.mutation({
            query: ({ id, data }) => ({
                url: `/room/${id}`,
                method: 'put',
                body: data
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'UserRooms', id },
                { type: 'MyRooms', id },
                'MyRooms'
            ]
        })
    }),
});

export const {
    useGetMyRoomsQuery,
    useGetJoinRoomQuery,
    useGetRoomQuery,
    useCreateRoomMutation,
    useEditRoomMutation,  // ✅ 修正拼写错误
    useDelRoomMutation,    // ✅ 新增    
    useLazySearchRoomsQuery,
    useSearchRoomsQuery    // ✅ 新增
} = roomApi;
