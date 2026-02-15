import {
  useUploadMutation,
  useDeletePhotoMutation,
} from "./photoApi";

export const useFileApi = () => {
  const [upload, { isLoading: uploadLoading }] = useUploadMutation();
  const [deletePhoto, { isLoading: deleteLoading }] = useDeletePhotoMutation();



  const del_photo = async (id) => {
    try {
      const res = await deletePhoto(id).unwrap()
      return res

    } catch (error) {
      console.error(error)
    }
  }

  return {
    upload,
    uploadLoading,
    del_photo,
    deleteLoading
  };
};
