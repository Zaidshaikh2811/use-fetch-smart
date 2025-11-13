import { useEffect, useState } from "react";

import { cache } from "./cache";

import { useFetchSmartContext } from "./FetchSmartProvider";


export function useGetSmart<T = any>(
    url: string,
    opts?: {
        cacheTimeMs?: number;
    }
) {
    const { axiosInstance: api } = useFetchSmartContext();


    const cacheKey = url;


    const ttlSeconds = (opts?.cacheTimeMs || 5 * 60 * 1000) / 1000;

    const [data, setData] = useState<T | null>(() => cache.get<T>(cacheKey));
    const [loading, setLoading] = useState(!data);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.get<T>(url);
            setData(res.data);
            cache.set(cacheKey, res.data, ttlSeconds);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!data) {
            fetchData();
        }

    }, [url]);

    return { data, loading, error, refetch: fetchData };
}
