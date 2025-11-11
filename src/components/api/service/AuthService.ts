import api from "../api";
import Cookies from "js-cookie";

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

const authLogger = {
    info: (message: string, data?: any) =>
        console.log(`[AUTH-SERVICE] [INFO] ${new Date().toISOString()}: ${message}`, data || ''),
    error: (message: string, error?: any) =>
        console.error(`[AUTH-SERVICE] [ERROR] ${new Date().toISOString()}: ${message}`, error || ''),
    warn: (message: string, data?: any) =>
        console.warn(`[AUTH-SERVICE] [WARN] ${new Date().toISOString()}: ${message}`, data || ''),
    debug: (message: string, data?: any) =>
        console.debug(`[AUTH-SERVICE] [DEBUG] ${new Date().toISOString()}: ${message}`, data || '')
};

class AuthService {
    async login(phone: string, password: string): Promise<LoginResponse> {
        authLogger.info("Login attempt", { phone });

        try {
            const response = await api.post("/api/v1/sign_in/", { phone_number: phone, password });
            const { token, refresh_token } = response.data;

            // Сохраняем токены в cookie с уникальными названиями
            Cookies.set("STRT_MAX_ACCESS_TOKEN", token);
            Cookies.set("STRT_MAX_REFRESH_TOKEN", refresh_token);

            authLogger.info("Login successful", {
                phone,
                hasAccessToken: !!token,
                hasRefreshToken: !!refresh_token
            });

            return { access: token, refresh: refresh_token };
        } catch (error: any) {
            authLogger.error("Login failed", error?.response?.data || error);
            throw error;
        }
    }

    async registerProfile(
        phone_number: string,
        password: string,
        first_name: string,
        last_name: string,
        group_number: string,
        phone?: string,
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
            authLogger.debug("Step 1: Phone validation");
            const response = await api.post("/api/v1/sign_up/step1/", { phone_number });

            if (response.data.status !== "validated") {
                authLogger.warn("Phone validation failed", response.data);
                return;
            }

            authLogger.debug("Step 3: Profile registration");
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

            const response2 = await api.post("/api/v1/sign_up/step3/", formData);

            if (response2.data.token && response2.data.refresh_token) {
                Cookies.set("STRT_MAX_ACCESS_TOKEN", response2.data.token);
                Cookies.set("STRT_MAX_REFRESH_TOKEN", response2.data.refresh_token);

                authLogger.info("Tokens stored in cookie", {
                    token: response2.data.token.slice(0, 10) + "...",
                    refresh_token: response2.data.refresh_token.slice(0, 10) + "..."
                });
            } else {
                authLogger.warn("Step 3 response did not include tokens", response2.data);
            }

            authLogger.info("Registration completed successfully", response2.data);

            return response2.data.user || response2.data;
        } catch (error) {
            authLogger.error("Registration process failed", error);
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
            const response = await api.post("/api/v1/sign_in/refresh/", { refresh });
            const { access } = response.data;

            Cookies.set("STRT_MAX_ACCESS_TOKEN", access);
            authLogger.info("Token refreshed successfully");

            return access;
        } catch (error) {
            authLogger.error("Token refresh failed", error);
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
