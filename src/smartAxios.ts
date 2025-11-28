import axios, { AxiosInstance } from "axios";


let refreshPromise: Promise<string | null> | null = null;
let latestToken: string | null = null;


export const setGlobalToken = (token: string | null) => {
    latestToken = token;
};

export const createSmartAxios = (
    baseURL: string,
    refreshTokenFn?: () => Promise<string | null>,
    retryLimit: number = 3
): AxiosInstance => {
    const api = axios.create({ baseURL });

    api.interceptors.request.use((config) => {
        if (latestToken) {
            config.headers = config.headers || {};

            if (typeof config.headers.set === "function") {
                config.headers.set("Authorization", `Bearer ${latestToken}`);
            } else {
                (config.headers as any)["Authorization"] =
                    `Bearer ${latestToken}`;
            }
        }
        return config;
    });

    api.interceptors.response.use(
        (res) => res,
        async (error) => {
            const config = error.config;
            if (!config) return Promise.reject(error);

            if (error.response?.status === 401 &&
                latestToken
                && refreshTokenFn) {


                if (!refreshPromise) {
                    refreshPromise = refreshTokenFn();
                }

                const newToken = await refreshPromise;
                refreshPromise = null;

                if (newToken) {
                    setGlobalToken(newToken);

                    config.headers.Authorization = `Bearer ${newToken}`;
                    return api(config);
                }
            }

            config.__retry = config.__retry || 0;

            const shouldRetry =
                !error.response ||
                (error.response.status >= 500 && error.response.status < 600);

            if (shouldRetry && config.__retry < retryLimit) {
                config.__retry++;

                const delay = 500 * Math.pow(2, config.__retry - 1);
                await new Promise((resolve) => setTimeout(resolve, delay));

                return api(config);
            }

            return Promise.reject(error);
        }
    );

    return api;
};
