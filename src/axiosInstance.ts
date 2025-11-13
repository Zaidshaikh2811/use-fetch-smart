import axios, { AxiosInstance } from "axios";

export const createSmartAxios = (baseURL: string, token?: string): AxiosInstance => {
    const instance = axios.create({ baseURL });

    instance.interceptors.request.use(config => {
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    instance.interceptors.response.use(
        response => response,
        async (error) => {
            const config = error?.config;

            if (!config) {
                return Promise.reject(error);
            }

            config.retryCount = config.retryCount ?? 0;

            const shouldRetry =
                !error.response || (error.response.status >= 500 && error.response.status < 600);

            if (shouldRetry && config.retryCount < 3) {
                config.retryCount += 1;
                const delay = 1000 * Math.pow(2, config.retryCount); // exponential backoff
                await new Promise(res => setTimeout(res, delay));
                return instance(config);
            }

            return Promise.reject(error);
        }
    );

    return instance;
};
