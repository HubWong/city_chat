import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setTokens } from "../store/slices/authSlice";
import { host } from "@/shared/config/index";
import { message } from "antd";

// 全局状态标志和队列
let isRefreshing = false; // 是否正在刷新
let failedQueue = []; // 存储待重新发送的请求

const baseQuery = fetchBaseQuery({
  baseUrl: host,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// 处理队列：成功或失败时依次处理请求
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      debugger
      console.log('logout user...')
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // 如果返回 401 未授权错误，尝试刷新令牌
  if (result.error && result.error.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const { refreshToken } = api.getState().auth;

        if (!refreshToken) {
          processQueue(new Error("Refresh token expired"));
          api.dispatch(logout());
          return result;
        }

        // 调用刷新令牌接口
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "post",
            body: refreshToken,
          },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          // 更新 Redux 状态中的令牌
          const { success, data, message: msgError } = refreshResult.data;
          if (!success) {
            //throw new Error(data)
            message.error(msgError)
            api.dispatch(logout());
            return;
          }
          api.dispatch(setTokens(data));

          // 通知队列中的请求使用新的令牌
          processQueue(null, refreshResult.data.access_token);

          result = await baseQuery(args, api, extraOptions);
          return result
        } else {

          // 刷新失败，登出用户
          processQueue(new Error("Refresh token expired"));
          api.dispatch(logout());
        }
      } catch (error) {
        // 处理刷新错误
        processQueue(error);
        api.dispatch(logout());

      } finally {
        isRefreshing = false;
      }
    } else {
      // 如果正在刷新，将当前请求添加到队列中
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          // 使用新的令牌重新发送请求
          return baseQuery(
            {
              ...args,
              headers: {
                ...args.headers,
                Authorization: `Bearer ${token}`,
              },
            },
            api,
            extraOptions
          );
        })
        .catch((error) => {
          return { error };
        });
    }
  }

  return result;
};
