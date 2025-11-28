<h1 align="center">use-fetch-smart</h1>
<p align="center">Smart, cached, resilient, TypeScript-first data fetching for React</p>

<p align="center">
  <img width="380" src="https://dummyimage.com/600x200/1a1a1a/ffffff&text=use-fetch-smart" />
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/use-fetch-smart?style=flat-square&color=blue" />
  <img src="https://img.shields.io/npm/dm/use-fetch-smart?style=flat-square" />
  <img src="https://img.shields.io/bundlephobia/minzip/use-fetch-smart?style=flat-square&label=bundle+size" />
  <img src="https://img.shields.io/codecov/c/github/Zaidshaikh2811/use-fetch-smart?style=flat-square" />
  <img src="https://img.shields.io/github/stars/Zaidshaikh2811/use-fetch-smart?style=flat-square" />
  <img src="https://img.shields.io/github/license/Zaidshaikh2811/use-fetch-smart?style=flat-square" />
</p>


---

##  NPM Description

**Smart data fetching for React with memory + IndexedDB caching, SWR, retries, token refresh, schema validation, predictive prefetching, and built-in DevTools.**

---

##  Overview

**use-fetch-smart** is a powerful data-fetching library for React engineered for real-world apps.  
It provides:

- Smart caching (memory + IndexedDB)
- SWR (stale-while-revalidate) support
- Request deduplication
- Automatic retry & exponential backoff
- Full mutation support (POST, PUT, DELETE)
- Token auto-refresh & request replay
- Predictive prefetching engine
- Schema validation (Zod / Yup / Valibot / custom)
- Built-in Developer Tools

---

## Quick Start

```ts
const { data, loading, error } = useGetSmart("/users");
````

---

##  Installation

```bash
npm install use-fetch-smart
# or
yarn add use-fetch-smart
```

---

##  Setup

Wrap your app with the provider:

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
      <FetchSmartDevtools /> {/* Optional in dev */}
    </FetchSmartProvider>
  );
}
```

---

## Basic Usage

### GET Request

```ts
const { data, loading, error } = useGetSmart("/users", {
  cacheTimeMs: 60000,
  swr: true,
});
```

### POST Request

```ts
const { mutate } = usePostSmart("/login");
mutate({ email, password });
```

### PUT / DELETE

```ts
usePutSmart("/update-user");
useDeleteSmart("/remove-user");
```

---

##  Predictive Prefetching

```ts
useGetSmart("/products?page=1", {
  prefetchNext: (data) => [
    { url: `/products?page=${data.nextPage}` },
    { url: `/products/summary`, ttlMs: 5000 },
  ],
});
```

---

## Schema Validation

```ts
import { UserSchema } from "./schemas";

const { data } = useGetSmart("/profile", {
  schema: UserSchema,
  schemaMode: "error",
});
```

Supports: **Zod, Yup, Valibot, custom validators**.

---

##  API Reference

| Hook                 | Method    | Purpose                          |
| -------------------- | --------- | -------------------------------- |
| `useGetSmart`        | GET       | Fetch with cache, SWR, dedupe    |
| `usePostSmart`       | POST      | Mutations                        |
| `usePutSmart`        | PUT       | Mutations                        |
| `useDeleteSmart`     | DELETE    | Mutations                        |
| `useSmart`           | Any       | Low-level full control           |
| `FetchSmartProvider` | Provider  | Global config                    |
| `FetchSmartDevtools` | Component | Inspect cache, TTL, dedupe state |

---

##  How it Works

1. Checks **memory cache**
2. If expired → checks **IndexedDB**
3. If miss → HTTP request with retry + dedupe
4. Validates schema
5. Updates caches
6. Triggers SWR or prefetch (if enabled)

---

##  Comparison

| Feature                      | use-fetch-smart | SWR       | TanStack Query |
| ---------------------------- | --------------- | --------- | -------------- |
| Token auto-refresh           | ✅               | ❌         | ❌              |
| Request replay after refresh | ✅               | ❌         | ❌              |
| IndexedDB cache              | ✅               | ❌         | ⚠️ Plugin      |
| Predictive prefetching       | ✅               | ❌         | ❌              |
| Schema validation            | ✅               | ⚠️ Plugin | ⚠️ Plugin      |
| Built-in devtools            | ✅               | ⚠️        | ⚠️             |
| Boilerplate required         | Minimal         | Medium    | High           |

---

##  Error Handling

```tsx
const { error, retry } = useGetSmart("/data", { retryLimit: 3 });

if (error)
  return (
    <>
      <p>Failed to load data.</p>
      <button onClick={retry}>Retry</button>
    </>
  );
```

##  Devtools

```tsx
<FetchSmartDevtools />
```

Shows:

* cache entries
* TTL timers
* request dedupe keys
* prefetch queue
* SWR events

---

##  Folder Structure

```
/src
  /core
  /hooks
  /cache
  /utils
  /schemas
/examples
```

---

##  Example Project Included

```bash
cd examples/backend && npm install && node server.js  
cd ../frontend && npm install && npm run dev  
```

---

##  Contributing

Pull requests and suggestions are welcome!

 If you like this package, please star the repo — it helps a lot.

---

##  License

MIT License © 2025 Zaid Shaikh

```