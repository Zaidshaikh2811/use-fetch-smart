import React, { createContext, useContext, useRef } from "react";
import { createSmartAxios, setGlobalToken } from "./smartAxios";

export interface FetchSmartConfig {
    baseURL?: string;
    token?: string;
    retryLimit?: number;
    refreshToken?: () => Promise<string | null>;
}

interface FetchSmartContextValue {
    axiosInstance: ReturnType<typeof createSmartAxios>;
}

const FetchSmartContext = createContext<FetchSmartContextValue | null>(null);

export const FetchSmartProvider = ({
    config,
    children,
}: {
    config: FetchSmartConfig;
    children: React.ReactNode;
}) => {
    // Set global token if provided
    if (config.token) {
        setGlobalToken(config.token);
    }

    // Create ONE stable axios instance
    const axiosRef = useRef(
        createSmartAxios(
            config.baseURL || "",
            config.refreshToken,   // refresh function
            config.retryLimit      // retry limit
        )
    );

    return (
        <FetchSmartContext.Provider value={{ axiosInstance: axiosRef.current }}>
            {children}
        </FetchSmartContext.Provider>
    );
};

// 🔥 Hook to read axios instance from provider
export const useFetchSmartContext = () => {
    const ctx = useContext(FetchSmartContext);
    if (!ctx) {
        throw new Error(
            "useGetSmart / usePostSmart must be used inside <FetchSmartProvider>"
        );
    }
    return ctx;
};
