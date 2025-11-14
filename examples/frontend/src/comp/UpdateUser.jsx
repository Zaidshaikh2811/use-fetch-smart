import { usePutSmart } from "use-fetch-smart";

export default function UpdateUser({ userId, onUpdated }) {
    const { mutate, loading } = usePutSmart(`/users/${userId}`);

    const handleUpdate = () => {
        mutate(
            { name: "Updated Name" },
        ).then(() => {
            alert("User updated");
            onUpdated();
        });
    };

    return <button disabled={loading} onClick={handleUpdate}>
        {loading ? "Updating..." : "Update User"}
    </button>;
}
