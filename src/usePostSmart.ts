// usePostSmart.ts
import { useState } from "react";
import { useFetchSmartContext } from "./FetchSmartProvider";

export function usePostSmart<T = any, Body = any>(
    url: string,
) {
    const { axiosInstance: api } = useFetchSmartContext();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const mutate = async (body: Body) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post<T>(url, body);
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
