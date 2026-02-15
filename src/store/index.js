import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import homeSlice from './slices/homeSlice'
import authSlice from './slices/authSlice';
import chatSlice from './slices/chatSlice';
 
import paymentSlice from './slices/paymentSlice';
import { authApi } from '../services/authApi';
import { userApi } from '@/pages/ViewUser/hook/userApi';
import { paymentApi } from '../services/paymentApi';
import { adminApi } from '../pages/admin/hook/adminApi';
import { msgApi } from '../services/msgApi';
import { friendApi } from '../services/friendApi'
import { resumeApi } from '../services/resumeApi';
import { cooperApi } from '../services/cooperApi';
import { accountApi } from '../services/accountApi';
import { roomApi } from '../services/roomApi';

const store = configureStore({
  reducer: {
    home: homeSlice,
    auth: authSlice,
    chat: chatSlice,     
    payment: paymentSlice,
    [roomApi.reducerPath]:roomApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [msgApi.reducerPath]: msgApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [friendApi.reducerPath]: friendApi.reducer,
    [resumeApi.reducerPath]: resumeApi.reducer,
    [cooperApi.reducerPath]: cooperApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      paymentApi.middleware,
      userApi.middleware,
      adminApi.middleware,
      msgApi.middleware,
      friendApi.middleware,
      resumeApi.middleware,
      cooperApi.middleware,
      accountApi.middleware,
      roomApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;