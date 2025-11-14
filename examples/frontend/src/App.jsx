import UsersList from "./comp/UsersList";
import CreateUser from "./comp/CreateUser";
import UpdateUser from "./comp/UpdateUser";
import DeleteUser from "./comp/DeleteUser";
import { useGetSmart } from "use-fetch-smart";
import LoginButton from "./comp/LoginButton";
import TestProtected from "./comp/TestProtected";

export default function App() {
    const { data, loading, error, refetch } = useGetSmart("/users");

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error loading users</p>;

    return (
        <div>
            <h1>CRUD with use-fetch-smart</h1>
            <LoginButton />

            <TestProtected />


            <CreateUser onCreated={refetch} />

            <ul>
                {data.map(user => (
                    <li key={user.id}>
                        {user.name} — {user.email}
                        <UpdateUser userId={user.id} onUpdated={refetch} />
                        <DeleteUser userId={user.id} onDeleted={refetch} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
