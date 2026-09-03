import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export const TOKEN_KEY = "lms_access_token";
export const REFRESH_KEY = "lms_refresh_token";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);

  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

let refreshing: Promise<string | null> | null = null;

async function renewToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_KEY);

  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<{ accessToken: string }>(
      `${API_URL}/auth/refresh`,
      { refreshToken },
    );

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };

    const canRetry =
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      request &&
      !request._retried &&
      !request.url?.includes("/auth/");

    if (!canRetry) {
      if (error.response?.status === 401 && typeof window !== "undefined") {
        logout();
      }
      return Promise.reject(error);
    }

    request._retried = true;

    refreshing = refreshing ?? renewToken().finally(() => {
      refreshing = null;
    });

    const token = await refreshing;

    if (!token) {
      logout();
      return Promise.reject(error);
    }

    request.headers.Authorization = `Bearer ${token}`;

    return apiClient(request);
  },
);

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    if (Array.isArray(data?.message)) return data.message[0];
    if (typeof data?.message === "string") return data.message;
  }
  return fallback;
}
