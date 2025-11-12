import axios from "axios";
import Cookies from "js-cookie";
import AuthService from "./service/AuthService.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Request interceptor — ставим access token в заголовок
api.interceptors.request.use((config) => {
    const token = Cookies.get("STRT_MAX_ACCESS_TOKEN");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — ловим 401, обновляем токен и повторяем запрос
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await AuthService.refreshToken(); // обновляем токен
                const token = Cookies.get("STRT_MAX_ACCESS_TOKEN");
                if (token) {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                }
                return api(originalRequest); // повторяем запрос
            } catch (refreshError) {
                console.error("[API] Refresh token failed:", refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
