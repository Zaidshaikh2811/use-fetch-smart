import { useState } from "react";
import { useFetchSmartContext } from "./FetchSmartProvider";
import { SchemaMode, SchemaValidator } from "./types";
import { validateWithSchema } from "./utils/validateWithSchema";


export function useDeleteSmart<T = any>(
    url: string,
    opts?: {
        schema?: SchemaValidator<T>;
        schemaMode?: SchemaMode;
    }
) {
    const { axiosInstance: api } = useFetchSmartContext();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const mutate = async () => {
        setLoading(true);
        try {
            const res = await api.delete<T>(url);
            const validated = validateWithSchema(
                res.data,
                opts?.schema,
                opts?.schemaMode ?? "error",
                url
            );

            setData(validated);
            return validated;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, data, loading, error };
}
