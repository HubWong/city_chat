import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../../services/commonRtk";

//file and users
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Users",'Photos'],
  endpoints: (builder) => ({
    getSumCountryUser: builder.query({
      query: () => "users/sum_country_user",
      keepUnusedDataFor: 30,
    }),
    getBaseUser: builder.query({
      query: ({ userId }) => {
        return {
          url: `users/base_user/${userId}`,
        }
      },
      providesTags: ["User"],
    }),

   
    
    searchUsers: builder.query({
      query: ({ keyword, minAge, maxAge, page,area='', gender = -1, limit = 15 }) =>
        `/users/search?q=${encodeURIComponent(keyword || '')}&area=${area}&gender=${gender}&minAge=${minAge}&maxAge=${maxAge}&page=${page}&limit=${limit}`,
      providesTags: ["Users"],
    }),

    downUserCv:builder.mutation({
      query:(user_id)=>{
        return {
          url:`/auth/downMycv/${user_id}`,
          method:'put'
        }
      },
     
    })
  }),
});

export const {
  useGetSumCountryUserQuery,
  useGetUserQuery,
  useLazyGetBaseUserQuery,
  useDownUserCvMutation,
  useLazySearchUsersQuery,
 
 

} = userApi;
