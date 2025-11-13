export interface FetchOptions {
    cache?: boolean;
    persist?: boolean;
    token?: string;
    baseURL?: string;
    ttl?: number;
}


export interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: unknown | null;
}


export interface SmartConfig {
    baseURL?: string;
    token?: string;
    retryLimit?: number;
    refreshToken?: () => Promise<string | null> | null;
}