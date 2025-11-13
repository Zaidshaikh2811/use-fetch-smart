import { useState } from "react";
import { useFetchSmartContext } from "./FetchSmartProvider";


export function useDeleteSmart<T = any>(
    url: string,
) {
    const { axiosInstance: api } = useFetchSmartContext();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const mutate = async () => {
        setLoading(true);
        try {
            const res = await api.delete<T>(url);
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
