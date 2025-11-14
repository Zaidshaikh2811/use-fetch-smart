import { useGetSmart } from "use-fetch-smart";

export default function TestProtected() {
    const { data, loading, error, refetch } = useGetSmart("/protected");

    return (
        <div style={{ marginTop: "10px" }}>
            <button onClick={refetch}>
                Test Protected Route
            </button>

            {loading && <p>Loading...</p>}
            {error && <p>Error: Unauthorized or token expired</p>}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
}
