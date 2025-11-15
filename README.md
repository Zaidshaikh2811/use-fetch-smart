## 🚀 use-fetch-smart

A smart React data-fetching library with caching, TTL, retries, token auto-refresh, and simple mutation hooks — designed to remove repetitive boilerplate and make fetch-based code reliable and easy to maintain.

[![npm version](https://img.shields.io/npm/v/use-fetch-smart.svg)](https://www.npmjs.com/package/use-fetch-smart) [![npm downloads](https://img.shields.io/npm/dm/use-fetch-smart.svg)]() [![license](https://img.shields.io/npm/l/use-fetch-smart.svg)]()

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

Wrap your app with the `FetchSmartProvider` and provide a `refreshToken` function to enable automatic token refresh.

```tsx
import React from 'react';
import { FetchSmartProvider, FetchSmartDevtools } from 'use-fetch-smart';

const refreshToken = async () => {
  // return new token string or null
  const res = await fetch('/auth/refresh');
  if (!res.ok) return null;
  const json = await res.json();
  return json.token;
};

export default function AppRoot() {
  return (
    <FetchSmartProvider config={{ baseURL: 'http://localhost:4000', retryLimit: 3, refreshToken }}>
      <App />
      <FetchSmartDevtools />
    </FetchSmartProvider>
  );
}
```

---

## Core Hooks

- `useGetSmart<T>(url, { cacheTimeMs?, persist? })` — returns `{ data, loading, error, refetch }`.
- `usePostSmart<T, B>(url)` — returns `{ mutate, data, loading, error }`.
- `usePutSmart<T, B>(url)` — same shape as POST.
- `useDeleteSmart<T>(url)` — returns `{ mutate, data, loading, error }`.

Examples are shown in the `examples/` folder — see `examples/README.md`.

---

## Cache & Persistence

The library exposes a layered cache:

- `memoryCache` — extremely fast in-memory reads (default).
- `indexedDBCache` — persistent storage via `idb-keyval` (optional per-entry via `persist: true`).
- `cacheDriver` — unified API used internally and available for advanced use.

Use `cacheTimeMs` (TTL in ms) and `persist` to control storage and lifetime. The driver falls back to memory if IndexedDB is unavailable.

Example:

```tsx
useGetSmart('/settings', { cacheTimeMs: 10 * 60_000, persist: true });
```

---

## Devtools

Add `<FetchSmartDevtools />` inside the provider in development to inspect:

- Cached keys & values
- TTL remaining
- Request history and retry attempts

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
- After mutations, call `refetch()` on relevant queries or use `cacheManager.clear(key)` to invalidate.
- Keep `retryLimit` low for mutation endpoints to avoid duplicate side effects; prefer server idempotency.

Security:
- Prefer httpOnly cookies for tokens when possible. If using tokens in client code, handle them securely.

---

## API Reference (short)

- `FetchSmartProvider(config: { baseURL, token?, retryLimit?, refreshToken? })`
- `useGetSmart<T>(url, { cacheTimeMs?, persist? })`
- `usePostSmart<T, B>(url)`
- `usePutSmart<T, B>(url)`
- `useDeleteSmart<T>(url)`
- `FetchSmartDevtools()`
- `cacheManager` — programmatic cache operations
- `setGlobalToken(token)` — set token globally

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
 