import { useEffect, useRef, useState } from "react";
import { cache } from "./cache";
import { useFetchSmartContext } from "./FetchSmartProvider";

export function useGetSmart<T = any>(
    url: string,
    opts?: {
        cacheTimeMs?: number;
        persist?: boolean;
    }
) {
    const { axiosInstance: api } = useFetchSmartContext();

    const cacheKey = url;

    // Convert ms → seconds correctly
    const ttlSeconds = opts?.cacheTimeMs
        ? opts.cacheTimeMs / 1000
        : 300; // default 5 minutes

    // Read from cache ONCE during mount
    const [data, setData] = useState<T | null>(() => cache.get<T>(cacheKey));
    const [loading, setLoading] = useState(!data);
    const [error, setError] = useState<any>(null);

    const didRun = useRef(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.get<T>(url);
            setData(res.data);

            cache.set(cacheKey, res.data, ttlSeconds, opts?.persist ?? false);

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only run once per mount (prevents double fetch)
        if (didRun.current) return;
        didRun.current = true;

        if (!data) {
            console.log("DATA in if:", data);

            fetchData();
        }
    }, [url]);

    return { data, loading, error, refetch: fetchData };
}
