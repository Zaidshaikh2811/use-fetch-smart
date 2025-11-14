import { useDeleteSmart } from "use-fetch-smart";

export default function DeleteUser({ userId, onDeleted }) {
    const { mutate, loading } = useDeleteSmart(`/users/${userId}`);

    const handleDelete = () => {
        mutate(null).then(() => {
            alert("User deleted");
            onDeleted();
        });
    };

    return <button disabled={loading} onClick={handleDelete}>
        {loading ? "Deleting..." : "Delete"}
    </button>;
}
