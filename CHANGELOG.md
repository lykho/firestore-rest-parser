# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-06-05

### Breaking Changes

- `parse()` now preserves unsafe Firestore integers as strings by default instead of coercing them to numbers
- `parse()` now throws descriptive errors for malformed Firestore payloads such as invalid integer strings, malformed arrays, malformed maps, or fields with multiple Firestore value keys
- `Timestamp` now throws immediately for invalid dates or millisecond timestamps
- `GeoPoint` now throws immediately for non-finite or out-of-range coordinates
- `convert()` error messages are now path-aware and no longer use the generic `Unprocessable data type` text

### Added

- `parse(..., { integerMode })` support with `number`, `string`, `bigint`, and `smart` modes
- Browser-friendly `Bytes` input support via `Uint8Array` and `ArrayBuffer`
- Additional tests for malformed payloads, helper validation, binary encoding, and integer parsing modes

### Changed

- Hardened internal Firestore value typing and validation
- Improved README wording and examples for integer parsing, helper usage, and error handling
- Normalized `repository.url` in `package.json` to match npm publish expectations

## [2.0.0] - 2024-12-08

### Breaking Changes

- `Timestamp.value` now always returns an ISO 8601 string. Previously, it returned the raw number if initialized with milliseconds.
- Minimum Node.js version is now 18 (previously 10)

### Changed

- Migrated build system from TSDX to Vite
- Updated TypeScript to 5.x
- Updated all dev dependencies to latest versions
- Removed lodash dependency - the library now has **zero runtime dependencies**
- Improved TypeScript types throughout the codebase
- Parser now handles empty arrays (`{ arrayValue: {} }`) correctly

### Added

- Comprehensive JSDoc documentation for all exported functions and classes
- `ParsedValue` type for representing parsed output
- Additional test coverage for edge cases
- CHANGELOG.md
- CONTRIBUTING.md

### Fixed

- Fixed incorrect example in README (missing `fields` wrapper in mapValue)

## [1.1.1] - 2024-XX-XX

### Changed

- `createRESTObject` now accepts `null` as the fields argument

### Fixed

- Parser now correctly handles documents with null fields

## [1.1.0] - Previous

### Added

- `convert()` function for converting JS objects to Firestore REST format
- `createRESTObject()` helper for creating complete document structures
- Type helper classes: `Timestamp`, `Bytes`, `Reference`, `GeoPoint`

## [1.0.0] - Initial Release

### Added

- `parse()` function for converting Firestore REST responses to plain objects
- Support for all Firestore data types: null, boolean, integer, double, timestamp, string, bytes, reference, geoPoint, array, map
