import { get, set, del, keys, clear } from "idb-keyval";

export interface CacheItem<T> {
    data: T;
    expiry: number | null;
}
const isDev = (() => {
    const env = (globalThis as any)?.process?.env?.NODE_ENV;
    return env !== "production";
})();

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
        } catch (err) {
            if (isDev) console.error("IndexedDB get error", err);
            return null;
        }
    },

    async set<T>(key: string, data: T, ttlMs?: number) {
        const expiry = ttlMs ? Date.now() + ttlMs : null;
        try {
            await set(key, { data, expiry } as CacheItem<T>);
        } catch (err) {
            if (isDev) console.error("IndexedDB set error", err);
        }
    },

    async delete(key: string) {
        try {
            await del(key);
        } catch (err) {
            if (isDev) console.error("IndexedDB delete error", err);
        }
    },


    async keys(): Promise<string[]> {
        try {
            return await keys();
        } catch (err) {
            if (isDev) console.error("IndexedDB keys error", err);
            return [];
        }
    },

    async dump(): Promise<any[]> {
        try {
            const allKeys = await keys();
            const output: any[] = [];

            for (const k of allKeys) {
                const item = (await get(k)) as CacheItem<any>;
                if (!item) continue;

                output.push({
                    key: k,
                    data: item.data,
                    expiry: item.expiry,
                });
            }

            return output;
        } catch (err) {
            if (isDev) console.error("IndexedDB dump error", err);
            return [];
        }
    },
    clear: async () => {
        try {
            await clear();
        } catch (err) {
            if (isDev) console.error("IndexedDB clear error", err);
        }
    },
};
