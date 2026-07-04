import axios from "axios";
import Cookies from "js-cookie";

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

export default api;
