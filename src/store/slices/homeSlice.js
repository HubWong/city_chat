
import { createSlice } from "@reduxjs/toolkit";

const initialState = {     
    cv_created_at: null,
    hasUser: false
};


const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setPCStatus: (state, { payload }) => {
            const {   user, cv_created_at } = payload
            state.hasUser = user
            state.cv_created_at = cv_created_at? new Date(cv_created_at).toDateString("zh-CN", { timeZone: "Asia/Shanghai" }):null
        },
        setCV: (state, { payload }) => {
            state.hasCV = payload
        },
        setCVCreate: (state, { payload }) => {
            console.log('created at', payload)
            state.cv_created_at = new Date(payload).toDateString("zh-CN", { timeZone: "Asia/Shanghai" })
        },
        setHasUser: (state, { payload }) => {
            state.hasUser = payload
        }
    },

});

export const {
    setPCStatus,    
    setHasUser,
    setCVCreate,
} = homeSlice.actions;

export default homeSlice.reducer;

 
export const selectPCUsers = (state) => state.home.hasUser;
export const selectCVcreated = (state) => state.home.cv_created_at


