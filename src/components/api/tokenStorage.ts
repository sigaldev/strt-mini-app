import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "STRT_MAX_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "STRT_MAX_REFRESH_TOKEN";

const tokenCookieOptions = {
    path: "/",
    sameSite: "lax" as const,
    secure: window.location.protocol === "https:",
};

const canUseLocalStorage = () => {
    try {
        const testKey = "__strt_storage_test__";
        window.localStorage.setItem(testKey, "1");
        window.localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
};

const getStoredToken = (key: string) => {
    const cookieValue = Cookies.get(key);
    if (cookieValue) return cookieValue;

    if (!canUseLocalStorage()) return undefined;

    return window.localStorage.getItem(key) || undefined;
};

const setStoredToken = (key: string, value: string) => {
    Cookies.set(key, value, tokenCookieOptions);

    if (canUseLocalStorage()) {
        window.localStorage.setItem(key, value);
    }
};

const removeStoredToken = (key: string) => {
    Cookies.remove(key, tokenCookieOptions);

    if (canUseLocalStorage()) {
        window.localStorage.removeItem(key);
    }
};

export const tokenStorage = {
    setTokens: (access: string, refresh: string) => {
        setStoredToken(ACCESS_TOKEN_KEY, access);
        setStoredToken(REFRESH_TOKEN_KEY, refresh);
    },
    setAccessToken: (access: string) => {
        setStoredToken(ACCESS_TOKEN_KEY, access);
    },
    getAccessToken: () => getStoredToken(ACCESS_TOKEN_KEY),
    getRefreshToken: () => getStoredToken(REFRESH_TOKEN_KEY),
    hasRefreshToken: () => Boolean(getStoredToken(REFRESH_TOKEN_KEY)),
    clear: () => {
        removeStoredToken(ACCESS_TOKEN_KEY);
        removeStoredToken(REFRESH_TOKEN_KEY);
    },
};
