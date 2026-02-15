import { useState } from "react";
import {
  useRequestPasswordResetMutation,
  usePutWinAvatarMutation, useLoginMutation,
  useLostPwdResetMutation, useResetPasswordMutation,
  usePutProfileMutation, usePutDownCvMutation
} from "../services/authApi";
import { useReduxAuth } from "./useReduxAuth";

export const useAuthApi = () => {
  const [requestPassword] = useRequestPasswordResetMutation();
  const [lostPwdReset] = useLostPwdResetMutation()
  const [putProfile] = usePutProfileMutation()
  const [putWinAvatar] = usePutWinAvatarMutation()
  const [resetPassword] = useResetPasswordMutation();
  const [putDownCv] = usePutDownCvMutation()
  const [isLoginLoading, setLoginLoading] = useState(false)
  const [login] = useLoginMutation();
  const { reduxUpdateMe, reduxDownCv, updateCredential } = useReduxAuth()

  const loginUser = async (data) => {
    try {

      const re = await login(data).unwrap();
      if (re.success === false) {
        return re;
      }
      const { token, user, refresh_token } = re.data;
      updateCredential({ token, user, refresh_token })

      return re;
    } catch (error) {
      return { success: false, message: error };
    }
  };

  const requestValidEmail = async (email) => {
    const res = await requestPassword(email);
    return res;
  };

  const changePwd = async (password) => {
    const res = await resetPassword(password).unwrap();
    return res;
  };

  const updateMyCv = async (data) => {
    const res = await putProfile(data).unwrap()
    if (res.success) {
      reduxUpdateMe(res.data)
    }
    return res
  }


  const updateAvatar = async (data) => {
    const res = await putWinAvatar(data).unwrap()
    return res
  }

  const downMyCv = async () => {
    const res = await putDownCv().unwrap()
    reduxDownCv(res)
    return res

  }



  const lostPasswordReset = async (data) => {

    const res = await lostPwdReset(data).unwrap()
    return res
  }

  return {
    //downUserCv, move to useUserApi
    requestValidEmail,
    changePwd,
    updateMyCv,
    updateAvatar,
    downMyCv,
    loginUser,
    isLoginLoading,
    setLoginLoading,
    lostPasswordReset
  };
};
