## 🚀 use-fetch-smart

A smart React data-fetching library with caching, TTL, retries, token auto-refresh, and simple mutation hooks — designed to reduce boilerplate and make fetch-based code reliable and easy to maintain.

[![npm version](https://img.shields.io/npm/v/use-fetch-smart.svg)](https://www.npmjs.com/package/use-fetch-smart) [![license](https://img.shields.io/npm/l/use-fetch-smart.svg)]()

---

## What's New (v1.0.14)

- Schema validation for mutation hooks: `usePostSmart`, `usePutSmart`, and `useDeleteSmart` accept an optional `schema` + `schemaMode` to validate responses at runtime.
- Public exports improved: cache utilities (`cacheDriver`, `memoryCache`, `indexedDBCache`) and `validateWithSchema` are available from the package entrypoint for advanced use.
- Documentation and examples refreshed (npm README and GitHub README) and example frontend fixes applied.
- Devtools and debug logging: noisy logs removed and `FetchSmartDevtools` gated out in production builds.


## Why use-fetch-smart?

- Single provider (`FetchSmartProvider`) to configure `baseURL`, token handling, retry limits and refresh logic.
- Hooks for GET and mutations (`useGetSmart`, `usePostSmart`, `usePutSmart`, `useDeleteSmart`).
- Layered cache (in-memory + optional IndexedDB persistence via `idb-keyval`).
- Automatic token refresh on 401 and request replay.
- Exponential backoff retry for transient errors.
- Small, focused API and TypeScript support.

---

---

## 🎥 Demo Preview

A quick look at how **use-fetch-smart** behaves in real apps:

### 🔄 Auto Fetch + Loading State
<p align="center">
<img src="./assets/Untitled design (2).gif" width="500" />
</p>

### ⚡ Instant Response From Cache
<p align="center">
<img src="./assets/Untitled design (1).gif" width="500" />
</p>


### 🔁 Retry Logic in Action
<p align="center">
<img src="./assets/Untitled design.gif" width="500" />
</p>
---

## Installation

```bash
npm install use-fetch-smart
# or
yarn add use-fetch-smart
```

---

## Quick Start

Wrap your app with the `FetchSmartProvider` and provide a `refreshToken` function to enable automatic token refresh. Note: `FetchSmartDevtools` is intended for development use only — it is automatically gated out in production builds.

```tsx
import React from 'react';
import { FetchSmartProvider, FetchSmartDevtools } from 'use-fetch-smart';

const refreshToken = async () => {
  const res = await fetch('/auth/refresh');
  if (!res.ok) return null;
  const json = await res.json();
  return json.token;
};

export default function AppRoot() {
  return (
    <FetchSmartProvider config={{ baseURL: 'http://localhost:4000', retryLimit: 3, refreshToken }}>
      <App />
      {/* Devtools will render only in non-production builds */}
      <FetchSmartDevtools />
    </FetchSmartProvider>
  );
}
```

---

## Core Hooks

- `useGetSmart<T>(url, { cacheTimeMs?, persist?, swr? })` — returns `{ data, loading, error, refetch }`. Supports optional SWR-style background revalidation when `swr: true`.
- `usePostSmart<T, B>(url)` — returns `{ mutate, data, loading, error }`.
- `usePutSmart<T, B>(url)` — same shape as POST.
- `useDeleteSmart<T>(url)` — returns `{ mutate, data, loading, error }`.

Examples are available in the `examples/` folder — see `examples/README.md`.

---

## Cache & Persistence

The library uses a layered cache internally:

- `memoryCache` — in-memory store for fast reads.
- `indexedDBCache` — persistent storage via `idb-keyval` (used when `persist: true` is set on an entry).
- `cacheDriver` — internal unified API used by the hooks to read/write caches. (Advanced users can inspect `src/cache` files.)

Use `cacheTimeMs` (TTL in ms) and `persist` to control storage and lifetime. If IndexedDB is unavailable the driver falls back to memory.

Example:

```tsx
useGetSmart('/settings', { cacheTimeMs: 10 * 60_000, persist: true, swr: true });
```

---

## Devtools

`<FetchSmartDevtools />` helps inspect cached keys & values, TTLs, and the combined view of memory + IndexedDB. It is safe to include in your app during development; the component intentionally does not render in production builds.

---

## Examples (run locally)

The repo includes runnable examples (Express backend + Vite React frontend).

Backend (Express): `examples/backend` — simple `/users` CRUD API.

Frontend (Vite): `examples/frontend` — demonstrates provider setup and hooks usage.

Run the examples:

```powershell
# Backend
cd examples/backend
npm install
node server.js

# Frontend
cd examples/frontend
npm install
npm run dev
```

---

## Best Practices & Notes

- Tune `cacheTimeMs` per endpoint: short TTLs for frequently changing lists, longer TTLs for stable data.
- Use `persist: true` only when you need persistence across sessions (e.g., user preferences).
- After mutations, call `refetch()` on relevant queries or clear entries from the cache by inspecting `src/cache` utilities.
- Keep `retryLimit` low for mutation endpoints to avoid duplicate side effects; prefer server idempotency.

Security:
- Prefer httpOnly cookies for tokens when possible. If using tokens in client code, handle them securely.

---

## API Reference (short)

- `FetchSmartProvider(config: { baseURL, token?, retryLimit?, refreshToken? })`
- `useGetSmart<T>(url, { cacheTimeMs?, persist?, swr? })`
- `usePostSmart<T, B>(url)`
- `usePutSmart<T, B>(url)`
- `useDeleteSmart<T>(url)`
- `FetchSmartDevtools()` — development-only UI (gated in production)
- `setGlobalToken(token)` — set token globally (via exported helper)

---

## Contributing

Contributions welcome — open issues or PRs. Please follow standard GitHub workflow: fork, branch, test, PR.

---

## Changelog
## 🚀 use-fetch-smart

A smart, TypeScript-first React data-fetching library with caching, TTL, retries, optional schema validation, and automatic token refresh. It provides small, composable hooks and a single provider to configure network and auth behavior.

[![npm version](https://img.shields.io/npm/v/use-fetch-smart.svg)](https://www.npmjs.com/package/use-fetch-smart) [![license](https://img.shields.io/npm/l/use-fetch-smart.svg)]()

---

## What's New (v1.0.13)

- Optional runtime schema validation for mutation hooks: pass a `schema` (e.g., Zod) and `schemaMode` to `usePostSmart`, `usePutSmart`, and `useDeleteSmart` to validate responses.
- Public exports improved: `cacheDriver`, `memoryCache`, `indexedDBCache`, and `validateWithSchema` are available from the package entrypoint for advanced usages.
- Docs and examples refreshed; frontend example fixes applied.
- Developer ergonomics: removed noisy debug logs and gated `FetchSmartDevtools` from production builds.

---

## Why use-fetch-smart?

- Single provider (`FetchSmartProvider`) to configure `baseURL`, token handling, retry limits and optional `refreshToken` logic.
- Small hooks for GET and mutations with built-in caching and optional persistence.
- Layered cache (in-memory + optional IndexedDB persistence via `idb-keyval`) with TTLs.
- Optional schema validation for mutation responses (integrates easily with Zod or other runtime validators).
- Automatic token refresh on 401 and request replay with retry/backoff logic.

---

## Installation

```bash
npm install use-fetch-smart
# or
yarn add use-fetch-smart
```

Peer dependencies: `react` and `react-dom` (>=17).

---

## Quick Start

Wrap your app with `FetchSmartProvider` and pass a `refreshToken` function to enable automatic token refresh.

```tsx
import React from 'react';
import { FetchSmartProvider, FetchSmartDevtools } from 'use-fetch-smart';

const refreshToken = async () => {
  const res = await fetch('/auth/refresh');
  if (!res.ok) return null;
  const json = await res.json();
  return json.token;
};

export default function AppRoot() {
  return (
    <FetchSmartProvider config={{ baseURL: 'http://localhost:4000', retryLimit: 3, refreshToken }}>
      <App />
      {/* Devtools render only in non-production builds */}
      <FetchSmartDevtools />
    </FetchSmartProvider>
  );
}
```

---

## Core Hooks

- `useGetSmart<T>(url, { cacheTimeMs?, persist?, swr? })` — returns `{ data, loading, error, refetch }`.
  - `cacheTimeMs` — TTL in milliseconds.
  - `persist` — write to IndexedDB (optional per-entry).
  - `swr` — stale-while-revalidate background revalidation.

- `usePostSmart<T, B>(url, { schema?, schemaMode? })` — returns `{ mutate, data, loading, error }`.
  - `schema` — optional runtime validator (e.g. Zod) to validate response.
  - `schemaMode` — `"error" | "warn"` controlling behavior on validation failure.
- `usePutSmart<T, B>(url, { schema?, schemaMode? })` — same shape as POST.
- `useDeleteSmart<T>(url, { schema?, schemaMode? })` — same shape as POST/PUT.

See the `examples/` folder for runnable demos demonstrating provider setup, caching, and schema validation.

---

## Cache & Persistence

The library uses a layered cache internally:

- `memoryCache` — in-memory store for fast reads.
- `indexedDBCache` — persistent storage via `idb-keyval` when `persist: true` is used.
- `cacheDriver` — unified API used by hooks: reads from IndexedDB when requested and falls back to memory.

Programmatic utilities exported from the package entrypoint:

- `cacheDriver`, `memoryCache`, `indexedDBCache` — advanced cache operations and inspection.
- `validateWithSchema` — helper used internally for schema validation (available for advanced usage).
- `setGlobalToken(token)` — set or replace the auth token globally.

Example:

```tsx
useGetSmart('/settings', { cacheTimeMs: 10 * 60_000, persist: true, swr: true });
```

---

## Devtools

`<FetchSmartDevtools />` provides a compact development UI to inspect cached entries and TTLs. It is safe to include in your app during development; the component is intentionally gated and will not render in production builds.

---

## Examples (run locally)

Includes runnable examples: an Express backend and a Vite React frontend.

```powershell
# Backend
cd examples/backend
npm install
node server.js

# Frontend
cd examples/frontend
npm install
npm run dev
```

---

## Best Practices & Notes

- Choose `cacheTimeMs` according to how often the endpoint changes.
- Use `persist: true` only when you need cross-session caching (e.g., user preferences).
- After mutations, call `refetch()` or clear the related cache keys to keep UI consistent.
- Keep `retryLimit` low for mutation endpoints to avoid duplicated side effects.

Security: prefer httpOnly cookies for tokens; if using tokens in client-side code, handle them carefully.

---

## API Reference (short)

- `FetchSmartProvider(config: { baseURL, token?, retryLimit?, refreshToken? })`
- `useGetSmart<T>(url, { cacheTimeMs?, persist?, swr? })`
- `usePostSmart<T, B>(url, { schema?, schemaMode? })`
- `usePutSmart<T, B>(url, { schema?, schemaMode? })`
- `useDeleteSmart<T>(url, { schema?, schemaMode? })`
- `FetchSmartDevtools()` — development-only UI (gated in production)
- `setGlobalToken(token)` — set token globally

---

## Changelog

See `CHANGELOG.md` for release history (v1.0.13 includes schema validation, exports, docs, and example fixes).

---

## Contributing

Contributions are welcome — open issues or PRs. Please follow the standard GitHub workflow.

---

## License

MIT © 2025
