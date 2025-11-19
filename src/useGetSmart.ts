import { useEffect, useRef, useState } from "react";
import { useFetchSmartContext } from "./FetchSmartProvider";
import { cacheDriver } from "./cache/cacheDriver";
import { validateWithSchema } from "./utils/validateWithSchema";
import { SchemaMode, SchemaValidator } from "./types";


export function useGetSmart<T = any>(
    url: string,
    opts?: {
        cacheTimeMs?: number;
        persist?: boolean;
        swr?: boolean;
        schema?: SchemaValidator<T>;
        schemaMode?: SchemaMode;
    }
) {
    const { axiosInstance: api } = useFetchSmartContext();

    const cacheKey = url;

    const ttlMs = opts?.cacheTimeMs ?? 0;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!data);
    const [error, setError] = useState<any>(null);
    const swr = opts?.swr ?? false;
    const didRun = useRef(false);




    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        let mounted = true;

        (async () => {
            const cached = await cacheDriver.get<T>(cacheKey, opts?.persist);

            if (!mounted) return;

            if (cached) {
                setData(cached);
                setLoading(false);
            }

            if (swr || !cached) {
                revalidate();
            }
        })();

        return () => {
            mounted = false;
        };
    }, [url]);

    const revalidate = async () => {
        try {
            const res = await api.get<T>(url);


            const validated = validateWithSchema(
                res.data,
                opts?.schema,
                opts?.schemaMode ?? "error",
                url
            );

            setData(validated);


            await cacheDriver.set(cacheKey, validated, {
                ttlMs,
                persist: opts?.persist,
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch: revalidate };
}
