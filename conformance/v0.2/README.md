# memnex Conformance Suite — v0.2

**Specification version:** 0.2.0
**Schema URI:** `https://memnex.org/schema/v0.2/meeting-output.schema.json`

## Purpose

This conformance suite provides a canonical set of test cases for verifying that a memnex producer or validator correctly implements the `v0.2` schema. Any tool that claims to produce or validate memnex v0.2 documents SHOULD run this suite and pass all cases before making that claim.

The v0.1 suite (in `conformance/`) remains the authoritative test suite for v0.1 implementations and is frozen — its test cases, runner, and matching semantics do not change between v0.x minor releases. v0.2 adds this suite alongside it.

The suite does not test prose requirements in `SPEC.md` that have no JSON Schema equivalent (such as behavioral guidance for consumers). It tests only what the schema can express: required fields, type constraints, format patterns, enum membership, and `additionalProperties` boundaries.

## What's new in v0.2

The v0.2 schema adds two optional fields (full backward compatibility with v0.1):

- **`pipeline_config`** (root level): snapshot of pipeline configuration. Captures *how* the pipeline was run, complementing `provenance` which captures *what* (engines, models). Standardized sub-fields cover `language_hint`, `chunking` strategy, `output_stages`, and `prompt_template_digest`. Open-ended via `additionalProperties: true` to allow producer-specific extensions.
- **`host_hash`** (inside `provenance`): optional salted SHA-256 of host identifier. Absent or null by default for privacy.

v0.2 test cases exercise both new fields. Backward-compat fixtures (copies of v0.1 valid cases with bumped `schema_version`) confirm that all v0.1-shaped documents remain valid under v0.2.

## Structure

```
conformance/v0.2/
  runner.mjs                   Reference runner (Node.js, ESM)
  package.json                 npm package for the reference runner
  test-cases/
    valid/                     Documents that MUST validate successfully
      minimal.json
      full.json
      transcript-only.json
      empty-optional-arrays.json
      with-approximate-timing.json
      multi-speaker.json
      uuid-instead-of-ulid.json
      with-pipeline-config.json
      with-host-hash.json
      with-pipeline-config-and-extensions.json
    invalid/                   Documents that MUST fail validation
      <name>.json              The malformed document
      <name>.expected.json     Expected error descriptor (see below)
```

### Valid cases

Each file in `test-cases/valid/` is a well-formed memnex v0.2 document targeting a specific structural scenario. A conformant validator MUST accept all of them without errors.

The first seven cases (`minimal.json` through `uuid-instead-of-ulid.json`) are byte-equivalent to their v0.1 counterparts except for the bumped `schema_version`. They provide empirical evidence of backward compatibility.

The three remaining cases exercise v0.2-specific features:
- `with-pipeline-config.json` — all standardized `pipeline_config` sub-fields populated.
- `with-host-hash.json` — `provenance.host_hash` populated.
- `with-pipeline-config-and-extensions.json` — standardized fields plus producer-specific extensions, demonstrating that `additionalProperties: true` on `pipeline_config` admits arbitrary extra keys without breaking validation.

### Invalid cases

Each case in `test-cases/invalid/` is a pair:

- **`<name>.json`** — a document with exactly one deliberate violation. Everything else is correct so that error attribution is unambiguous.
- **`<name>.expected.json`** — a JSON descriptor with the following shape:

```json
{
  "valid": false,
  "expected_error_keywords": ["<keyword>", "..."],
  "expected_error_paths":    ["<JSON Pointer>", "..."],
  "description": "Short human-readable explanation of what is wrong."
}
```

v0.2 invalid cases target the new fields specifically:

- `bad-host-hash-pattern` — `host_hash` violates the 64-lowercase-hex SHA-256 pattern.
- `bad-pipeline-config-chunking-strategy` — `chunking.strategy` is not one of the enum values.
- `bad-prompt-template-digest` — `prompt_template_digest` violates the SHA-256 pattern.
- `bad-output-stages-duplicate` — `output_stages` contains duplicate entries (violates `uniqueItems`).
- `bad-output-stages-unknown` — `output_stages` contains a value outside the enum.
- `bad-chunking-overlap-negative` — `chunking.overlap_sec` is negative.
- `bad-pipeline-config-not-object` — `pipeline_config` is not an object.

### Matching semantics

A runner passes an invalid case when **both** of the following hold:

1. **At least one** actual error keyword appears in `expected_error_keywords`.
2. **At least one** actual error `instancePath` matches (exactly, or as a superstring of) one of the values in `expected_error_paths`.

Exact-set matching is deliberately avoided. Validators often emit multiple related errors for the same violation (for example, an `enum` failure may be accompanied by a `type` error when the schema additionally constrains the type). Requiring one match from each axis — keyword and path — is sufficient for unambiguous attribution while remaining tolerant of this multi-error output.

The path check accepts the expected path as a substring of the actual path. This means that `""` (the document root) matches any actual path, and a partial pointer like `/action_items/0` matches `/action_items/0/status` without requiring the spec to predict the exact depth.

These matching semantics are identical to those of the v0.1 suite and are the published contract for any third-party runner targeting either version.

## Running the reference runner

The reference runner is a single ES module (`runner.mjs`) with no build step. It requires Node.js 18 or later.

```bash
cd conformance/v0.2
npm install
npm test
```

A passing run prints one line per case (✅ or ❌) followed by a summary:

```
17 total — 17 passed, 0 failed
```

The runner exits with code `0` on full success and `1` if any case fails.

## Writing your own runner

Implementers in other languages are encouraged to write their own runner against the same test cases. The matching semantics described above **MUST** be followed: at-least-one keyword match AND at-least-one path match (substring or exact). Runners that apply stricter or looser matching are not conformant with this test suite.

`runner.mjs` is intended to serve as readable reference code. The matching logic is annotated with comments explaining the rationale.

## Adding test cases

Contributions of additional test cases are welcome via pull request. Each new case MUST:

- Target exactly one schema rule, with all other fields set to valid values.
- Be accompanied by a description in `.expected.json` that names the violated rule.
- Pass the reference runner without modification to `runner.mjs`.

Cases that cover multiple simultaneous violations, or that require changes to the runner's matching logic to pass, will not be accepted.
