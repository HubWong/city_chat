import { useGetConsoleDataQuery } from "./adminApi";
import {
  useDelPhotoMutation,
  useUpdateAppMsgMutation,
  useCreateAppMsgMutation,
} from "./adminApi";
import { useReduxAuth } from "../../../hooks/useReduxAuth";

export const useAdminApi = () => {
  const { user, userRole } = useReduxAuth();
  const { data, isLoading, error } = useGetConsoleDataQuery(
    {},
    { skip: userRole && user.role === "admin" }
  );
  const [delPhoto] = useDelPhotoMutation();
  const [updateAppMsg] = useUpdateAppMsgMutation();
  const [createAppMsg] = useCreateAppMsgMutation();

  const leaveMsgToAdmin = async (msg) => {
    try {
      const res = await createAppMsg(msg).unwrap();
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const markMsgRead = async (msgId) => {
    try {
      const res = await updateAppMsg(msgId).unwrap();
      return res.success;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const delUserPhoto = async (id) => {
    try {
      const res = await delPhoto(id).unwrap();
      if (res.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return {
    data,
    isLoading,
    error,
    delUserPhoto,
    markMsgRead,
    leaveMsgToAdmin,
  };
};
