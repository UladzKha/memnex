# Changelog

All notable changes to memnex-spec will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-05-11

### Added

- First functional release of the memnex-spec JavaScript/TypeScript
  reference implementation.
- `validate(data)` — runtime validation against the memnex meeting
  output schema (JSON Schema Draft 2020-12), built on ajv.
- `isValid(data)` — type guard variant of validate.
- `schema` — the raw JSON Schema document for use by downstream tools.
- Generated TypeScript types (`MeetingOutput`) compiled from the
  schema via json-schema-to-typescript.
- JSON subpath exports for raw schema and example documents.
- Ships with memnex specification v0.1.

### Notes

- This release replaces the placeholder `0.0.1` stub, which was
  published with a deprecation warning to reserve the npm namespace.
- The package is part of the [memnex specification][1] repository.
  Schema, examples, and license file are synced from repo root into
  the package directory at build time; the canonical source of truth
  lives at the repo root.

[1]: https://github.com/UladzKha/memnex
