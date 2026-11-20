
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const api = axios.create({
//   baseURL: "http://192.168.100.18:2005/api",
//   timeout: 10000,
// });

// // Automatically attach JWT token to every API request
// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;





import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

const BASE_URL = "http://192.168.100.18:2005/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Prevent multiple refresh requests at the same time
let refreshPromise = null;

// Add access token to every API request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token when access token expires
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/google") ||
      originalRequest.url?.includes("/auth/admin-login")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = await AsyncStorage.getItem("refreshToken");

          if (!refreshToken) {
            throw new Error("Refresh token not found");
          }

          // Use axios directly to avoid the API interceptor
          const response = await axios.post(
            `${BASE_URL}/auth/refresh-token`,
            { refreshToken },
            { timeout: 15000 }
          );

          await AsyncStorage.multiSet([
            ["token", response.data.token],
            ["refreshToken", response.data.refreshToken],
          ]);

          return response.data.token;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      await AsyncStorage.multiRemove([
        "token",
        "refreshToken",
        "user",
      ]);

      DeviceEventEmitter.emit("AUTH_SESSION_EXPIRED");

      return Promise.reject(refreshError);
    }
  }
);

export default api;
