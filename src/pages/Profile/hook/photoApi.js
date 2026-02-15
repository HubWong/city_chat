import { userApi } from "../../ViewUser/hook/userApi";


export const photoApi = userApi.injectEndpoints({
    endpoints: builder => ({
        upload: builder.mutation({
            query: (data) => {
                return {
                    url: "files/upload",
                    method: "post",
                    body: data,
                };
            },
            invalidatesTags: ["Photos"],
        }),
        
        getUserPhotos: builder.query({
            query: () => `files/get_photos`,
            providesTags: ["Photos"],
        }),

        deletePhoto: builder.mutation({
            query: (file_id) => {
                return {
                    url: `files/del_photo/${file_id}`,
                    method: "delete",
                };
            },
            invalidatesTags: ["Photos"],
        }),

        isPrivatePhoto: builder.mutation({
            query: ({ id, is_prv }) => ({
                url: `/is_private/${id}`,
                method: 'patch'
            }),
            invalidatesTags: ["Photos"]
        }),


    })
})


export const {
    useUploadMutation,
    useGetUserPhotosQuery,
    useDeletePhotoMutation,
    useIsPrivatePhotoMutation
} = photoApi