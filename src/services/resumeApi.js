import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./commonRtk";

export const resumeApi = createApi({
    reducerPath: "resumeApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["userProfiles"],
    endpoints: (builder) => ({
        getCv: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: "userProfiles", id }],
        })

    }),
});

export const {
    useGetCvQuery
} = resumeApi;
