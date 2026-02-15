import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './commonRtk';
/*
user account api
*/
export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['MyAccount'],
    endpoints: (builder) => ({ 
        addOrUpdate: builder.mutation({
            query: (data) => ({
                url: '/account',
                method: 'put',
                body: data
            }),
            invalidatesTags: ['MyAccount'],
        }),
        getAccount:builder.query({
            query:()=>({
                 url:`/account`,
                 method:'GET'
            }),
            providesTags:['MyAccount']
        })
    })
})


export const { useAddOrUpdateMutation,useGetAccountQuery } = accountApi