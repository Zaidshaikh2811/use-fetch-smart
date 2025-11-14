# Examples — use-fetch-smart

This folder contains reference examples showing how to use `use-fetch-smart` with a simple Express backend and a React frontend. The examples are minimal and focused on demonstrating the `FetchSmartProvider`, `useGetSmart`, and mutation hooks (`usePostSmart`, `usePutSmart`, `useDeleteSmart`).

Quick contents:
- Backend: minimal Express API with `/users` endpoints
- Frontend: React app examples showing provider setup and hook usage

---

## 1) Backend (Express) — quick example

This example shows a very small Express server exposing CRUD for `/users`. It's intentionally minimal for demonstration only.

Create a directory `examples/backend` and add `server.js` with the code below.

server.js

```js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

let users = [ { id: 1, name: 'Zaid' } ];

app.get('/users', (req, res) => {
	res.json(users);
});

app.post('/users', (req, res) => {
	const id = users.length ? users[users.length - 1].id + 1 : 1;
	const user = { id, ...req.body };
	users.push(user);
	res.status(201).json(user);
});

app.put('/users/:id', (req, res) => {
	const id = Number(req.params.id);
	users = users.map(u => (u.id === id ? { ...u, ...req.body } : u));
	res.json(users.find(u => u.id === id));
});

app.delete('/users/:id', (req, res) => {
	const id = Number(req.params.id);
	users = users.filter(u => u.id !== id);
	res.status(204).end();
});

app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
```

Install and run the server:

```powershell
cd examples/backend
npm init -y
npm install express body-parser
node server.js
```

The server will run at `http://localhost:4000`.

---

## 2) Frontend (React) — provider + hooks example

This example demonstrates integrating `use-fetch-smart` in a React app. The frontend assumes the backend above is running at `http://localhost:4000`.

Create a React app (you can use Vite or Create React App). Example with Vite:

```powershell
cd examples
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install use-fetch-smart axios
```

Now update the app to use `FetchSmartProvider` and hooks.

src/main.tsx (or index.tsx)

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { FetchSmartProvider } from 'use-fetch-smart'

const refreshToken = async () => null // demo: no real refresh

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<FetchSmartProvider config={{ baseURL: 'http://localhost:4000', retryLimit: 3, refreshToken }}>
			<App />
		</FetchSmartProvider>
	</React.StrictMode>
)
```

src/App.tsx — use hooks

```tsx
import React from 'react'
import { useGetSmart, usePostSmart, useDeleteSmart } from 'use-fetch-smart'

function UsersList() {
	const { data, loading, error, refetch } = useGetSmart('/users', { cacheTimeMs: 30_000 })

	const { mutate: createUser, loading: creating } = usePostSmart('/users')
	const { mutate: deleteUser } = useDeleteSmart('/users')

	if (loading) return <div>Loading…</div>
	if (error) return <div>Error</div>

	return (
		<div>
			<button onClick={() => createUser({ name: 'New User' }).then(refetch)} disabled={creating}>Create</button>
			<button onClick={refetch}>Refresh</button>
			<ul>
				{data?.map((u: any) => (
					<li key={u.id}>
						{u.name}
						<button onClick={() => deleteUser(`/users/${u.id}`).then(refetch)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default function App() {
	return (
		<div style={{ padding: 20 }}>
			<h1>Users</h1>
			<UsersList />
		</div>
	)
}
```

Run the frontend:

```powershell
cd examples/frontend
npm run dev
```

Open the dev server (usually `http://localhost:5173` for Vite) and you should see the users list powered by the Express backend.

---

## Notes & tips

- The snippets above are intentionally minimal. For production apps, handle tokens securely, use HTTPS, and implement proper refresh flows.
- `useGetSmart` accepts `cacheTimeMs` (TTL in ms). Mutations return the response data through `mutate()` and keep simple `loading`/`error` states.
- If you change the backend port or domain, update `baseURL` in `FetchSmartProvider` accordingly.
- To inspect the cache in development, add `<FetchSmartDevtools />` anywhere inside the provider.

---
