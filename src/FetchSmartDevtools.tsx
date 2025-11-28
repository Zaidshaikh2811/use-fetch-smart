import React, { useEffect, useState, useCallback } from "react";
import { memoryCache } from "./cache/memoryCache";
import { indexedDBCache } from "./cache/indexedDBCache";
import { inFlightRequests, inFlightMutations } from "./utils/smartDedupe";

export const FetchSmartDevtools = () => {
    const _proc: any = (globalThis as any).process;
    if (_proc?.env?.NODE_ENV === "production") return null;

    const [open, setOpen] = useState(false);

    const [state, setState] = useState({
        memDump: [] as any[],
        idbDump: [] as any[],
        combinedDump: [] as any[],
        memKeys: [] as string[],
        idbKeys: [] as string[],
        allKeys: [] as string[],
        inFlightGetKeys: [] as string[],
        inFlightMutationKeys: [] as string[],
    });

    /** -------------------------------
     *  OPTIMIZED ASYNC REFRESH
     * ------------------------------- */
    const refresh = useCallback(async () => {
        const mem = memoryCache.dump?.() ?? [];
        const memKeys = mem.map((x) => x.key);

        // IndexedDB parallel read
        let idbKeys: string[] = [];
        let idbDump: any[] = [];

        if (indexedDBCache.keys) {
            idbKeys = await indexedDBCache.keys();
            const reads = await Promise.all(idbKeys.map((k) => indexedDBCache.get(k)));
            idbDump = idbKeys.map((k, i) => ({ key: k, data: reads[i] })).filter((x) => x.data !== null);
        }

        const allKeys = Array.from(new Set([...memKeys, ...idbKeys]));

        // Build combined result faster using maps
        const memMap = new Map(mem.map((x) => [x.key, x]));
        const idbMap = new Map(idbDump.map((x) => [x.key, x]));

        const combinedDump = allKeys.map((key) => {
            const m = memMap.get(key);
            const d = idbMap.get(key);

            return {
                key,
                source: m && d ? "memory + indexeddb" : m ? "memory" : "indexeddb",
                memoryData: m?.data ?? null,
                idbData: d?.data ?? null,
                memoryExpiry: m?.expiry ?? null,
                idbExpiry: d?.expiry ?? null,
            };
        });

        setState({
            memDump: mem,
            idbDump,
            combinedDump,
            memKeys,
            idbKeys,
            allKeys,
            inFlightGetKeys: Array.from(inFlightRequests.keys()),
            inFlightMutationKeys: Array.from(inFlightMutations.keys()),
        });
    }, []);

    useEffect(() => {
        if (open) refresh();
    }, [open, refresh]);

    /** -------------------------------
     *  CLEAN HELPERS
     * ------------------------------- */
    const clearMemory = () => {
        memoryCache.clear?.();
        refresh();
    };

    const clearIndexedDB = async () => {
        await indexedDBCache.clear?.();
        refresh();
    };

    const clearInFlight = () => {
        inFlightRequests.clear();
        inFlightMutations.clear();
        refresh();
    };

    /** -------------------------------
     *  CLOSED STATE BUTTON
     * ------------------------------- */
    if (!open)
        return (
            <button
                onClick={() => setOpen(true)}
                style={FAB_STYLE}
            >
                FS Devtools
            </button>
        );

    /** -------------------------------
     *  OPEN STATE PANEL
     * ------------------------------- */
    return (
        <div style={PANEL_STYLE}>
            <button onClick={() => setOpen(false)} style={BTN_STYLE}>
                Close
            </button>

            {/** ----------------------- */}
            {/**      DEDUPE KEYS       */}
            {/** ----------------------- */}
            <Section title="🔵 In-Flight GET Requests">
                {state.inFlightGetKeys}
            </Section>

            <Section title="🔴 In-Flight Mutations">
                {state.inFlightMutationKeys}
            </Section>

            {/** ----------------------- */}
            {/**       CACHE KEYS       */}
            {/** ----------------------- */}
            <Section title="Memory Keys">{state.memKeys}</Section>
            <Section title="IndexedDB Keys">{state.idbKeys}</Section>
            <Section title="All Cache Keys">{state.allKeys}</Section>

            {/** ----------------------- */}
            {/**        RAW DATA        */}
            {/** ----------------------- */}
            <Section title="Memory Cache">{state.memDump}</Section>
            <Section title="IndexedDB Cache">{state.idbDump}</Section>
            <Section title="Combined Cache View">{state.combinedDump}</Section>

            {/** ----------------------- */}
            {/**       ACTION BTNS      */}
            {/** ----------------------- */}
            <button style={BTN_STYLE} onClick={refresh}>Refresh</button>
            <button style={BTN_DANGER} onClick={clearMemory}>Clear Memory Cache</button>
            <button style={BTN_WARN} onClick={clearIndexedDB}>Clear IndexedDB</button>
            <button style={BTN_INFO} onClick={clearInFlight}>Clear In-Flight Requests</button>
        </div>
    );
};

/* -------------------------------
   SMALL UTIL COMPONENT
--------------------------------*/
const Section = ({ title, children }: any) => (
    <>
        <h3>{title}</h3>
        <pre>{JSON.stringify(children, null, 2)}</pre>
    </>
);

/* -------------------------------
   UI STYLES
--------------------------------*/
const FAB_STYLE: React.CSSProperties = {
    position: "fixed",
    bottom: 20,
    right: 20,
    padding: "6px 10px",
    background: "#333",
    color: "white",
    borderRadius: "6px",
    fontFamily: "monospace",
    zIndex: 99999,
};

const PANEL_STYLE: React.CSSProperties = {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 480,
    maxHeight: "80vh",
    overflowY: "auto",
    background: "#111",
    padding: 16,
    borderRadius: 10,
    color: "white",
    fontFamily: "monospace",
    zIndex: 99999,
};

const BTN_STYLE: React.CSSProperties = {
    background: "#444",
    padding: "6px 8px",
    borderRadius: 4,
    marginBottom: 10,
    width: "100%",
};

const BTN_DANGER = {
    ...BTN_STYLE,
    background: "#550000",
};

const BTN_WARN = {
    ...BTN_STYLE,
    background: "#A36C00",
};

const BTN_INFO = {
    ...BTN_STYLE,
    background: "#003355",
};
