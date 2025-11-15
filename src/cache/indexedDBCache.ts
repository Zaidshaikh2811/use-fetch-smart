import { get, set, del, keys } from "idb-keyval";

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
    },


    async keys(): Promise<string[]> {
        try {
            return await keys();
        } catch (err) {
            const _proc: any = (globalThis as any).process;
            if (_proc && _proc.env && _proc.env.NODE_ENV !== 'production') {
                // log only in non-production builds
                // @ts-ignore
                console.error("IndexedDB keys error", err);
            }
            return [];
        }
    },

    /** ⭐ REQUIRED BY DEVTOOLS: dump all items */
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
            const _proc: any = (globalThis as any).process;
            if (_proc && _proc.env && _proc.env.NODE_ENV !== 'production') {
                // log only in non-production builds
                // @ts-ignore
                console.error("IndexedDB dump error", err);
            }
            return [];
        }
    }
};
