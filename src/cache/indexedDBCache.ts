import { get, set, del } from "idb-keyval";

export interface CacheItem<T> {
    data: T;
    expiry: number | null;
}

export const indexedDBCache = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const item = (await get(key)) as CacheItem<T> | undefined;
            if (!item) return null;

            if (item.expiry && Date.now() > item.expiry) {
                await del(key);
                return null;
            }

            return item.data;
        } catch {
            return null;
        }
    },

    async set<T>(key: string, data: T, ttlMs?: number) {
        const expiry = ttlMs ? Date.now() + ttlMs : null;
        try {
            await set(key, { data, expiry } as CacheItem<T>);
        } catch { }
    },

    async delete(key: string) {
        try {
            await del(key);
        } catch { }
    }
};
