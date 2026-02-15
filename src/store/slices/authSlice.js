import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEY } from "@/shared/config";
import { getLocalItem, removeLocalItem, setLocalItem } from "../../services/toolFuncs";

const uinfo = getLocalItem(STORAGE_KEY.USER_INFO);

const initialState = {
  token: getLocalItem(STORAGE_KEY.TOKEN),
  isLoading: false,
  refreshToken: getLocalItem(STORAGE_KEY.REFRESH_TOKEN),
  user: uinfo ? JSON.parse(uinfo) : null,
  pcId: getLocalItem(STORAGE_KEY.PC_ID) || crypto.randomUUID(),
  temperProfileVisible: false,
  loginVisible: false,
  userViewHistory: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserViewHistory: (state, { payload }) => {
      state.userViewHistory.push({ id: Date.now(), to_user_id: payload });
    },
    toggleLoginModel: (state, { payload }) => {
      state.loginVisible = payload
    },

    ifLoading: (state, { payload }) => {
      state.isLoading = payload
    },
    setTempProfileVisible: (state, { payload }) => {
      state.temperProfileVisible = payload;
    },


    setCredentials: (state, { payload: { token, user, refresh_token } }) => {
      state.token = token;
      state.refreshToken = refresh_token;
      state.user = user;

      setLocalItem(STORAGE_KEY.TOKEN, token);
      setLocalItem(STORAGE_KEY.USER_INFO, JSON.stringify(user || {}));
      setLocalItem(STORAGE_KEY.REFRESH_TOKEN, refresh_token);
    },
    setTokens: (state, { payload }) => {
      const { token, refresh_token } = payload;
      state.token = token;
      state.refreshToken = refresh_token;
      setLocalItem(STORAGE_KEY.TOKEN, token);
      setLocalItem(STORAGE_KEY.REFRESH_TOKEN, refresh_token);
    },
    updateProfile: (state, { payload }) => {
      state.user = { ...payload };
      console.log('update user profile is:', payload)
      setLocalItem(STORAGE_KEY.USER_INFO, JSON.stringify(payload));
    },
    updateMySocketId: (state, { payload }) => {
      if (!payload || !state.user) return;
      state.user.sid = payload;
      setLocalItem(STORAGE_KEY.USER_INFO, JSON.stringify(state.user));
    },
    setPcId: (state, { payload }) => {
      state.pcId = payload;
      setLocalItem(STORAGE_KEY.PC_ID, payload);
    },
    logout: (state) => {

      state.token = null;
      state.user = null;
      state.pcId = crypto.randomUUID();
      state.refreshToken = null
      removeLocalItem(STORAGE_KEY.TOKEN);
      removeLocalItem(STORAGE_KEY.USER_INFO);
      removeLocalItem(STORAGE_KEY.REFRESH_TOKEN);
      removeLocalItem(STORAGE_KEY.PC_ID);
    },
    downCv: (state, { payload }) => {
      if (state.user) {
        state.user.onShow = payload;
        setLocalItem(STORAGE_KEY.USER_INFO, JSON.stringify(state.user));
      }
    }
  },
});

export const {
  setCredentials,
  setTokens,
  toggleLoginModel,
  updateProfile,
  downCv,
  ifLoading,
  setPcId,
  logout,
  setTempProfileVisible,
  updateUserViewHistory,
  updateMySocketId,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIfLoading = state => state.auth.isLoading
export const selectPcId = (state) => state.auth.pcId;
export const selectIsNotAuthenticated = (state) => !state.auth.token;
export const selectTmperUserVisible = (state) =>
  state.auth.temperProfileVisible;
export const selectLoginVisible = (state) =>
  state.auth.loginVisible;

export const selectUserViewHistory = (state) => state.auth.userViewHistory;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectVideoChatOk = (st) => st.auth.user?.role == "user";
