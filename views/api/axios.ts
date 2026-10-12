import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://v62-tier3-team-36.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_DATA_KEY = "user_data";

let refreshPromise: Promise<string | null> | null = null;

const clearSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_DATA_KEY);
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    clearSession();
    return null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/refresh`,
      { refresh_token: refreshToken },
      { headers: { Accept: "application/json" } },
    );

    const nextAccessToken = response.data?.access_token as string | undefined;
    const nextRefreshToken = response.data?.refresh_token as string | undefined;
    const user = response.data?.user;

    if (!nextAccessToken) {
      clearSession();
      return null;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, nextAccessToken);
    if (nextRefreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, nextRefreshToken);
    }
    if (user) {
      window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    }

    return nextAccessToken;
  } catch {
    clearSession();
    return null;
  }
};

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) {
    return config;
  }

  config.headers = AxiosHeaders.from(config.headers);
  config.headers.set("Authorization", `Bearer ${token}`);

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest =
      error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      typeof window === "undefined"
    ) {
      throw error;
    }

    if (originalRequest.url?.includes("/api/refresh")) {
      throw error;
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const nextAccessToken = await refreshPromise;
    if (!nextAccessToken) {
      throw error;
    }

    originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
    originalRequest.headers.set("Authorization", `Bearer ${nextAccessToken}`);

    return api(originalRequest);
  },
);