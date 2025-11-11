import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import api from "./api";
import AuthService from "./service/AuthService";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export function setupInterceptors(navigate: (path: string) => void) {
    // --- Request interceptor ---
    api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        // Токен в cookie берём прямо в каждом запросе
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("STRT_MAX_ACCESS_TOKEN="))
            ?.split("=")[1];

        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    });

    // --- Response interceptor ---
    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as RetryAxiosRequestConfig;

            // ---- REFRESH ----
            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                !originalRequest.url?.includes("/api/v1/sign_in/refresh/")
            ) {
                originalRequest._retry = true;

                try {
                    const newAccess = await AuthService.refreshToken();
                    if (originalRequest.headers) {
                        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
                    }
                    return api(originalRequest);
                } catch (refreshError) {
                    AuthService.logout();
                    navigate("/login");
                    return Promise.reject(refreshError);
                }
            }

            // ---- UNAUTHORIZED ----
            if (
                error.response?.status === 401 &&
                !originalRequest.url?.includes("/api/v1/sign_in/refresh/")
            ) {
                AuthService.logout();
                navigate("/login");
            }

            return Promise.reject(error);
        }
    );
}
