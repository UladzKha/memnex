# Changelog

All notable changes to memnex-spec will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-12

### Added

- **v0.2 schema support** — package now ships the full memnex specification v0.2 schema, examples, and generated types alongside v0.1.
- **Version-pinned subpath imports** for callers that want to target a specific schema version:
  - `memnex-spec/v0.1` — full API pinned to v0.1 schema
  - `memnex-spec/v0.2` — full API pinned to v0.2 schema (equivalent to the default export)
  - `memnex-spec/schema/v0.1` — raw v0.1 JSON Schema document
  - `memnex-spec/schema/v0.2` — raw v0.2 JSON Schema document
  - `memnex-spec/examples/v0.1/{minimal,full}` — v0.1 example documents
  - `memnex-spec/examples/v0.2/{minimal,full,full-with-config}` — v0.2 example documents

### Changed (BREAKING)

The default export now targets v0.2. Consumers who relied on the package always tracking v0.1 must either migrate their documents to v0.2 (a backward-compatible operation at the document level) or pin their imports to v0.1.

- `import { validate, isValid, schema, type MeetingOutput } from "memnex-spec"` now validates against the v0.2 schema and returns v0.2-shaped types. Documents with `schema_version: "0.1.0"` will fail validation against the new default.
- `import schema from "memnex-spec/schema"` now resolves to the v0.2 schema. Use `memnex-spec/schema/v0.1` to pin to v0.1.
- `import { type MeetingOutput } from "memnex-spec/types"` now resolves to v0.2 types.

### Removed (BREAKING)

The unversioned example subpaths from `0.1.x` are no longer published. Consumers must migrate to versioned subpaths.

- `memnex-spec/examples/minimal` — removed. Use `memnex-spec/examples/v0.1/minimal` (same content) or `memnex-spec/examples/v0.2/minimal`.
- `memnex-spec/examples/full` — removed. Use `memnex-spec/examples/v0.1/full` (same content) or `memnex-spec/examples/v0.2/full`.

### Migration from 0.1.x

For consumers who want to stay on v0.1 schema semantics without code changes beyond imports:

```diff
- import { validate, isValid, schema, type MeetingOutput } from "memnex-spec";
+ import { validate, isValid, schema, type MeetingOutput } from "memnex-spec/v0.1";

- import minimal from "memnex-spec/examples/minimal" with { type: "json" };
+ import minimal from "memnex-spec/examples/v0.1/minimal" with { type: "json" };
```

For consumers ready to adopt v0.2 schema (recommended — the v0.2 schema is a strict superset of v0.1, adding only optional fields `pipeline_config` and `provenance.host_hash`):

1. Bump produced documents' `schema_version` from `"0.1.0"` to `"0.2.0"`.
2. Optionally populate the new `pipeline_config` and `provenance.host_hash` fields. See [SPEC.md](https://github.com/UladzKha/memnex/blob/main/SPEC.md) for field semantics.
3. No code changes required — existing `import { validate } from "memnex-spec"` will work against the new defaults.

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
