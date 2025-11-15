import { usePostSmart } from "use-fetch-smart";

export default function CreateUser({ onCreated }) {
    const { mutate, loading } = usePostSmart("/users");

    const handleCreate = () => {
        mutate({ name: "New User", email: "new@example.com" })
            .then(() => {
                alert("User created");
                onCreated();
            });
    };

    return (
        <button
            disabled={loading}
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
            {loading ? "Creating..." : "Create User"}
        </button>
    );
}
