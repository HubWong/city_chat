import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./commonRtk";

export const msgApi = createApi({
  reducerPath: "msgApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Message", "P2PMessage",'ChatHist'], // 定义标签类型，用于缓存和无效化 data
  endpoints: (builder) => ({
    getP2pMsgs: builder.query({
      query: ({toUid}) => ({
        url: `/messages/p2pMsgs/${toUid}`,
        method: "get",
      }),
      keepUnusedDataFor:10,
      providesTags:['P2PMessage']
    }),
    getMsgList: builder.query({
      query: ({page,pgSize}) => ({
        url: `/messages/list/${page}/${pgSize}`,
        method: "get",
      }),
      keepUnusedDataFor:10,
      providesTags:['Message']
    }),
    getMsgHist:builder.query({
      query:(u1)=> `/messages/chat_hist/${u1}`,
      keepUnusedDataFor:10,
      providesTags:['ChatHist']

    }),
    ignoreMsg: builder.mutation({
      query: (messageId) => ({
        url: `/messages/${messageId}/read`,
        method: "PUT",
      }),
      invalidatesTags:['Message']
    }),
    sendMsg: builder.mutation({
      query: (data) => ({
        url: "/messages/sendMsg",
        method: "post",
        body: data,
      }),
    }),
   
  
  }),
});

export const {
  useGetMsgListQuery,
  useIgnoreMsgMutation,
  useSendMsgMutation,
  useGetP2pMsgsQuery,
  useGetMsgHistQuery
} = msgApi;
