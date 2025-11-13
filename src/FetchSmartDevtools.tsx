
import React, { useState } from "react";
import { cache } from "./cache";

export const FetchSmartDevtools = () => {
    const [open, setOpen] = useState(false);

    if (!open)
        return (
            <button
                onClick={() => setOpen(true)}
                style={{ position: "fixed", bottom: 20, right: 20 }}
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
                width: 350,
                maxHeight: "70vh",
                overflow: "auto",
                background: "white",
                padding: 12,
                borderRadius: 8,
                boxShadow: "0 0 14px rgba(0,0,0,0.3)",
            }}
        >
            <button onClick={() => setOpen(false)}>Close</button>

            <h3>Cache Keys</h3>
            <pre>{JSON.stringify([...cacheKeys()], null, 2)}</pre>

            <h3>Memory Cache</h3>
            <pre>{JSON.stringify(cacheDump(), null, 2)}</pre>
        </div>
    );
};

const cacheKeys = () => Array.from((cache as any).memoryCache?.keys?.() || []);
const cacheDump = () => (cache as any).memoryCache || {};
