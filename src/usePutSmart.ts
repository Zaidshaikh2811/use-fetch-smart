import { useState } from "react";
import { createSmartAxios } from "./smartAxios";


export function usePutSmart<T = any, Body = any>(
    url: string,
    opts?: { baseURL?: string; refreshTokenFn?: () => Promise<string | null> }
) {
    const api = createSmartAxios(opts?.baseURL || "", opts?.refreshTokenFn);

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const mutate = async (body: Body) => {
        setLoading(true);
        try {
            const res = await api.put<T>(url, body);
            setData(res.data);
            return res.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, data, loading, error };
}
