import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken") || null
    );

    const [refreshTokenValue, setRefreshTokenValue] = useState(
        localStorage.getItem("refreshToken") || null
    );

    // Save tokens to localStorage automatically
    useEffect(() => {
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
        }
    }, [accessToken]);

    useEffect(() => {
        if (refreshTokenValue) {
            localStorage.setItem("refreshToken", refreshTokenValue);
        }
    }, [refreshTokenValue]);

    // Login method
    const login = (tokens) => {
        setAccessToken(tokens.accessToken);
        setRefreshTokenValue(tokens.refreshToken);
    };

    // Logout
    const logout = () => {
        setAccessToken(null);
        setRefreshTokenValue(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };

    // Refresh token method (used by use-fetch-smart)
    const refreshToken = async () => {
        if (!refreshTokenValue) return null;

        try {
            const res = await fetch("http://localhost:3000/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: refreshTokenValue })
            });

            const data = await res.json();
            if (!data.accessToken) return null;

            setAccessToken(data.accessToken);
            return data.accessToken;
        } catch {
            return null;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshTokenValue,
                login,
                logout,
                refreshToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// NOTE: For Fast Refresh, this file should only export React components.
// Move the hook to a separate file (e.g. src/hooks/useAuth.js) and import it where needed.
