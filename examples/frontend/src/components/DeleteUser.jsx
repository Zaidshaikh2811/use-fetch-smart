import { useDeleteSmart } from "use-fetch-smart";
import { z } from "zod";


const deleteUserSchema = z.object({
    success: z.boolean(),
}).strict();


export default function DeleteUser({ userId, onDeleted }) {
    const { mutate, loading } = useDeleteSmart(`/users/${userId}`, {
        schema: deleteUserSchema,
    });

    const handleDelete = () => {
        mutate(null).then(() => {
            alert("User deleted");
            onDeleted();
        });
    };

    return (
        <button
            disabled={loading}
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
            {loading ? "Deleting..." : "Delete"}
        </button>
    );
}
