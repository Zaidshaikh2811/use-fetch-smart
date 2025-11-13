# 📦 Changelog
All notable changes to **use-fetch-smart** will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]
### Added
- README: Provider setup example showing `refreshToken` + `retryLimit` and `FetchSmartDevtools` usage.

### Fixed
- Clarified exports and utilities (exports for axios helper and token utilities). Note: `package.json` still shows `1.0.3`; consider running `npm version patch` to align package version with changelog.

### Improved
- Small stability and documentation fixes across `smartAxios`, cache handling, and devtools.

---

## [1.0.4] - 2025-11-14
### Added
- Exported `axiosInstance` helper and `setGlobalToken` for advanced usage.
- `smartAxios` now supports a `refreshTokenFn` for automatic 401 token refresh and request replay.
- `FetchSmartProvider` accepts `retryLimit` and `refreshToken` in its config; `useFetchSmartContext` exposes the library axios instance.

### Fixed
- Cache TTL and persistence edge-cases (expiry checks and memory/localStorage synchronization).
- Devtools read logic hardened to avoid errors when internal cache structures differ.

### Improved
- Retry/backoff logic refinements and stability improvements in interceptors.
- Hook stability: reduce unnecessary re-renders and improve error handling.
- Documentation updates (README examples for provider + devtools).

---

## [1.0.3] - 2025-11-13
### Added
- Added `useGetSmart` hook with cacheTimeMs TTL caching.
- Added support for auto-token refresh via `refreshTokenFn`.
- Added `FetchSmartDevtools` for debugging cache + requests.

### Improved
- Improved retry logic with exponential backoff.
- Improved caching key to include baseURL.

### Fixed
- Fixed TTL in cache system (ms → seconds conversion).
- Fixed infinite rerenders in useEffect dependencies.

---

## [1.0.2] - 2025-11-13
### Added
- Added `usePostSmart`, `usePutSmart`, `useDeleteSmart`.

### Improved
- SmartAxios interceptor stability.

---

## [1.0.1] - 2025-11-13
### Added
- Initial GET hook implementation.
- Memory + localStorage cache manager.
- Basic retry logic & error handling.

---

## [1.0.0] - 2025-11-12
### Initial Release
- Basic infrastructure for npm package.
- Folder structure prepared.
