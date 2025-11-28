import { usePutSmart } from "use-fetch-smart";

import { z } from "zod";

const updateUserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
}).strict();


export default function UpdateUser({ userId, onUpdated }) {
    const { mutate, loading } = usePutSmart(`/users/${userId}`, {
        schema: updateUserSchema,
    });

    const handleUpdate = () => {
        mutate({ name: "Updated Name" }).then(() => {
            alert("User updated");
            onUpdated();
        });
    };

    return (
        <button
            disabled={loading}
            onClick={handleUpdate}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
            {loading ? "Updating..." : "Update"}
        </button>
    );
}
