import { usePostSmart } from "use-fetch-smart";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    message: z.string().optional(),
}).strict();

export default function LoginButton() {
    const { accessToken, login, logout } = useAuth();

    const { mutate, loading, error } = usePostSmart("/login", {
        schema: loginSchema,
        schemaMode: "error",
    });

    const handleLogin = () => {
        mutate({ email: "Test@gmail.com" })
            .then(res => {
                login({
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken
                });

                alert("Logged in!");
            })
            .catch(() => {
                alert("Login failed");
            });
    };


    return (
        <>
            {accessToken ? (
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Logout
                </button>
            ) : (
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            )}

            {/* Debug only */}
            {error && (
                <p className="text-red-500 text-sm mt-2">{error.message}</p>
            )}
        </>
    );
}
