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

interface BackendErrorItem {
    error?: string | string[];
}

interface BackendErrorResponse {
    errors?: BackendErrorItem[];
    error?: string | string[];
    [key: string]: unknown;
}

const tokenCookieOptions = {
    path: "/",
    sameSite: "lax" as const,
    secure: import.meta.env.PROD,
};

const isBackendErrorResponse = (value: unknown): value is BackendErrorResponse =>
    typeof value === "object" && value !== null;

const getAxiosLogMeta = (error: AxiosError) => ({
    status: error.response?.status,
    message: error.message,
});

const authLogger = {
    info: (message: string, data?: unknown) => {
        if (import.meta.env.DEV) console.log(`[AUTH-SERVICE] [INFO] ${new Date().toISOString()}: ${message}`, data || '');
    },
    error: (message: string, error?: unknown) => {
        if (import.meta.env.DEV) console.error(`[AUTH-SERVICE] [ERROR] ${new Date().toISOString()}: ${message}`, error || '');
    },
    warn: (message: string, data?: unknown) => {
        if (import.meta.env.DEV) console.warn(`[AUTH-SERVICE] [WARN] ${new Date().toISOString()}: ${message}`, data || '');
    },
    debug: (message: string, data?: unknown) => {
        if (import.meta.env.DEV) console.debug(`[AUTH-SERVICE] [DEBUG] ${new Date().toISOString()}: ${message}`, data || '');
    }
};

class AuthService {
    async login(phone: string, password: string): Promise<LoginResponse> {
        authLogger.info("Login attempt");

        try {
            const response: AxiosResponse<SignInResponse> = await api.post("/api/v1/sign_in/", { phone_number: phone, password });
            const { token, refresh_token } = response.data;

            Cookies.set("STRT_MAX_ACCESS_TOKEN", token, tokenCookieOptions);
            Cookies.set("STRT_MAX_REFRESH_TOKEN", refresh_token, tokenCookieOptions);

            authLogger.info("Login successful", {
                hasAccessToken: !!token,
                hasRefreshToken: !!refresh_token
            });

            return { access: token, refresh: refresh_token };
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            authLogger.error("Login failed", getAxiosLogMeta(axiosError));
            throw error;
        }
    }

    async registerProfile(
        phone_number: string,
        password: string,
        first_name: string,
        last_name: string,
        group_number: string,
        university_id: string,
        group_id: string,
        avatar?: File
    ): Promise<UserProfile | undefined> {
        authLogger.info("Starting registration process", {
            has_avatar: !!avatar,
            avatar_size: avatar?.size,
            avatar_type: avatar?.type
        });

        try {
            // Step 1: валидация телефона
            const step1Response: AxiosResponse<SignUpStep1Response> = await api.post(
                "/api/v1/sign_up/step1/",
                { phone_number }
            );

            authLogger.debug("Step1 response", { status: step1Response.data.status });

            if (step1Response.data.status !== "validated") {
                authLogger.warn("Phone validation failed");
                return undefined;
            }

            // Step 3: регистрация с аватаром
            const formData = new FormData();
            formData.append("phone_number", phone_number);
            formData.append("phone", phone_number);
            formData.append("password", password);
            formData.append("first_name", first_name.replace(/[^A-Za-zА-Яа-яЁё]/g, ""));
            formData.append("last_name", last_name.replace(/[^A-Za-zА-Яа-яЁё]/g, ""));
            formData.append("university_id", String(university_id));

            if (group_id && group_id !== "null" && group_id !== "") {
                formData.append("group_id", group_id);
                authLogger.info("Using group_id", { group_id });
            } else if (group_number && group_number.trim() !== "") {
                formData.append("group_number", group_number.trim());
                authLogger.info("Using custom group_number");
            } else {
                authLogger.warn("No group provided");
            }


            if (avatar) {
                authLogger.info("Appending avatar to FormData", {
                    size: avatar.size,
                    type: avatar.type
                });
                formData.append("avatar", avatar);
            } else {
                authLogger.warn("No avatar provided");
            }

            const step3Response: AxiosResponse<SignUpStep3Response> = await api.post(
                "/api/v1/sign_up/step3/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            authLogger.info("Step3 response received", {
                hasUser: !!step3Response.data.user,
                hasTokens: !!step3Response.data.token && !!step3Response.data.refresh_token,
                hasAvatar: !!step3Response.data.user?.avatar,
            });

            if (step3Response.data.token && step3Response.data.refresh_token) {
                Cookies.set("STRT_MAX_ACCESS_TOKEN", step3Response.data.token, tokenCookieOptions);
                Cookies.set("STRT_MAX_REFRESH_TOKEN", step3Response.data.refresh_token, tokenCookieOptions);
                authLogger.info("Tokens stored in cookies");
            }

            if (!step3Response.data.user) {
                authLogger.warn("Step3 response has no user object");
            } else if (!step3Response.data.user.avatar) {
                authLogger.warn("User avatar is null in response");
            } else {
                authLogger.info("User avatar received");
            }

            return step3Response.data.user;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<unknown>;
            const backend = axiosError.response?.data;

            authLogger.error("Registration process failed", getAxiosLogMeta(axiosError));

            let messages: string[] = [];
            const backendData = isBackendErrorResponse(backend) ? backend : undefined;

            // ==============================
            //  1) errors: [{ error: ["..."] }]
            // ==============================
            if (backendData?.errors && Array.isArray(backendData.errors)) {
                messages = backendData.errors.flatMap((item) => {
                    if (Array.isArray(item.error)) return item.error;
                    if (typeof item.error === "string") return [item.error];
                    return [];
                });
            }

            // ==============================
            // 2) error: ["..."]
            // ==============================
            if (messages.length === 0 && Array.isArray(backendData?.error)) {
                messages = backendData.error;
            }

            // ==============================
            // 3) error: "..."
            // ==============================
            if (messages.length === 0 && typeof backendData?.error === "string") {
                messages = [backendData.error];
            }

            // ==============================
            // 4) ловим все строки внутри backend (универсальный fallback)
            // ==============================
            if (messages.length === 0 && backendData) {
                const collected = Object.values(backendData)
                    .flat()
                    .filter((x): x is string => typeof x === "string");

                if (collected.length > 0) {
                    messages = collected;
                }
            }

            // ==============================
            // 5) Если ничего не нашли — дефолт
            // ==============================
            if (messages.length === 0) {
                messages = ["Произошла ошибка"];
            }

            throw new Error(messages.join(", "));
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

            Cookies.set("STRT_MAX_ACCESS_TOKEN", access, tokenCookieOptions);
            authLogger.info("Token refreshed successfully");

            return access;
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            authLogger.error("Token refresh failed", getAxiosLogMeta(axiosError));
            throw error;
        }
    }

    logout(): void {
        authLogger.info("User logout");
        Cookies.remove("STRT_MAX_ACCESS_TOKEN", tokenCookieOptions);
        Cookies.remove("STRT_MAX_REFRESH_TOKEN", tokenCookieOptions);
    }
}

export default new AuthService();

export const hasRefreshToken = () => {
    return document.cookie.split("; ").some((row) => row.startsWith("STRT_MAX_REFRESH_TOKEN="));
};
