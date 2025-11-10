import api from "../api";

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

// Логгер для AuthService
const authLogger = {
    info: (message: string, data?: any) => {
        console.log(`[AUTH-SERVICE] [INFO] ${new Date().toISOString()}: ${message}`, data || '');
    },
    error: (message: string, error?: any) => {
        console.error(`[AUTH-SERVICE] [ERROR] ${new Date().toISOString()}: ${message}`, error || '');
    },
    warn: (message: string, data?: any) => {
        console.warn(`[AUTH-SERVICE] [WARN] ${new Date().toISOString()}: ${message}`, data || '');
    },
    debug: (message: string, data?: any) => {
        console.debug(`[AUTH-SERVICE] [DEBUG] ${new Date().toISOString()}: ${message}`, data || '');
    }
};

interface LoginResponse {
    token: string;
    refresh_token: string;
}

class AuthService {
    async login(phone: string, password: string): Promise<LoginResponse> {
        authLogger.info('Login attempt', { phone });

        try {
            const response = await api.post("/api/v1/sign_in/", {
                phone_number: phone,
                password: password
            }, {
                withCredentials: false
            });


            const { token, refresh_token } = response.data;

            localStorage.setItem("access", token);
            localStorage.setItem("refresh", refresh_token);

            authLogger.info('Login successful', {
                phone,
                hasAccessToken: !!token,
                hasRefreshToken: !!refresh_token
            });

            return { token, refresh_token };
        } catch (error: any) {
            authLogger.error('Login failed', error?.response?.data || error);
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
        authLogger.info('Starting registration process', {
            phone_number,
            first_name,
            last_name,
            group_number,
            has_avatar: !!avatar
        });

        try {
            authLogger.debug('Step 1: Phone validation');
            const response = await api.post("/api/v1/sign_up/step1/", { phone_number }, {
                withCredentials: false
            });


            authLogger.debug('Step 1 response', { status: response.data.status });

            if (response.data.status !== "validated") {
                authLogger.warn('Phone validation failed', response.data);
                return;
            }

            authLogger.debug('Step 3: Profile registration');
            // STEP 3 — регистрация профиля
            const formData = new FormData();
            formData.append("phone_number", phone_number);
            formData.append("phone", phone_number); // дублируем для безопасности
            formData.append("password", password);  // убедись, что пароль >=6 символов
            formData.append("first_name", first_name.replace(/[^A-Za-zА-Яа-яЁё]/g, ""));
            formData.append("last_name", last_name.replace(/[^A-Za-zА-Яа-яЁё]/g, ""));
            formData.append("group_number", group_number);
            formData.append("group_id", ""); // пустой или 0
            formData.append("university_id", "1");
            if (avatar) formData.append("avatar", avatar);


            authLogger.debug('Sending form data to step 3');
            const response2 = await api.post("/api/v1/sign_up/step3/", formData, {
                withCredentials: false
            });


            // Сохраняем токены
            if (response2.data.token && response2.data.refresh_token) {
                localStorage.setItem("token", response2.data.token);
                // localStorage.setItem("refresh", response2.data.refresh_token);
                authLogger.info('Tokens stored in localStorage', {
                    token: response2.data.token.slice(0,10) + "...",
                    refresh_token: response2.data.refresh_token.slice(0,10) + "..."
                });
            } else {
                authLogger.warn('Step 3 response did not include tokens', response2.data);
            }

            authLogger.info('Registration completed successfully', response2.data);

            return response2.data.user || response2.data;
        } catch (error) {
            authLogger.error('Registration process failed', error);
            throw error;
        }
    }

    async refreshToken(): Promise<string> {
        authLogger.debug('Refreshing token');
        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
            authLogger.error('No refresh token available');
            throw new Error("No refresh token available");
        }

        try {
            const response = await api.post("/api/auth/refresh", {
                refresh,
            });

            const { access } = response.data;
            localStorage.setItem("access", access);

            authLogger.info('Token refreshed successfully');
            return access;
        } catch (error) {
            authLogger.error('Token refresh failed', error);
            throw error;
        }
    }

    async getProfile(): Promise<UserProfile> {
        authLogger.debug('Fetching user profile');
        try {
            const response = await api.get("/api/auth/profile");
            authLogger.debug('Profile fetched successfully', { user_id: response.data.id });
            return response.data;
        } catch (error) {
            authLogger.error('Failed to fetch profile', error);
            throw error;
        }
    }

    logout(): void {
        authLogger.info('User logout');
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        // Можно также вызвать API для logout на сервере
    }

    isAuthenticated(): boolean {
        const isAuth = !!localStorage.getItem("access");
        authLogger.debug('Authentication check', { isAuthenticated: isAuth });
        return isAuth;
    }
}

export default new AuthService();