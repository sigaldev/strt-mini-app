import api from "../api";
import Cookies from "js-cookie";
import type { AxiosError, AxiosResponse } from "axios";

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface UserProfile {
    id: number;
    phone_number: string;
    first_name: string;
    last_name: string;
    university_id: number;
    group_id?: number;
    group_number?: string;
    avatar?: string;
}

interface SignInResponse {
    token: string;
    refresh_token: string;
}

interface SignUpStep1Response {
    status: "validated" | "not_validated";
}

interface SignUpStep3Response {
    token?: string;
    refresh_token?: string;
    user?: UserProfile;
}

interface RefreshTokenResponse {
    access: string;
}

const authLogger = {
    info: (message: string, data?: unknown) =>
        console.log(`[AUTH-SERVICE] [INFO] ${new Date().toISOString()}: ${message}`, data || ''),
    error: (message: string, error?: unknown) =>
        console.error(`[AUTH-SERVICE] [ERROR] ${new Date().toISOString()}: ${message}`, error || ''),
    warn: (message: string, data?: unknown) =>
        console.warn(`[AUTH-SERVICE] [WARN] ${new Date().toISOString()}: ${message}`, data || ''),
    debug: (message: string, data?: unknown) =>
        console.debug(`[AUTH-SERVICE] [DEBUG] ${new Date().toISOString()}: ${message}`, data || '')
};

class AuthService {
    async login(phone: string, password: string): Promise<LoginResponse> {
        authLogger.info("Login attempt", { phone });

        try {
            const response: AxiosResponse<SignInResponse> = await api.post("/api/v1/sign_in/", { phone_number: phone, password });
            const { token, refresh_token } = response.data;

            Cookies.set("STRT_MAX_ACCESS_TOKEN", token);
            Cookies.set("STRT_MAX_REFRESH_TOKEN", refresh_token);

            authLogger.info("Login successful", {
                phone,
                hasAccessToken: !!token,
                hasRefreshToken: !!refresh_token
            });

            return { access: token, refresh: refresh_token };
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            authLogger.error("Login failed", axiosError.response?.data || axiosError.message);
            throw error;
        }
    }

    async registerProfile(
        phone_number: string,
        password: string,
        first_name: string,
        last_name: string,
        group_number: string,
        avatar?: File
    ): Promise<UserProfile | undefined> {
        authLogger.info("Starting registration process", {
            phone_number,
            first_name,
            last_name,
            group_number,
            has_avatar: !!avatar
        });

        try {
            const step1Response: AxiosResponse<SignUpStep1Response> = await api.post(
                "/api/v1/sign_up/step1/",
                { phone_number }
            );

            if (step1Response.data.status !== "validated") {
                authLogger.warn("Phone validation failed", step1Response.data);
                return undefined;
            }

            const formData = new FormData();
            formData.append("phone_number", phone_number);
            formData.append("phone", phone_number);
            formData.append("password", password);
            formData.append("first_name", first_name.replace(/[^A-Za-zА-Яа-яЁё]/g, ""));
            formData.append("last_name", last_name.replace(/[^A-Za-zА-Яа-яЁё]/g, ""));
            formData.append("group_number", group_number);
            formData.append("group_id", "");
            formData.append("university_id", "1");
            if (avatar) formData.append("avatar", avatar);

            const step3Response: AxiosResponse<SignUpStep3Response> = await api.post(
                "/api/v1/sign_up/step3/",
                formData
            );

            if (step3Response.data.token && step3Response.data.refresh_token) {
                Cookies.set("STRT_MAX_ACCESS_TOKEN", step3Response.data.token);
                Cookies.set("STRT_MAX_REFRESH_TOKEN", step3Response.data.refresh_token);

                authLogger.info("Tokens stored in cookie", {
                    token: step3Response.data.token.slice(0, 10) + "...",
                    refresh_token: step3Response.data.refresh_token.slice(0, 10) + "..."
                });
            } else {
                authLogger.warn("Step 3 response did not include tokens", step3Response.data);
            }

            authLogger.info("Registration completed successfully", step3Response.data);

            // Возвращаем только UserProfile или undefined
            return step3Response.data.user;
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            authLogger.error("Registration process failed", axiosError.response?.data || axiosError.message);
            throw error;
        }
    }


    async refreshToken(): Promise<string> {
        authLogger.debug("Refreshing token");
        const refresh = Cookies.get("STRT_MAX_REFRESH_TOKEN");

        if (!refresh) {
            authLogger.error("No refresh token available");
            throw new Error("No refresh token available");
        }

        try {
            const response: AxiosResponse<RefreshTokenResponse> = await api.post("/api/v1/sign_in/refresh/", { refresh });
            const { access } = response.data;

            Cookies.set("STRT_MAX_ACCESS_TOKEN", access);
            authLogger.info("Token refreshed successfully");

            return access;
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            authLogger.error("Token refresh failed", axiosError.response?.data || axiosError.message);
            throw error;
        }
    }

    logout(): void {
        authLogger.info("User logout");
        Cookies.remove("STRT_MAX_ACCESS_TOKEN");
        Cookies.remove("STRT_MAX_REFRESH_TOKEN");
    }
}

export default new AuthService();
