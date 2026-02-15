
import { authApi } from "./authApi";

export const fileApi = authApi.injectEndpoints({
    endpoints: builder => ({
        downloadFile: builder.query({
            async queryFn(id, _queryApi, _extraOptions, baseQuery) {
                const result = await baseQuery({
                    url: `/files/download/${id}`,
                    method: "GET",
                    responseHandler: async (response) => {
                        const blob = await response.blob();
                        const disposition = response.headers.get("Content-Disposition");
                        let filename = "download";

                        if (disposition && disposition.includes("filename=")) {
                            filename = disposition.split("filename=")[1].replace(/['"]/g, "");
                        }
                        console.log('file is:', filename)
                        return { blob, filename };
                    },
                });

                if (result.error) return { error: result.error };
                return { data: result.data };

            },

        })
    })
})


export const {
    useDownloadFileQuery,
    useLazyDownloadFileQuery
} = fileApi