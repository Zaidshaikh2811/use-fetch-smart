#  **use-fetch-smart**

### A lightweight React data-fetching library with caching, TTL, retries, token auto-refresh & simple mutation hooks.

[![npm version](https://img.shields.io/npm/v/use-fetch-smart.svg)](https://www.npmjs.com/package/use-fetch-smart)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/zaidshaikh2811)

---

#  Features

###  **Smart GET Hook — `useGetSmart`**

* Auto state: `data`, `loading`, `error`
* Built-in caching (memory + optional persist)
* Cache expiry using TTL (`cacheTimeMs`)
* Auto retry with exponential backoff
* Auto refresh token support (401 handler)
* Fully typesafe with generics

###  **Simple Mutation Hooks**

* `usePostSmart`
* `usePutSmart`
* `useDeleteSmart`

Each includes:

* `mutate()`
* `loading`, `error`, `data`
* Same retry logic & token refresh

###  **Global Provider**

Configure once:

* `baseURL`
* `token`
* retry count
* refresh token function

###  **Devtools Panel**

Debug:

* cache contents
* requests
* responses
* retry attempts
* TTL values

---

#  Installation

```bash
npm install use-fetch-smart
# or
yarn add use-fetch-smart
```

#  GET Example — `useGetSmart`

```tsx
import { useGetSmart } from "use-fetch-smart";

const Users = () => {
  const { data, loading, error, refetch } = useGetSmart<User[]>("/users", {
    cacheTimeMs: 5 * 60 * 1000, // cache for 5 minutes
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;

  return (
    <div>
      <button onClick={refetch}>Refetch</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
```

### ✔ What this does:

* Checks cache
* If expired or missing → fetches new data
* Applies TTL
* Stores results in memory/localStorage
* Auto retries failed requests
* Automatically refreshes token on 401

---

#  POST — `usePostSmart`

```tsx
import { usePostSmart } from "use-fetch-smart";

export default function CreateUser() {
  const { mutate, loading, data } = usePostSmart<User, { name: string }>("/users");

  return (
    <button
      disabled={loading}
      onClick={() => mutate({ name: "Zaid" })}
    >
      {loading ? "Saving..." : "Create User"}
    </button>
  );
}
```

---

#  PUT — `usePutSmart`

```tsx
const { mutate, loading } = usePutSmart<User, { name: string }>(
  `/users/${id}`
);

mutate({ name: "Updated User" });
```

---

# DELETE — `useDeleteSmart`

```tsx
const { mutate } = useDeleteSmart(`/users/${id}`);

<button onClick={() => mutate()}>Delete</button>;
```

---

#  Cache Time (TTL)

You control how long data stays cached:

```ts
useGetSmart("/products", { cacheTimeMs: 30000 }); // 30 seconds
```

If a request is made again within 30 seconds → returns cached result instantly.
After expiry → triggers a new API call.

---

#  Auto Token Refresh

When the server returns **401**, your Axios instance:

1. Calls `refreshToken()`
2. Updates global token
3. Retries the original request with the *new* token

No work required inside components. 🎉

---

#  Retry Logic

Retries for:

* Network errors
* 5xx server errors

Algorithm:

```
retry 1 → wait 500ms
retry 2 → wait 1000ms
retry 3 → wait 1500ms
```

---

#  Devtools Panel

Add anywhere inside the provider:

```tsx
<FetchSmartDevtools />
```

Shows:

* Cache keys
* Cache values
* TTL status
* Request history
* Errors & retries

---

#  API Reference

### `useGetSmart(url, options)`

| Option           | Type     | Description                  |
| ---------------- | -------- | ---------------------------- |
| `cacheTimeMs`    | number   | Cache expiry (default 5 min) |
| `baseURL`        | string   | Override provider baseURL    |
| `refreshTokenFn` | function | refresh token handler        |

### Mutations

* `usePostSmart(url)`
* `usePutSmart(url)`
* `useDeleteSmart(url)`

Each returns:

```ts
{
  mutate: (body?) => Promise<T>,
  loading: boolean,
  error: any,
  data: T | null
}
```

#  Enjoying use-fetch-smart?

Leave a star on GitHub and support development! 🚀

---

