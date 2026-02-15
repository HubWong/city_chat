import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
  selectUserRole,
  selectIsNotAuthenticated,
  selectPcId,
  setCredentials,
  updateProfile,
  downCv,
  logout,
  setPcId,
  selectTmperUserVisible,
  setTempProfileVisible,
  selectUserViewHistory,
  selectVideoChatOk,
  updateUserViewHistory,
  updateMySocketId,
  selectLoginVisible,
  toggleLoginModel,
  ifLoading,
  selectIfLoading,

} from "../store/slices/authSlice";
import { useHostLogoutMutation } from "../services/authApi";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import SocketClient from "@/shared/model/socketModel";
import ChatBridge from "@/shared/model/chatBridge";

export const useReduxAuth = () => {
  const dispatch = useDispatch();
  const isLogout = useSelector(selectIsNotAuthenticated);
  const loginVisible = useSelector(selectLoginVisible)
  const isLoading = useSelector(selectIfLoading)
  const profileShow = useSelector(selectTmperUserVisible);
  const userViewHistory = useSelector(selectUserViewHistory);
  const videoChatOk = useSelector(selectVideoChatOk);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);
  const pcId = useSelector(selectPcId);
  const [hostLogout] = useHostLogoutMutation();

  const isTokenExp = () => {
    if (!token) {
      return true
    }
    const decoded = jwtDecode(token)
    const expTime = dayjs.unix(decoded.exp);
    const now = dayjs();
    const isExpired = now.isAfter(expTime);
    return isExpired

  }

  const toggleLoginForm = () => {
    dispatch(toggleLoginModel(!loginVisible))
  }

  const hideLoginModal = () => {
    dispatch(toggleLoginModel(false))
  }


  const toggleTmperProfile = () => {
    dispatch(setTempProfileVisible(!profileShow));
  };
  const showLoading = (loaing = true) => {
    dispatch(ifLoading(loaing))
  }
  const reduxUpdateMe = (data) => {
    dispatch(updateProfile({ ...data }));
    // else {
    //   try {
    //     SocketClient.setUserData(
    //       { user: data, ipInfo: { country_name:data.country_name, country: data.ip_country, city: data.ip_city, }
    //      })

    //     const tmpMe = SocketClient.userData

    //     dispatch(updateProfile({ ...tmpMe }));
    //   } catch (error) {
    //     console.log(error)
    //   }

    // }
  }

  const reduxDownCv = (isOn = true) => {
    dispatch(downCv(!isOn))
  }
  const updateToken = (data) => {
    dispatch(setCredentials(data)); //clear token and user infos
  };
  const updateCredential = (data) => {
    dispatch(setCredentials(data));
  };

  const logoutUser = async () => {
    await hostLogout();
    dispatch(logout());
  };

  const updatePcId = (data) => {
    dispatch(setPcId(data));
  };
  const updateMySid = (data) => {
    dispatch(updateMySocketId(data));
  };
  const updateUserViews = (id) => {
    dispatch(updateUserViewHistory(id));
  };



  return {
    showLoading,
    isLoading,
    isTokenExp,
    reduxUpdateMe,
    reduxDownCv,
    updateToken,
    updateCredential,
    logoutUser,
    updatePcId,
    token,
    user,
    userRole,
    pcId,
    isLogout,
    toggleLoginForm,
    hideLoginModal,
    toggleTmperProfile,
    loginVisible,
    profileShow,
    userViewHistory,
    updateUserViews,
    updateMySid,
    videoChatOk,
  };
};
