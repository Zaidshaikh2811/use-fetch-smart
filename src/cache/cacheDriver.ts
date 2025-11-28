import { memoryCache } from "./memoryCache";
import { indexedDBCache } from "./indexedDBCache";

export type CacheMode = "memory" | "indexeddb";

export interface CacheOptions {
    ttlMs?: number;
    persist?: boolean;
}

export const cacheDriver = {
    async get<T>(key: string, persist?: boolean): Promise<T | null> {
        if (persist) {

            const data = await indexedDBCache.get<T>(key);
            if (data !== null) return data;
        }

        return memoryCache.get<T>(key);
    },

    async set<T>(key: string, data: T, opts?: CacheOptions) {
        const ttlMs = opts?.ttlMs;

        memoryCache.set(key, data, ttlMs);

        if (opts?.persist) {
            await indexedDBCache.set(key, data, ttlMs);
        }
    },

    async delete(key: string) {
        memoryCache.delete(key);
        await indexedDBCache.delete(key);
    },

    async clear() {
        memoryCache.clear();

    },

};
