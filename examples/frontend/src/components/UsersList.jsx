import { useGetSmart } from "use-fetch-smart";

export default function UsersList() {
    const { data, loading, error, refetch } = useGetSmart("/users");

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error loading users</p>;

    return (
        <div className="bg-white shadow rounded-xl p-4 mt-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Users</h2>
                <button
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={refetch}
                >
                    Refresh
                </button>
            </div>

            <ul className="space-y-2">
                {data?.map(u => (
                    <li key={u.id} className="p-2 bg-gray-100 rounded">
                        {u.name} — {u.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}
