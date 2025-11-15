
export interface CacheItem<T> {
    data: T;
    expiry: number | null; // timestamp (ms)
}

const memoryStore = new Map<string, CacheItem<any>>();

export const memoryCache = {
    get<T>(key: string): T | null {
        const item = memoryStore.get(key);
        if (!item) return null;

        if (item.expiry && Date.now() > item.expiry) {
            memoryStore.delete(key);
            return null;
        }

        return item.data;
    },

    set<T>(key: string, data: T, ttlMs?: number) {
        const expiry = ttlMs ? Date.now() + ttlMs : null;
        memoryStore.set(key, { data, expiry });
    },

    delete(key: string) {
        memoryStore.delete(key);
    },

    clear() {
        memoryStore.clear();
    }
};
