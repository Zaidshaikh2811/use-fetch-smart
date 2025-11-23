import { useEffect, useRef, useState } from "react";
import { useFetchSmartContext } from "./FetchSmartProvider";
import { cacheDriver } from "./cache/cacheDriver";
import { validateWithSchema } from "./utils/validateWithSchema";
import { SchemaMode, SchemaValidator } from "./types";
import { prefetchSmart } from "./prefetchSmart";

const inFlightRequests = new Map<string, Promise<any>>();

export function useGetSmart<T = any>(
    url: string,
    opts?: {
        cacheTimeMs?: number;
        persist?: boolean;
        swr?: boolean;
        schema?: SchemaValidator<T>;
        schemaMode?: SchemaMode;
        prefetchNext?: (
            data: T,
            ctx: { url: string }
        ) => Array<{
            url: string;
            schema?: SchemaValidator<any>;
            schemaMode?: SchemaMode;
            ttlMs?: number;
            persist?: boolean;
        }>;
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
    const abortRef = useRef<AbortController | null>(null);

    const mountedRef = useRef(true);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
            abortRef.current?.abort();
        };
    }, []);

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
            setLoading(true);

            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            const signal = controller.signal;


            let requestPromise: Promise<any>

            if (inFlightRequests.has(url)) {
                requestPromise = inFlightRequests.get(url)!;
            } else {
                requestPromise = api.get<T>(url, { signal });
                inFlightRequests.set(url, requestPromise);
            }


            const res = await requestPromise;


            if (inFlightRequests.get(url) === requestPromise) {
                inFlightRequests.delete(url);
            }


            if (signal.aborted) return;



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


            if (opts?.prefetchNext) {
                const predictions = opts.prefetchNext(validated, { url });

                predictions?.forEach((p) => {
                    prefetchSmart<T>(p.url, api, {
                        ttlMs: p.ttlMs ?? ttlMs,
                        persist: p.persist ?? opts?.persist,
                        schema: p.schema ?? opts?.schema,
                        schemaMode: p.schemaMode ?? opts?.schemaMode,
                    });
                });
            }


        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch: revalidate };
}
