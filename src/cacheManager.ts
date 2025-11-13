const memoryCache = new Map<string, any>();

export const cacheManager = {
    get: (key: string) => memoryCache.get(key) ?? JSON.parse(localStorage.getItem(key) || "null"),
    set: (key: string, data: any, persist = false) => {
        memoryCache.set(key, data);
        if (persist) localStorage.setItem(key, JSON.stringify(data));
    },
    clear: (key?: string) => {
        if (key) memoryCache.delete(key);
        else memoryCache.clear();
    },
};
