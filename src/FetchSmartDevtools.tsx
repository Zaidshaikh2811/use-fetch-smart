import React, { useEffect, useState } from "react";
import { memoryCache } from "./cache/memoryCache";
import { indexedDBCache } from "./cache/indexedDBCache";

export const FetchSmartDevtools = () => {
    const _proc: any = (globalThis as any).process;
    if (_proc && _proc.env && _proc.env.NODE_ENV === 'production') return null;

    const [open, setOpen] = useState(false);

    const [memDump, setMemDump] = useState<any[]>([]);
    const [idbDump, setIdbDump] = useState<any[]>([]);
    const [combinedDump, setCombinedDump] = useState<any[]>([]);

    const [memKeys, setMemKeys] = useState<string[]>([]);
    const [idbKeys, setIdbKeys] = useState<string[]>([]);
    const [allKeys, setAllKeys] = useState<string[]>([]);

    useEffect(() => {
        if (open) refresh();
    }, [open]);

    const refresh = async () => {
        /** -----------------------
         *  1️⃣ MEMORY CACHE
         * ----------------------*/
        const mem = typeof memoryCache.dump === "function"
            ? memoryCache.dump()
            : [];

        setMemDump(mem);

        const mKeys = mem.map(item => item.key);
        setMemKeys(mKeys);



        /** -----------------------
         *  2️⃣ INDEXEDDB CACHE
         * ----------------------*/
        let idb: any[] = [];
        let idbKeysList: string[] = [];

        if (typeof indexedDBCache.keys === "function") {
            idbKeysList = await indexedDBCache.keys();
            for (const k of idbKeysList) {
                const item = await indexedDBCache.get(k);
                if (item !== null) {
                    idb.push({ key: k, data: item });
                }
            }
        }

        setIdbDump(idb);
        setIdbKeys(idbKeysList);



        /** -----------------------
         *  3️⃣ COMBINED KEYS
         * ----------------------*/
        const combinedKeys = Array.from(new Set([...mKeys, ...idbKeysList]));
        setAllKeys(combinedKeys);



        /** -----------------------
         *  4️⃣ COMBINED CACHE VIEW
         * ----------------------*/
        const combined: any[] = [];

        for (const key of combinedKeys) {
            const memEntry = mem.find(x => x.key === key);
            const idbEntry = idb.find(x => x.key === key);

            combined.push({
                key,
                source:
                    memEntry && idbEntry
                        ? "memory + indexeddb"
                        : memEntry
                            ? "memory"
                            : "indexeddb",
                memoryData: memEntry ? memEntry.data : null,
                idbData: idbEntry ? idbEntry.data : null,
                memoryExpiry: memEntry ? memEntry.expiry : null,
                idbExpiry: idbEntry ? idbEntry.expiry : null,
            });
        }

        setCombinedDump(combined);
    };

    if (!open)
        return (
            <button
                onClick={() => setOpen(true)}
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    padding: "6px 10px",
                    background: "#333",
                    color: "white",
                    borderRadius: "6px",
                }}
            >
                FS Devtools
            </button>
        );

    return (
        <div
            style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                width: 450,
                maxHeight: "75vh",
                overflow: "auto",
                background: "#111",
                padding: 16,
                borderRadius: 10,
                color: "white",
                fontFamily: "monospace",
                zIndex: 9999
            }}
        >
            <button
                onClick={() => setOpen(false)}
                style={{
                    background: "#444",
                    padding: "4px 8px",
                    borderRadius: 4,
                    marginBottom: 10,
                }}
            >
                Close
            </button>

            <h3>Memory Keys</h3>
            <pre>{JSON.stringify(memKeys, null, 2)}</pre>

            <h3>IndexedDB Keys</h3>
            <pre>{JSON.stringify(idbKeys, null, 2)}</pre>

            <h3>All Cache Keys (Combined)</h3>
            <pre>{JSON.stringify(allKeys, null, 2)}</pre>

            <h3>Memory Cache</h3>
            <pre>{JSON.stringify(memDump, null, 2)}</pre>

            <h3>IndexedDB Cache</h3>
            <pre>{JSON.stringify(idbDump, null, 2)}</pre>

            <h3>Combined View</h3>
            <pre>{JSON.stringify(combinedDump, null, 2)}</pre>

            <button
                onClick={refresh}
                style={{
                    marginTop: 10,
                    padding: "6px 8px",
                    background: "#333",
                    color: "white",
                    borderRadius: 4,
                }}
            >
                Refresh
            </button>
        </div>
    );
};
