# use-fetch-smart

> A lightweight, TypeScript-friendly React data-fetching library with built-in caching, TTL, retries, and automatic token refresh.

[![npm version](https://img.shields.io/npm/v/use-fetch-smart.svg)](https://www.npmjs.com/package/use-fetch-smart) [![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/Zaidshaikh2811/use-fetch-smart)

---

## Install

```bash
npm install use-fetch-smart
# or
yarn add use-fetch-smart
```

## Quick Start

Wrap your app with `FetchSmartProvider` to configure `baseURL`, an initial `token`, retry limits, and a `refreshToken` function for 401 handling.

```tsx
import React from 'react';
import { FetchSmartProvider, FetchSmartDevtools } from 'use-fetch-smart';

const refreshToken = async () => {
  // call your refresh endpoint and return the new token or null
  return fetch('/auth/refresh')
    .then(r => r.json())
    .then(x => x.token)
    .catch(() => null);
};

export default function AppRoot() {
  return (
    <FetchSmartProvider
      config={{ baseURL: 'https://api.example.com', token: '', retryLimit: 3, refreshToken }}
    >
      <App />
      <FetchSmartDevtools />
    </FetchSmartProvider>
  );
}
```

## Hooks

use-fetch-smart exposes simple hooks for GET and mutation operations.

### useGetSmart(url, options)

Returns: `{ data, loading, error, refetch }`

Options:
- `cacheTimeMs` (number) — TTL for cache (default: 5 minutes)

Example:

```tsx
import { useGetSmart } from 'use-fetch-smart';

function Users() {
  const { data, loading, error, refetch } = useGetSmart('/users', { cacheTimeMs: 2 * 60 * 1000 });

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### Mutations

`usePostSmart(url)`, `usePutSmart(url)`, `useDeleteSmart(url)`

Each returns `{ mutate, data, loading, error }` where `mutate` performs the request and returns the response data.

Example POST:

```tsx
import { usePostSmart } from 'use-fetch-smart';

function CreateUser() {
  const { mutate, loading } = usePostSmart('/users');

  return (
    <button onClick={() => mutate({ name: 'Zaid' })} disabled={loading}>
      {loading ? 'Saving…' : 'Create User'}
    </button>
  );
}
```

## Features

- Memory + optional `localStorage` cache with TTL
- Automatic token refresh on 401 via a `refreshToken` function
- Automatic retries with exponential/backoff behavior for network and 5xx errors
- Devtools component to inspect cache and requests
- TypeScript-first API

## API Reference (short)

- `FetchSmartProvider(config)` — Provider with `{ baseURL, token?, retryLimit?, refreshToken? }`
- `useGetSmart<T>(url, { cacheTimeMs? })` — GET hook
- `usePostSmart<T, B>(url)` — POST mutation hook
- `usePutSmart<T, B>(url)` — PUT mutation hook
- `useDeleteSmart<T>(url)` — DELETE mutation hook
- `FetchSmartDevtools()` — Devtools panel component

## Notes

- For production, provide a robust `refreshToken` implementation and persist tokens securely.
- The package is framework-agnostic beyond React; only React hooks and components are exported.

## License

MIT © 2025

---
 
