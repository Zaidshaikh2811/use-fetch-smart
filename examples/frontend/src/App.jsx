import CreateUser from "./components/CreateUser";
import UpdateUser from "./components/UpdateUser";
import DeleteUser from "./components/DeleteUser";
import { useGetSmart } from "use-fetch-smart";
import LoginButton from "./components/LoginButton";
import TestProtected from "./components/TestProtected";

import { z } from "zod";

const usersSchema = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().email(),
    }).strict()
);
export default function App() {
    const { data, loading, error, refetch } = useGetSmart("/users", {
        cacheTimeMs: 50000,
        persist: true,
        schema: usersSchema,
        prefetchNext: () => [
            {
                url: "/prefetchNext",
                schema: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string(),
                        email: z.string().email(),
                    }).strict()
                ),
                schemaMode: "warn",
                persist: false,
            }
        ]
    });


    if (loading) return <p className="text-gray-600 p-4">Loading users...</p>;
    if (error) return <p className="text-red-500 p-4">{error.message}</p>;
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-blue-700">CRUD with use-fetch-smart</h1>

            <div className="flex items-center gap-4">
                <LoginButton />
                <TestProtected />
            </div>

            <div className="bg-white shadow-md rounded-xl p-4">
                <button onClick={refetch} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Refresh Users
                </button>
                <h2 className="text-xl font-semibold mb-3">Create User</h2>
                <CreateUser onCreated={refetch} />
            </div>

            <ul className="space-y-4">
                {data?.map(user => (
                    <li
                        key={user.id}
                        className="bg-gray-100 p-4 rounded-xl shadow flex items-center justify-between"
                    >
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>

                        <div className="flex gap-2">
                            <UpdateUser userId={user.id} onUpdated={refetch} />
                            <DeleteUser userId={user.id} onDeleted={refetch} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
