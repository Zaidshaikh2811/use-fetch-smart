# **use-fetch-smart**

> A lightweight, TypeScript-first React data-fetching layer with **caching**, **TTL**, **SWR**, **predictive prefetching**, **schema validation**, **automatic token refresh**, **retry logic**, and **in-flight request dedupe** — powered by an elegant, minimal API.

![npm](https://img.shields.io/npm/v/use-fetch-smart)
![downloads](https://img.shields.io/npm/dm/use-fetch-smart)
![size](https://img.shields.io/bundlephobia/minzip/use-fetch-smart?label=gzip)
![types](https://img.shields.io/npm/types/use-fetch-smart)
![license](https://img.shields.io/npm/l/use-fetch-smart)

---

#  Why choose **use-fetch-smart**?

Most data-fetching libraries are:

- ❌ **Too heavy** — React Query ≈ 60kb  
- ❌ **Too complex** — SWR + many plugins  
- ❌ **Too limited** — simple wrappers, no caching

### **use-fetch-smart = React Query power → SWR simplicity → Axios reliability**

| Feature                                | Included   |
| -------------------------------------- | ---------- |
| SWR (stale-while-revalidate)           | ✅          |
| Memory cache                           | ✅          |
| IndexedDB persistence                  | ✅          |
| In-flight GET/POST/PUT/DELETE dedupe   | ✅          |
| Retry with exponential backoff         | ✅          |
| Automatic token refresh                | ✅          |
| Schema validation (Zod/Yup/Valibot)    | ✅          |
| Predictive prefetch engine             | **🔥 YES** |
| Background concurrency queue           | **🔥 YES** |
| AbortController support                | ✅          |
| Devtools for cache inspection          | ✅          |

Perfect for **dashboards**, **admin panels**, **SaaS apps**, **CRMs**, apps with **frequent API fetches**, and everything needing performance & reliability.

---

#  Install

```bash
npm install use-fetch-smart
# or
yarn add use-fetch-smart
````

**Peer dependencies:**

* `react >= 17`
* `react-dom >= 17`

**Internal utilities:**

* `axios`
* `idb-keyval` (only when persistence is enabled)

---

#  Quick Setup

```tsx
import { FetchSmartProvider, FetchSmartDevtools } from "use-fetch-smart";

const refreshToken = async () => {
  const res = await fetch("/auth/refresh");
  if (!res.ok) return null;
  return (await res.json()).token;
};

export default function Root() {
  return (
    <FetchSmartProvider
      config={{
        baseURL: "http://localhost:4000",
        retryLimit: 3,
        refreshToken,
      }}
    >
      <App />
      <FetchSmartDevtools /> {/* Devtools enabled only in development */}
    </FetchSmartProvider>
  );
}
```

---

#  Basic GET Example

```tsx
const { data, loading, error } = useGetSmart("/users", {
  cacheTimeMs: 10_000,
  swr: true,
});
```

---

#  Predictive Prefetching (Unique Feature)

Automatically preload “future” data your user will likely need.

```tsx
useGetSmart("/products?page=1", {
  prefetchNext: (data) => [
    { url: `/products?page=${data.nextPage}` },
    { url: "/products/summary", ttlMs: 5000 },
  ],
});
```

### Prefetch Architecture

```
success → prefetchNext → queue → throttle → network check → dedupe → run
```

Prefetching never blocks UI, and never overwrites fresh cache.

---

#  Mutation Hooks

### POST

```tsx
const { mutate } = usePostSmart("/login");
mutate({ email, password });
```

### PUT

```tsx
usePutSmart("/profile").mutate({ theme: "dark" });
```

### DELETE

```tsx
useDeleteSmart("/users/42").mutate();
```

Built-in:

* schema validation
* retry logic
* dedupe
* token refresh

---

# Schema Validation

```tsx
useGetSmart("/user", {
  schema: UserSchema,
  schemaMode: "error", // or "warn"
});
```

Validation supports:

* **Zod**
* **Yup**
* **Valibot**
* Custom validators

---

#  Hook API

### `useGetSmart<T>(url, options?)`

Returns:

```ts
{
  data: T | null,
  loading: boolean,
  error: any,
  refetch: () => Promise<void>
}
```

Options include:

* `cacheTimeMs`
* `persist`
* `swr`
* `schema`
* `schemaMode`
* `prefetchNext`

---

#  Cache Architecture

```
useGetSmart
    ↓
cacheDriver.get()
    ├── memoryCache
    └── indexedDBCache (if persist enabled)
```

Writes go to **memory** and **IndexedDB** (if enabled).

---

#  Devtools

```tsx
<FetchSmartDevtools />
```

Shows:

* Memory cache
* IndexedDB cache
* TTL timers
* Cache keys
* In-flight deduped requests

Automatically disabled in **production**.

---

#  Internal Workflow

### Request lifecycle

```
read cache → SWR check → abort stale → dedupe → axios request → schema validate → cache write → prefetch queue
```

### Prefetch queue workflow

```
throttle → concurrency limit → dedupe → network check → execute
```

---

# Example Projects

Included in `/examples`:

```
backend/   → Express mock API
frontend/  → Vite-based React demo
```

Run:

```bash
cd examples/backend && npm install && node server.js
cd ../frontend && npm install && npm run dev
```

---

#  Publishing Notes (NPM)

* Only **dist/** is published
* TypeScript types included
* Examples/configs excluded via `.npmignore`
* Validate before publishing:

```bash
npm pack --dry-run
```

---

#  Troubleshooting

### Data not updating?

Enable SWR:

```ts
swr: true
```

### Too many validation errors?

Use warn mode:

```ts
schemaMode: "warn"
```

---

#  Contributing

PRs, issues, and feature requests are welcome!

If you like this package, please ⭐ the repo — it helps a lot ❤️

---

#  SEO Keywords (for NPM & GitHub)

```
react fetch
react query alternative
swr alternative
react axios hook
react caching hook
react ttl cache
predictive prefetch
react hooks api
axios wrapper react
react data fetching library
token refresh react
react retry fetch
abortcontroller react hook
idb indexeddb cache react
typescript fetch hooks
```

---

#  License

MIT © 2025 — **use-fetch-smart**

```

