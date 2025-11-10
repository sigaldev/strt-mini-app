import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import api from "./api";
import AuthService from "./service/AuthService";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export function setupInterceptors(navigate: (path: string) => void) {

    api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const access = localStorage.getItem("access");

        if (access) {
            config.headers.set("Authorization", `Bearer ${access}`);
        }

        return config;
    });

    api.interceptors.response.use(
        (res) => res,
        async (error: AxiosError) => {

            const originalRequest = error.config as RetryAxiosRequestConfig;

            // ---- REFRESH ----
            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                !originalRequest.url?.includes("/api/auth/refresh")
            ) {
                originalRequest._retry = true;

                try {
                    const newAccess = await AuthService.refreshToken();

                    originalRequest.headers.set(
                        "Authorization",
                        `Bearer ${newAccess}`
                    );

                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem("access");
                    navigate("/login");
                    return Promise.reject(refreshError);
                }
            }

            // ---- UNAUTHORIZED ----
            if (
                error.response?.status === 401 &&
                !originalRequest.url?.includes("/api/auth/refresh")
            ) {
                localStorage.removeItem("access");
                navigate("/login");
            }

            return Promise.reject(error);
        }
    );
}
