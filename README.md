--

#  **use-fetch-smart**

> A smart, TypeScript-first data-fetching library for React with **caching**, **SWR**, **dedupe**, **auto-retry**, **token refresh**, **schema validation**, and the industry-first **predictive prefetching engine** — all in a lightweight API.

<p align="center">
<pre>
   __  __            __          __           _____                      __   
  / / / /___  ____  / /_  ____ _/ /____      / ___/____  ____ _________/ /__ 
 / / / / __ \/ __ \/ __ \/ __ `/ / ___/______\__ \/ __ \/ __ `/ ___/ _  / _ \
/ /_/ / /_/ / /_/ / /_/ / /_/ / / /__/_____/__/ / /_/ / /_/ / /__/  __/  __/
/_____/\____/\____/_.___/\__,_/_/\___/    /____/ .___/\__,_/\___/\___/\___/ 
                                              /_/                             
</pre>
</p>

---

<p align="left">

<img src="https://img.shields.io/npm/v/use-fetch-smart?color=blue&style=for-the-badge" />
<img src="https://img.shields.io/npm/dw/use-fetch-smart?style=for-the-badge&color=yellow" />
<img src="https://img.shields.io/bundlephobia/min/use-fetch-smart?style=for-the-badge&color=purple" />
<img src="https://img.shields.io/github/license/zaidshaikh2811/use-fetch-smart?style=for-the-badge&color=brightgreen" />
<img src="https://img.shields.io/github/stars/zaidshaikh2811/use-fetch-smart?style=for-the-badge&color=orange" />
<img src="https://img.shields.io/github/last-commit/zaidshaikh2811/use-fetch-smart?style=for-the-badge&color=red" />

</p>

---

#  Why use-fetch-smart?

React Query is powerful…
SWR is simple…
**use-fetch-smart is BOTH — plus features neither offer.**

### ✔ Zero-boilerplate GET/POST/PUT/DELETE

### ✔ Dual-layer caching (memory + IndexedDB)

### ✔ SWR baked in

### ✔ Auto request dedupe

### ✔ Automatic retry (exponential backoff)

### ✔ Token refresh with request replay

### ✔ Predictive prefetching (unique to this library)

### ✔ Schema validation (Zod/Yup/Valibot/custom)

### ✔ Devtools (free, built-in)

### ✔ Lightweight and framework-agnostic

---

#  use-fetch-smart vs React Query

| Feature                          | React Query        | **use-fetch-smart** |
| -------------------------------- | ------------------ | ------------------- |
| Simple GET/POST/PUT/DELETE hooks | ❌                  | ✅                   |
| Predictive Prefetching           | ❌                  | 🔥 **Yes**          |
| GET Request Deduping             | ⚠️ requires config | ✅ built-in          |
| Token Refresh                    | ❌                  | ✅ automatic         |
| Schema Validation                | ❌                  | ✅ built-in          |
| Memory Cache                     | ⚠️                 | ✅                   |
| IndexedDB Cache                  | ❌                  | ✅                   |
| Devtools                         | Paywalled on Pro   | FREE                |
| QueryClient Required             | Yes                | ❌ No                |
| SWR Mode                         | plugin             | built-in            |
| Setup                            | complex            | ultra-simple        |

If React Query is “enterprise mode”…
**use-fetch-smart is “smart mode”.**

---

#  Installation

```bash
npm install use-fetch-smart
# or
yarn add use-fetch-smart
```

---

#  Setup

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

#  Basic Fetch Example

```tsx
const { data, loading, error } = useGetSmart("/users", {
  cacheTimeMs: 60000,
  swr: true,
});
```

---

# Predictive Prefetching (Unique Feature)

Predict what user will need — fetch it early — without blocking UI.

```tsx
useGetSmart("/products?page=1", {
  prefetchNext: (data) => [
    { url: `/products?page=${data.nextPage}` },
    { url: `/products/summary`, ttlMs: 5000 },
  ],
});
```

### Prefetch Engine Flow

```
useGetSmart → success
      │
      ▼
prefetchNext() returns predictions
      │
      ▼
prefetchSmart()
      │
      ├─ throttle (200ms)
      ├─ max concurrency 3
      ├─ skip on slow 2G
      ├─ deduped background requests
      └─ never blocks UI
```

---

#  Mutations

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

---

#  Schema Validation

```tsx
useGetSmart("/profile", {
  schema: UserSchema,
  schemaMode: "error", // "warn" logs instead of throwing
});
```

Supports:

* Zod
* Yup
* Valibot
* Custom validators

---

#  Cache Architecture

```
useGetSmart → cacheDriver
       │
       ├── memoryCache (fastest)
       └── indexedDBCache (persistent)
```

### TTL Flow

```
cache.get()
│
├─ if expired → fetch new
├─ if fresh → return cached
└─ if persist → check IndexedDB
```

---

#  Devtools

Add this:

```tsx
<FetchSmartDevtools />
```

Shows:

✔ Cache keys
✔ TTL state
✔ Memory + IndexedDB contents
✔ In-flight dedupe keys
✔ Background prefetch queue
✔ SWR refresh events

Automatically disabled in production.

---

#  Architecture Diagram

```
          ┌────────────────────────┐
          │  FetchSmartProvider    │
          │ (axios, retry, refresh)│
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
  Cache hit → return instantly
      │
      ▼
   Axios fetch (with retry + refresh)
      │
      ▼
 Schema validation → Cache write
      │
      ▼
 Predictive prefetch engine
```

---
```

Docs include:

* Intro
* Installation
* useGetSmart
* Mutations
* SWR mode
* Cache system
* Prefetch engine
* Devtools
* API Reference

Start docs locally:

```bash
cd website
npm install
npm run start
```

---

#  Examples

```
examples/
  backend/   Express mock API
  frontend/  Vite React example
```

Run:

```bash
cd examples/backend && npm install && node server.js
cd ../frontend && npm install && npm run dev
```

---

#  Publishing

Only `/dist` is published.

Preview:

```bash
npm pack --dry-run
```

Includes:

* ES module build
* CJS build
* TypeScript declarations

---

#  Changelog

Check **CHANGELOG.md** for version history.

---

#  Contributing

PRs welcome.
Issues welcome.
Feature ideas welcome.
If you build something with this, tag the repo!

---

#  Support the project

If this library helped you, consider:

* starring the repo
* sharing on LinkedIn / X
* using it in your next project

---

# 🎉 Happy Fetching!

---
 