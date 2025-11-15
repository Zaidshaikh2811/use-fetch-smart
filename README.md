## 🚀 use-fetch-smart

A smart React data-fetching library with caching, TTL, retries, token auto-refresh, and simple mutation hooks — designed to reduce boilerplate and make fetch-based code reliable and easy to maintain.

[![npm version](https://img.shields.io/npm/v/use-fetch-smart.svg)](https://www.npmjs.com/package/use-fetch-smart) [![license](https://img.shields.io/npm/l/use-fetch-smart.svg)]()

---

## Why use-fetch-smart?

- Single provider (`FetchSmartProvider`) to configure `baseURL`, token handling, retry limits and refresh logic.
- Hooks for GET and mutations (`useGetSmart`, `usePostSmart`, `usePutSmart`, `useDeleteSmart`).
- Layered cache (in-memory + optional IndexedDB persistence via `idb-keyval`).
- Automatic token refresh on 401 and request replay.
- Exponential backoff retry for transient errors.
- Small, focused API and TypeScript support.

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

See `CHANGELOG.md` for release history.

---

## License

MIT © 2025

---
 