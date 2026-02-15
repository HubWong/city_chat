import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null, //当前聊天对象 
};


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
    },

  }
});

export const {
  setCurrentUser

} = chatSlice.actions;

export default chatSlice.reducer;

export const selectCurUser = (state) => state.chat.currentUser;


