import { useState } from "react";
import { useFetchSmartContext } from "./FetchSmartProvider";
import { SchemaMode, SchemaValidator } from "./types";
import { validateWithSchema } from "./utils/validateWithSchema";
import { inFlightMutations, mutationKey } from "./utils/smartDedupe";

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
        setError(null);

        const key = mutationKey("DELETE", url);


        if (inFlightMutations.has(key)) {
            return await inFlightMutations.get(key);
        }

        const promise = api.delete<T>(url);
        inFlightMutations.set(key, promise);

        try {
            const res = await promise;

            if (inFlightMutations.get(key) === promise) {
                inFlightMutations.delete(key);
            }

            const validated = validateWithSchema(res.data, opts?.schema, "error", url);
            setData(validated);
            return validated;

        } catch (err) {
            inFlightMutations.delete(key);
            setError(err);
            return null;

        } finally {
            setLoading(false);
        }
    };


    return { mutate, data, loading, error };
}
