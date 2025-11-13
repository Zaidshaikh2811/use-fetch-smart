interface CacheItem<T> {
    data: T;
    expiry: number | null;
}

export const memoryCache = new Map<string, CacheItem<any>>();

export const cache = {
    set<T>(key: string, data: T, ttlSeconds?: number, persist?: boolean) {
        const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
        const item = { data, expiry };
        memoryCache.set(key, item);

        if (persist) {
            localStorage.setItem(key, JSON.stringify(item));
        }
    },

    get<T>(key: string): T | null {
        const mem = memoryCache.get(key);
        if (mem) {
            if (mem.expiry && Date.now() > mem.expiry) {
                memoryCache.delete(key);
                localStorage.removeItem(key);
                return null;
            }
            return mem.data;
        }

        const raw = localStorage.getItem(key);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as CacheItem<T>;
        if (parsed.expiry && Date.now() > parsed.expiry) {
            localStorage.removeItem(key);
            return null;
        }

        memoryCache.set(key, parsed);
        return parsed.data;
    },

    /** 🔥 Add these two! */
    _keys() {
        return Array.from(memoryCache.keys());
    },

    _dump() {
        return Array.from(memoryCache.entries()).map(([key, val]) => ({
            key,
            data: val.data,
            expiry: val.expiry,
        }));
    }
};
