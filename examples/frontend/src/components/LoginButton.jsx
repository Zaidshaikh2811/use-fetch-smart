import { usePostSmart } from "use-fetch-smart";

export default function LoginButton() {
    const { mutate, loading } = usePostSmart("/login");

    const handleLogin = () => {
        mutate({ email: "Test@gmail.com" })
            .then(res => {
                localStorage.setItem("accessToken", res.accessToken);
                localStorage.setItem("refreshToken", res.refreshToken);
                alert("Logged in!");
            })
            .catch(() => alert("Login failed"));
    };

    return (
        <button
            onClick={handleLogin}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
            {loading ? "Logging in..." : "Login"}
        </button>
    );
}
