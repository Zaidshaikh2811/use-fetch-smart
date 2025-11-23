
---

#  **use-fetch-smart**

> A TypeScript-first, battery-included React data-fetching library with **caching**, **TTL**, **retry with exponential backoff**, **automatic token refresh**, **schema validation**, **predictive prefetching**, and **simple mutation hooks** — all in one tiny API.

[![npm version](https://img.shields.io/npm/v/use-fetch-smart.svg)](https://www.npmjs.com/package/use-fetch-smart)
[![license](https://img.shields.io/npm/l/use-fetch-smart.svg)]()
[![bundle size](https://img.shields.io/bundlephobia/minzip/use-fetch-smart?label=gzip)]()
[![dependencies](https://img.shields.io/librariesio/release/npm/use-fetch-smart)]()

---

#  Why use-fetch-smart?

Because React Query + SWR are powerful…
…but sometimes you just need:

* simple hooks
* predictable cache behavior
* optional persistence
* framework-agnostic architecture
* *zero boilerplate* mutations
* and **predictive prefetching** that other libs don’t offer

###  Key Features

| Feature                                 | Supported  |
| --------------------------------------- | ---------- |
| In-memory cache                         | ✅          |
| IndexedDB persistence                   | ✅          |
| SWR (stale-while-revalidate)            | ✅          |
| Retry with exponential backoff          | ✅          |
| Auto token refresh (401)                | ✅          |
| Predictive prefetch engine              | **🔥 YES** |
| Schema validation (Zod/Yup/etc)         | ✅          |
| Deduped concurrent GET requests         | ✅          |
| AbortController for stale requests      | ✅          |
| Concurrency-limited background prefetch | **🔥 YES** |
| Low network detection (skip on 2G)      | 🔥         |
| Devtools for inspection                 | ✅          |

---

#  Installation

```bash
npm install use-fetch-smart
# or
yarn add use-fetch-smart
```

---

#  Quick Start

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
      <FetchSmartDevtools />
    </FetchSmartProvider>
  );
}
```

---

#  Fetch Example

```tsx
const { data, loading, error } = useGetSmart("/users", {
  cacheTimeMs: 60000,
  swr: true,
});
```

---

#  Predictive Prefetching

### **Your library's killer feature (unique).**

```tsx
useGetSmart("/products?page=1", {
  prefetchNext: (data) => [
    { url: `/products?page=${data.nextPage}` },
    { url: `/products/summary`, ttlMs: 5000 },
  ],
});
```

### Prefetch Engine Diagram 

```
useGetSmart → success
      │
      ▼
prefetchNext() → predicted URLs
      │
      ▼
prefetchSmart()
      │
      ├─ throttle
      ├─ max concurrency (3)
      ├─ online?
      ├─ slow network?
      ├─ cache exists?
      ├─ in-flight dedupe
      └─ queued background fetch
```

Prefetch NEVER blocks UI.
Prefetch NEVER overrides valid data.
Prefetch NEVER spams API.

---

#  Mutation Hooks

### POST

```tsx
const { mutate, loading } = usePostSmart("/login");
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

Schema validation also works for mutations.

---

# Schema Validation

Works with:

* Zod
* Yup
* Valibot
* custom validators

Example:

```tsx
useGetSmart("/profile", {
  schema: UserSchema,
  schemaMode: "error", // or "warn"
});
```

Error formatting handled internally with `formatSchemaError`.

---

#  Cache Architecture

### Layered design:

```
useGetSmart → cacheDriver
       │
       ├── memoryCache (fast)
       └── indexedDBCache (persist: true)
```

### TTL Flow:

```
cacheDriver.get()
     │
     ├─ if expired → ignore + fetch
     ├─ if fresh → return instantly
     └─ if persist: read from IndexedDB
```

Exports for advanced usage:

```ts
import {
  cacheDriver,
  memoryCache,
  indexedDBCache,
  setGlobalToken,
  axiosInstance
} from "use-fetch-smart";
```

---

#  Devtools

```
<FetchSmartDevtools />
```

Shows:

* Cache keys
* TTL status
* Memory + IndexedDB contents
* SWR refreshes
* Prefetch events

Auto-disabled in production builds.

---

# 🛠 Architecture (Full Diagram)

```
          ┌────────────────────────┐
          │  FetchSmartProvider    │
          │ (axios, refresh, retry)│
          └─────────────┬──────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  useGetSmart()   │
              └──────────────────┘
                        │
      ┌─────────────────┼──────────────────┐
      ▼                 ▼                  ▼
 Cache lookup      In-flight dedupe    Abort stale req
      │                 │                  │
      ▼                 ▼                  ▼
   Hit? → return     Shared Promise    Race-condition safe
      │                 │                  │
      ▼                 ▼                  ▼
        ┌────────────────────────────────┐
        │      Axios + Retry Logic       │
        └────────────────────────────────┘
                        │
                        ▼
              Schema validation (optional)
                        │
                        ▼
                 Cache write (TTL/persist)
                        │
                        ▼
               Predictive prefetch engine
```

---

#  Examples Included

```
examples/
  backend/   Express mock API
  frontend/  Vite React example app
```

Run:

```bash
cd examples/backend && npm install && node server.js
cd ../frontend && npm install && npm run dev
```

---

#  Publishing & Release Guide

* Only compiled files from `dist/` are published
* Type declarations included
* `.npmignore` strips examples, source, configs

Preview publish:

```bash
npm pack --dry-run
```

---

#  Changelog

Full history in:
 **`CHANGELOG.md`**

---

#  Contributing

PRs welcome.
Issues welcome.
Feature ideas welcome.

If you build something with this — tag the repo! 

---

#  Like the project?

If this saves you time, consider:

*  starring the repo
*  sharing on X / LinkedIn
*  using it in your next project

---
 
