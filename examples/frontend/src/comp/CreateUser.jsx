import { usePostSmart } from "use-fetch-smart";

export default function CreateUser({ onCreated }) {
    const { mutate, loading } = usePostSmart("/users");

    const handleCreate = () => {
        mutate(
            { name: "New User", email: "new@example.com" }
        ).then(() => {
            alert("User created");
            onCreated();
        });
    };

    return <button disabled={loading} onClick={handleCreate}>
        {loading ? "Creating..." : "Create User"}
    </button>;
}
