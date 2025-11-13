# 📦 Changelog
All notable changes to **use-fetch-smart** will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/).

---

## [1.0.3] - 2025-11-15
### Added
- Added `useGetSmart` hook with cacheTimeMs TTL caching.
- Added support for auto-token refresh via `refreshTokenFn`.
- Added `FetchSmartProvider` for global configuration.
- Added `FetchSmartDevtools` for debugging cache + requests.

### Improved
- Improved retry logic with exponential backoff.
- Improved caching key to include baseURL.

### Fixed
- Fixed TTL in cache system (ms → seconds conversion).
- Fixed infinite rerenders in useEffect dependencies.

---

## [1.0.2] - 2025-11-14
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
