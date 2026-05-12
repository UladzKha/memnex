# memnex-spec

Reference JavaScript/TypeScript implementation of the [memnex specification](https://github.com/UladzKha/memnex) — an open standard for portable meeting outputs.

This package provides:

- A runtime validator built on [ajv](https://ajv.js.org/) (JSON Schema Draft 2020-12)
- TypeScript types generated directly from the schema
- The raw schema document, for downstream tools

**Latest schema version: 0.2.** The package also ships v0.1 for backward compatibility via version-pinned subpaths.

## Install

```bash
npm install memnex-spec
```

## Usage

The default import targets the latest schema version (currently v0.2):

```typescript
import { validate, isValid, schema, type MeetingOutput } from "memnex-spec";

const result = validate(JSON.parse(text));
if (result.valid) {
    const meeting: MeetingOutput = result.data;
    console.log(meeting.meeting_id);
} else {
    for (const err of result.errors) {
        console.error(`${err.path}: ${err.message}`);
    }
}

// Type guard variant
if (isValid(data)) {
    // data is narrowed to MeetingOutput (v0.2 shape)
}
```

## Choosing a schema version

If you need to validate against a specific schema version regardless of what the package considers "latest", import from a version-pinned subpath:

```typescript
// Pin to v0.1
import { validate, isValid, schema, type MeetingOutput } from "memnex-spec/v0.1";

// Pin to v0.2 (explicit form of the default)
import { validate, isValid, schema, type MeetingOutput } from "memnex-spec/v0.2";
```

The shape of the API (`validate`, `isValid`, `schema`, `MeetingOutput`, `ValidationResult`, `ValidationError`) is identical across all version-pinned subpaths.

## Accessing the raw schema and examples

```typescript
import { schema } from "memnex-spec";       // latest = v0.2
// or version-pinned:
import { schema as v0_1Schema } from "memnex-spec/v0.1";
import { schema as v0_2Schema } from "memnex-spec/v0.2";
```

JSON subpath exports for tooling that prefers direct JSON imports (bundlers, schema browsers, code generators):

- `memnex-spec/schema` — raw JSON Schema document for the **latest** version (currently v0.2)
- `memnex-spec/schema/v0.1` — raw v0.1 JSON Schema document
- `memnex-spec/schema/v0.2` — raw v0.2 JSON Schema document
- `memnex-spec/examples/v0.1/minimal` — minimal valid v0.1 example
- `memnex-spec/examples/v0.1/full` — full v0.1 example with all optional fields
- `memnex-spec/examples/v0.2/minimal` — minimal valid v0.2 example
- `memnex-spec/examples/v0.2/full` — full v0.2 example (all v0.1 fields, no v0.2-specific fields)
- `memnex-spec/examples/v0.2/full-with-config` — v0.2 example showcasing `pipeline_config` and `provenance.host_hash`
- `memnex-spec/types` — TypeScript types only (no runtime), for the latest version

Direct ESM imports of JSON subpaths require Node's import attributes syntax: `import x from "memnex-spec/schema" with { type: "json" }`. Most consumers will not need this; use `import { schema } from "memnex-spec"` instead.

## Migration from 0.1.x

`memnex-spec@0.2.0` is a breaking release at the package layer. Two migration paths:

### Stay on v0.1 schema (one-line change)

If your documents are at `schema_version: "0.1.0"` and you are not ready to migrate:

```diff
- import { validate, isValid, schema, type MeetingOutput } from "memnex-spec";
+ import { validate, isValid, schema, type MeetingOutput } from "memnex-spec/v0.1";
```

If you used the unversioned example subpaths, switch to versioned subpaths:

```diff
- import minimal from "memnex-spec/examples/minimal" with { type: "json" };
+ import minimal from "memnex-spec/examples/v0.1/minimal" with { type: "json" };
```

### Migrate documents to v0.2 (recommended)

The v0.2 schema is a strict superset of v0.1 — it adds two new optional fields (`pipeline_config` and `provenance.host_hash`) and does not remove or rename anything. Migration steps:

1. In your producer code, bump `schema_version` from `"0.1.0"` to `"0.2.0"` on emitted documents.
2. Optionally populate `pipeline_config` and `provenance.host_hash` if useful for your use case. See [SPEC.md](https://github.com/UladzKha/memnex/blob/main/SPEC.md) for field semantics.
3. No code changes required — existing imports from `"memnex-spec"` continue to work and now validate the upgraded documents.

## What is memnex?

memnex is an open specification for storing meeting recordings as structured data: a single JSON document that combines transcript, summary, action items, decisions, and provenance metadata, in a format any tool can read and write.

The full specification lives at [github.com/UladzKha/memnex](https://github.com/UladzKha/memnex).

## Version compatibility

| `memnex-spec` package | Default schema | Pinned subpaths available |
| --------------------- | -------------- | ------------------------- |
| `0.1.x`               | `0.1`          | —                         |
| `0.2.x`               | `0.2`          | `v0.1`, `v0.2`            |

## License

MIT. See [LICENSE-CODE](https://github.com/UladzKha/memnex/blob/main/LICENSE-CODE) at the repository root.
