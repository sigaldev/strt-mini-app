import axios from "axios";
import { tokenStorage } from "./tokenStorage";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Request interceptor — ставим access token в заголовок
api.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
