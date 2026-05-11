# memnex Conformance Suite

**Specification version:** 0.1.0
**Schema URI:** `https://memnex.org/schema/v0.1/meeting-output.schema.json`

## Purpose

This conformance suite provides a canonical set of test cases for verifying that a memnex producer or validator correctly implements the `v0.1` schema. Any tool that claims to produce or validate memnex documents SHOULD run this suite and pass all cases before making that claim.

The suite does not test prose requirements in `SPEC.md` that have no JSON Schema equivalent (such as behavioral guidance for consumers). It tests only what the schema can express: required fields, type constraints, format patterns, enum membership, and `additionalProperties` boundaries.

## Structure

```
conformance/
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
    invalid/                   Documents that MUST fail validation
      <name>.json              The malformed document
      <name>.expected.json     Expected error descriptor (see below)
```

### Valid cases

Each file in `test-cases/valid/` is a well-formed memnex document targeting a specific structural scenario. A conformant validator MUST accept all of them without errors.

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

### Matching semantics

A runner passes an invalid case when **both** of the following hold:

1. **At least one** actual error keyword appears in `expected_error_keywords`.
2. **At least one** actual error `instancePath` matches (exactly, or as a superstring of) one of the values in `expected_error_paths`.

Exact-set matching is deliberately avoided. Validators often emit multiple related errors for the same violation (for example, an `enum` failure may be accompanied by a `type` error when the schema additionally constrains the type). Requiring one match from each axis — keyword and path — is sufficient for unambiguous attribution while remaining tolerant of this multi-error output.

The path check accepts the expected path as a substring of the actual path. This means that `""` (the document root) matches any actual path, and a partial pointer like `/action_items/0` matches `/action_items/0/status` without requiring the spec to predict the exact depth.

## Running the reference runner

The reference runner is a single ES module (`runner.mjs`) with no build step. It requires Node.js 18 or later.

```bash
cd conformance
npm install
npm test
```

A passing run prints one line per case (✅ or ❌) followed by a summary:

```
15 total — 15 passed, 0 failed
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
