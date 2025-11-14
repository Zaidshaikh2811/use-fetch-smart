# 🚀 **use-fetch-smart**

### A smart React data-fetching library with **caching**, **retry logic**, **TTL**, **auto token refresh**, and simple **mutation hooks**.

[![npm version](https://img.shields.io/npm/v/use-fetch-smart.svg)](https://www.npmjs.com/package/use-fetch-smart)
[![npm downloads](https://img.shields.io/npm/dm/use-fetch-smart.svg)]()
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/zaidshaikh2811/use-fetch-smart)
[![license](https://img.shields.io/npm/l/use-fetch-smart.svg)]()

---

# ✨ Why use-fetch-smart?

`use-fetch-smart` replaces axios boilerplate with a **clean, modern, production-ready React data layer**.

It gives you:

⚡ **Smart GET hook**
⚡ **Mutation hooks** (POST, PUT, DELETE)
⚡ **Caching + TTL expiry**
⚡ **Auto retry with exponential backoff**
⚡ **Auto token refresh** (401 handling)
⚡ **Global Fetch Provider**
⚡ **Beautiful Devtools panel**
⚡ **TypeScript-first design**

Stop repeating loading/error/spinner logic.
Stop writing token refresh logic 100 times.
Stop managing cache manually.

**Let the library do it for you.**

---

# 🎥 Demo (GIFs)

| Feature                        | GIF                  |
| ------------------------------ | -------------------- |
| 🔄 Auto fetch + loading state  | `demo-loading.gif`   |
| ⚡ Instant response from cache  | `demo-cache.gif`     |
| 🔁 Retry logic in action       | `demo-retry.gif`     |
| 🔐 Token auto refresh          | `demo-token.gif`     |
| 🎛 Devtools panel              | `demo-devtools.gif`  |
| ✏️ Mutations (POST/PUT/DELETE) | `demo-mutations.gif` |

---

# 📦 Installation

```bash
npm install use-fetch-smart
# or
yarn add use-fetch-smart
```

---

# 🔧 Provider Setup

Wrap your app with `FetchSmartProvider` to provide a configured axios instance and optional token refresh handling.

```tsx
import { FetchSmartProvider, FetchSmartDevtools } from "use-fetch-smart";

const refreshToken = async () => {
  // your refresh logic here — return new token string or null
  return await fetch("/auth/refresh").then(r => r.json()).then(x => x.token).catch(() => null);
};

<FetchSmartProvider
  config={{
    baseURL: "https://api.example.com",
    token: "initial-token",
    refreshToken, // automatically called on 401
    retryLimit: 3,
  }}
>
  <App />
  <FetchSmartDevtools />
</FetchSmartProvider>
```

You can also import the lower-level utilities for advanced use:

```ts
import { axiosInstance, cacheManager, setGlobalToken } from "use-fetch-smart";
```

---

---

# 📥 Fetch Data — `useGetSmart`

```tsx
import { useGetSmart } from "use-fetch-smart";

const Users = () => {
  const { data, loading, error, refetch } = useGetSmart<User[]>("/users", {
    cacheTimeMs: 2 * 60 * 1000, // cache for 2 minutes
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong 😢</p>;

  return (
    <div>
      <button onClick={refetch}>Refetch</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
```

### 🔥 Features in this example:

* Reads from cache instantly
* Auto refresh when TTL expires
* Smart retry logic
* Token auto refresh

---

# ✏️ Mutations

## POST — `usePostSmart`

```tsx
const { mutate, loading } = usePostSmart<User, { name: string }>("/users");

mutate({ name: "Zaid" })
  .then(() => alert("User created!"))
  .catch(console.error);
```

---

## PUT — `usePutSmart`

```tsx
const { mutate } = usePutSmart<User, { name: string }>(`/users/${id}`);

mutate({ name: "Updated User" });
```

---

## DELETE — `useDeleteSmart`

```tsx
const { mutate } = useDeleteSmart(`/users/${id}`);

<button onClick={() => mutate()}>Delete User</button>
```

---

# 🎛 Devtools

Add this inside provider:

```tsx
<FetchSmartDevtools />
```

You get a mini panel showing:

* Cached keys
* Cached values
* Every GET/POST call
* Retry count
* Status codes
* TTL time remaining

This helps diagnose behavior instantly when developing.

---

# 🔥 Features Breakdown

### ✔ Smart cache

Uses memory + TTL expiry
(Cache layering: memory → fallback → optional persistence).

### ✔ Token auto-refresh

401?
→ Calls your `refreshToken()`
→ Replays the request with the new token
→ No manual logic needed

### ✔ Retry logic

Handles:

* Network errors
* Server errors (5xx)

### ✔ Mutation hooks

No more repetitive code for:

* loading states
* error handling
* manual axios calls

### ✔ TypeScript Support

All hooks support generics:

```ts
const { data } = useGetSmart<User[]>("/users");
```

---

# 🧠 Why Developers Love This Library?

Because it solves **real-world** problems every dev faces:

* API calling boilerplate
* Managing state for each fetch
* Caching + invalidation
* Token refresh
* Retry logic
* Handling global config
* Making code clean & maintainable

It's small, clean, and does a LOT.

---
 # 📚 Examples

Real-world examples are included to help you understand and use the library instantly — no guessing, no confusion.

### 🚀 **React Basic Example**
A minimal React setup showing:
- `FetchSmartProvider` configuration  
- GET requests using `useGetSmart`  
- Mutations (POST / PUT / DELETE)  
- Refetching + loading states  

📂 **Path:** [`examples/frontend`](./examples/frontend)

---

### 🖥️ **Backend Example (Express)**
A tiny backend to test real API calls with:
- GET `/users`
- POST `/users`
- PUT `/users/:id`
- DELETE `/users/:id`

Perfect for local testing and understanding request flow.

📂 **Path:** [`examples/backend`](./examples/backend)

---

### 🧪 **Try the Examples**

```bash
# React example
cd examples/react-basic
npm install
npm start

# Backend example
cd examples/backend
npm install
npm run dev

```

# 📁 Folder Structure

```
src/
  useGetSmart.ts
  usePostSmart.ts
  usePutSmart.ts
  useDeleteSmart.ts
  FetchSmartProvider.tsx
  cache.ts
  smartAxios.ts
  FetchSmartDevtools.tsx
  index.ts
```

---

# 📝 License

MIT © 2025

---

# ⭐ Like the project?

### Give it a star on GitHub — it helps A LOT ❤️

👉 [https://github.com/zaidshaikh2811/use-fetch-smart](https://github.com/zaidshaikh2811/use-fetch-smart)

---
