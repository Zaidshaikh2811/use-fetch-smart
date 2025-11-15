
import axios, { AxiosInstance } from "axios";

let globalToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setGlobalToken = (token: string | null) => {
    globalToken = token;
};

export const createSmartAxios = (
    baseURL: string,
    refreshTokenFn?: () => Promise<string | null>,
    retryLimit: number = 3
): AxiosInstance => {
    const api = axios.create({ baseURL });

    // 🔹 Attach token
    api.interceptors.request.use((config) => {
        if (globalToken) {
            config.headers = config.headers || {};
            // Use headers.set when available
            if (typeof config.headers.set === "function") {
                config.headers.set("Authorization", `Bearer ${globalToken}`);
            } else {
                (config.headers as any)["Authorization"] = `Bearer ${globalToken}`;
            }
        }
        return config;
    });

    // 🔹 Retry + auto-refresh token
    api.interceptors.response.use(
        (res) => res,
        async (error) => {
            const config = error.config;
            if (!config) return Promise.reject(error);

            // ---- Stored refresh token----
            if (error.response?.status === 401 && refreshTokenFn) {


                if (!refreshPromise) refreshPromise = refreshTokenFn();
                const newToken = await refreshPromise;
                refreshPromise = null;

                if (newToken) {
                    globalToken = newToken;
                    config.headers.Authorization = `Bearer ${newToken}`;
                    return api(config); // retry original request
                }
            }



            // ---- Retry for network + 5xx ----
            config.__retry = config.__retry || 0;
            const shouldRetry =
                !error.response ||
                (error.response.status >= 500 && error.response.status < 600);

            if (shouldRetry && config.__retry < retryLimit) {
                config.__retry++;
                await new Promise((resolve) =>
                    setTimeout(resolve, 500 * config.__retry)
                );
                return api(config);
            }

            return Promise.reject(error);
        }
    );

    return api;
};
