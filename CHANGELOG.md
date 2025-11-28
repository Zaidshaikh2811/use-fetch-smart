# 📦 Changelog
All notable changes to **use-fetch-smart** are documented here.

This project follows [Semantic Versioning](https://semver.org/).

---

## [1.1.0] - 2025-11-28
### Added
- Schema validation support across hooks and prefetch flow (runtime validation via `validateWithSchema`). Specifically:
  - `usePostSmart`, `usePutSmart`, and `useDeleteSmart` now validate mutation responses when a schema is provided.
  - `useGetSmart` and the `prefetchSmart` helper validate GET responses when `schema`/`schemaMode` options are supplied.
  - Exported `validateWithSchema` helper (and formatted validation errors via `formatSchemaError`) for advanced usage and clearer error messages.
- `prefetchSmart` utility: background prefetch helper used by `useGetSmart`'s `prefetchNext` option.

### Changed
- `useGetSmart` now supports an optional `prefetchNext` callback which can return predicted URLs to prefetch after a successful fetch.
- Schema validation behavior: hooks accept a `schemaMode` option (default: `error`) —
  - `error` (default): validation failures throw with a formatted message.
  - `warn`: validation failures are logged as warnings and the raw data is returned.

### Fixed
- Export surface: explicitly re-exported runtime utilities so `cacheDriver`, `memoryCache`, and `indexedDBCache` are available from the package entrypoint (resolved duplicate type re-export collisions).
- Examples: fixed frontend `LoginButton` example (JSX/login flow) and updated example docs so the Vite frontend works with `FetchSmartProvider`.
- Removed noisy debug logging across runtime modules (notably `useGetSmart` and `cache/cacheDriver`).
- Gated IndexedDB logging so storage errors are only printed in non-production builds (`src/cache/indexedDBCache.ts`).
- Gated `FetchSmartDevtools` to avoid rendering in production and to prevent leaking internals (`src/FetchSmartDevtools.tsx`).

### Prefetch Improvements
- `prefetchSmart` implements:
  - Throttling to avoid excessive requests (`PREFETCH_THROTTLE_MS`).
  - Concurrency-limited scheduling (`MAX_PREFETCH_CONCURRENCY`) to prevent overwhelming the network.
  - Skips prefetch when offline or on very slow network connections (uses `navigator.connection.effectiveType`).
  - Avoids duplicated in-flight prefetches and checks cache (`cacheDriver.get`) before requesting.
  - Saves validated responses into the cache (honoring `ttlMs` and `persist`).
  - `cancelAllPrefetches()` helper to abort outstanding prefetches.

### Packaging & Docs
- Improved packaging metadata and npm-readme: added `README.npm.md`, updated `README.github.md`, and tuned `package.json` `files` to publish `dist/` only.
- Added `.npmignore` rules to avoid shipping source, examples, editor configs, and lockfiles with the published package.

### Notes
- The library's built package version in `package.json` is `1.0.13` (run `npm version` to align the package.json version with the changelog/release tag if you intend to publish this as `1.1.0`).

---

## [1.0.12-13] - 2025-11-15
### Updated Readme For better clarity and working  of Npm package

## [1.0.11] - 2025-11-15
### Added
- Documentation and examples: improved `README`, `README.npm.md`, and `examples/README.md` to reflect cache persistence and provider options.

### Fixed
- Removed noisy debug console output in runtime: `useGetSmart` and `cacheDriver` no longer emit casual logs.
- Gated IndexedDB error logging so errors are only printed in non-production builds.

### Changed
- `FetchSmartDevtools` is gated and will not render in production builds to avoid leaking internals or causing runtime noise.

### Improved
- Minor stability and resilience improvements in cache interactions and devtools inspection flows.

---

## [Unreleased]
### Added
- README: Added Provider setup example showing `refreshToken`, `retryLimit`, and `FetchSmartDevtools`.

### Fixed
- Clarified exports for axios helpers and token utilities.  
  *(Note: npm still shows version `1.0.3`; consider running `npm version patch` to sync with changelog.)*

### Improved
- Minor stability updates across `smartAxios`, cache handling, and devtools.

---

## [1.0.10] - 2025-11-15
### Added
- Release bump consolidating all cache refactors, examples, and documentation updates.

### Fixed
- Cache expiry edge cases and safer IndexedDB interactions.

### Improved
- Better interceptor retry logic and enhanced error handling.
- Expanded migration and usage documentation.

---

## [1.0.9] - 2025-11-15
### Improved
- Packaging improvements: ensured TypeScript definitions and build output include new cache modules.
- Updated `package.json` metadata: homepage, repository, keywords, and dependencies.

---

## [1.0.8] - 2025-11-15
### Added
- Persistent cache support using `idb-keyval` + IndexedDB.

### Changed
- Updated build artifacts to include new cache modules and related dependencies.

---

## [1.0.7] - 2025-11-14
### Added
- Expanded documentation: Provider setup, best practices, and performance optimization tips.

### Fixed
- Minor corrections in examples (hook usage, option names).

---

## [1.0.6] - 2025-11-14
### Added
- `examples/` folder including:
  - Minimal Express backend  
  - Vite React frontend using `FetchSmartProvider` + hooks  
- Added examples README with instructions.

### Improved
- Devtools: safer inspection of internal cache structures and better key display.

---

## [1.0.5] - 2025-11-14
### Added
- New layered caching system:
  - `memoryCache`
  - `indexedDBCache`
- Introduced `cacheDriver` for seamless read/write with per-entry persistence options.

### Improved
- Refactored cache internals:
  - Unified TTL handling (ms)
  - Cleaner, consistent `get/set` semantics

---

## [1.0.4] - 2025-11-14
### Added
- Exported `axiosInstance` and `setGlobalToken` for advanced control.
- `smartAxios` now supports `refreshTokenFn` for 401 token refresh + request replay.
- `FetchSmartProvider` now accepts `retryLimit` and `refreshToken`.
- Exposed internal axios instance via `useFetchSmartContext`.

### Fixed
- TTL sync issues between memory/localStorage and stale cache entries.
- Devtools guards for mismatched cache structure shapes.

### Improved
- Interceptor retry/backoff stability.
- Reduced unnecessary hook re-renders.
- Updated documentation (Provider + Devtools examples).

---

## [1.0.3] - 2025-11-13
### Added
- Full `useGetSmart` with TTL-based caching (`cacheTimeMs`).
- Auto token refresh architecture via `refreshTokenFn`.
- `FetchSmartDevtools` for cache & request debugging.

---

## [1.0.2] - 2025-11-13
### Added
- Added `usePostSmart`, `usePutSmart`, `useDeleteSmart`.

### Improved
- `smartAxios` interceptor reliability.

---

## [1.0.1] - 2025-11-13
### Added
- Initial `useGetSmart` implementation.
- Memory cache + localStorage persistence.
- Basic retry logic and error handling.

---

## [1.0.0] - 2025-11-12
### Initial Release
- Structured repository.
- Initial library setup, configs, and base architecture.

---
