import { useGetSmart } from "use-fetch-smart";

export default function UsersList() {
    const { data, loading, error, refetch } = useGetSmart("/users");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading users</p>;

    return (
        <div>
            <h2>Users</h2>
            <button onClick={refetch}>Refresh</button>
            <ul>
                {data?.map(u => (
                    <li key={u.id}>{u.name} — {u.email}</li>
                ))}
            </ul>
        </div>
    );
}
