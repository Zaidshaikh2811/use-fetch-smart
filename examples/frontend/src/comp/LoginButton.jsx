import { usePostSmart } from "use-fetch-smart";

export default function LoginButton() {
    const { mutate, loading } = usePostSmart("/login");

    const handleLogin = () => {
        mutate({ email: "zaid@gmail.com" })
            .then(res => {
                console.log("Response from Login", res);

                localStorage.setItem("accessToken", res.accessToken);
                localStorage.setItem("refreshToken", res.refreshToken);
                alert("Logged in! Tokens saved.");
            })
            .catch(() => {
                alert("Login failed");
            });
    };

    return (
        <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
        </button>
    );
}
