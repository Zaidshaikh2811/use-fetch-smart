import { cacheDriver } from "./cache/cacheDriver";
import { validateWithSchema } from "./utils/validateWithSchema";
import { SchemaMode, SchemaValidator } from "./types";


const inFlightPrefetch = new Map<
    string,
    { controller: AbortController; promise: Promise<any> }
>();


const prefetchQueue: Array<() => void> = [];


const MAX_PREFETCH_CONCURRENCY = 3;


let activePrefetches = 0;


let lastPrefetchTs = 0;
const PREFETCH_THROTTLE_MS = 200;


const isSlowNetwork = () => {
    const conn = (navigator as any)?.connection?.effectiveType;
    return conn === "2g" || conn === "slow-2g";
};

interface PrefetchOptions<T = any> {
    ttlMs?: number;
    persist?: boolean;
    schema?: SchemaValidator<T>;
    schemaMode?: SchemaMode;
}


function schedulePrefetch(run: () => Promise<void>) {
    prefetchQueue.push(run);

    const tryRun = () => {
        if (activePrefetches >= MAX_PREFETCH_CONCURRENCY) return;
        if (prefetchQueue.length === 0) return;

        const task = prefetchQueue.shift();
        if (!task) return;

        activePrefetches++;

        task().finally(() => {
            activePrefetches--;
            tryRun();
        });
    };

    tryRun();
}


export async function prefetchSmart<T = any>(
    url: string,
    api: any,
    opts?: PrefetchOptions<T>
) {
    const cacheKey = url;


    if (typeof navigator !== "undefined" && !navigator.onLine) return;


    if (isSlowNetwork()) return;


    if (Date.now() - lastPrefetchTs < PREFETCH_THROTTLE_MS) return;
    lastPrefetchTs = Date.now();


    const existing = await cacheDriver.get<T>(cacheKey, opts?.persist);
    if (existing) return;


    if (inFlightPrefetch.has(cacheKey)) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const runPrefetch = async () => {
        try {

            const promise = api.get<T>(url, { signal });
            inFlightPrefetch.set(cacheKey, { controller, promise });

            const res = await promise;

            const validated = validateWithSchema(
                res.data,
                opts?.schema,
                opts?.schemaMode ?? "error",
                url
            );

            // Save to cache
            await cacheDriver.set(cacheKey, validated, {
                ttlMs: opts?.ttlMs,
                persist: opts?.persist,
            });

        } catch (err) {

        } finally {

            inFlightPrefetch.delete(cacheKey);
        }
    };


    schedulePrefetch(runPrefetch);
}


export function cancelAllPrefetches() {
    inFlightPrefetch.forEach(({ controller }) => controller.abort());
    inFlightPrefetch.clear();
}
