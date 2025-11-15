import { useGetSmart } from "use-fetch-smart";

export default function TestProtected() {
    const { data, loading, error, refetch } = useGetSmart("/protected");

    return (
        <div className="bg-white shadow p-4 rounded-xl">
            <button
                onClick={refetch}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
                Test Protected Route
            </button>

            {loading && <p className="text-gray-600 mt-2">Loading...</p>}
            {error && <p className="text-red-500 mt-2">Unauthorized / Token expired</p>}
            {data && (
                <pre className="mt-2 bg-gray-100 p-2 rounded text-sm">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
}
