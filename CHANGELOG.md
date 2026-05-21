# Changelog

All notable changes to the memnex specification and reference implementation are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) at the specification level. See [GOVERNANCE.md](./GOVERNANCE.md) for the full versioning policy.

This file tracks changes to the specification (schema, SPEC.md) and the conformance test suite.

## [Unreleased]

No unreleased changes at this time.

## [0.2.0] — 2026-05-12

Backward-compatible minor release. All documents valid under `0.1.0` remain valid under 
`0.2.0`.

- **Schemastore catalog entry** — updated to reference canonical `memnex.org` URLs instead of `raw.githubusercontent.com`. Default URL now points to v0.2 (current) instead of v0.1 (previous), and a `versions` block lists both v0.1 (frozen) and v0.2 (current). Description updated to include the project URL. All URLs verified live: schemas resolve with HTTP 200 and `Content-Type: application/json`. SchemaStore PR [#5686](https://github.com/SchemaStore/schemastore/pull/5686), follows the original entry in PR [#5676](https://github.com/SchemaStore/schemastore/pull/5676).

### Added

- **`pipeline_config`** — new optional top-level field capturing pipeline configuration. Complements `provenance` (which records *what* tools and models were used) by recording *how* the pipeline was run. Standardized sub-fields:
  - `language_hint` — BCP 47 language tag passed to ASR as a hint
  - `chunking` — audio segmentation strategy (`none`, `fixed_duration`, `vad`, `silence`) with optional `chunk_duration_sec` and `overlap_sec`
  - `output_stages` — array of which downstream stages were enabled (`summary`, `action_items`, `decisions`, `participants`)
  - `prompt_template_digest` — SHA-256 of prompt templates used by LLM stages
  - `additionalProperties: true` admits producer-namespaced extensions without breaking validation
- **`provenance.host_hash`** — new optional salted SHA-256 of a host identifier. Allows grouping documents from the same machine without revealing the identifier. Salt is producer-controlled and never appears in the document. Explicitly not a verifiable identity claim.
- **Hash naming convention** — normative rule in SPEC.md that hash fields are named for their algorithm (e.g., `audio_sha256`, `prompt_template_digest`). Future algorithms get sibling field names, not algorithm-agnostic discriminators.
- **v0.2 conformance test suite** at [`conformance/v0.2/`](./conformance/v0.2/) — 17 cases (10 valid, 7 invalid pairs). 7 of the valid cases are backward-compatibility fixtures (v0.1 cases with bumped `schema_version`); 3 exercise the new fields.
- **v0.2 examples** at [`examples/v0.2/`](./examples/v0.2/) — `minimal.json`, `full.json` (both byte-equivalent to v0.1 with bumped `schema_version`), and `full-with-config.json` (showcases new fields plus `additionalProperties` extensions).
- **Privacy considerations** for `host_hash` added to SPEC.md — producer-side guidance on salt selection, consumer-side guidance that `host_hash` is a grouping signal, not an attestation.

### Changed

- **SPEC.md header** — Version bumped to `0.2.0`. Added "Previous versions" line linking to v0.1.
- **SPEC.md Status section** — Explicit statement that v0.2 supersedes v0.1 with backward-compatible additions; conformant v0.1 producers and consumers are not required to upgrade.
- **SPEC.md Validation section** — Lists both v0.1 and v0.2 schema URLs side by side. Explicit MUST requirement that validators select schema by the document's declared `schema_version`.
- **SPEC.md High-level structure table** — Added `pipeline_config` row.
- **SPEC.md Reference Implementations section** — Now references both v0.1 and v0.2 conformance suites with their respective test counts.
- **examples/README.md** — Restructured to document both v0.1 and v0.2 examples in separate sections.

### Notes

- The v0.1 conformance test suite at [`conformance/`](./conformance/) is frozen. Its README, runner behavior, test cases, and matching semantics do not change between v0.x minor releases. The v0.2 suite is published alongside it as a parallel directory.

## [0.1.0] — 2026-05-11

Initial public release of the memnex specification.

### Added

- **Schema** — JSON Schema (Draft 2020-12) for memnex meeting outputs at [`schema/v0.1/meeting-output.schema.json`](./schema/v0.1/meeting-output.schema.json). Top-level fields: `schema_version`, `meeting_id`, `generated_at`, `source`, `transcript`, `summary`, `action_items`, `decisions`, `participants`, `provenance`.
- **SPEC.md** — formal specification with Abstract, Status of This Document, Conformance section using RFC 2119 keywords, Field-by-field reference, Versioning policy, Security & Privacy Considerations, Reference Implementations, Governance & Stability, Open Questions, References.
- **Examples** at [`examples/`](./examples/) — `minimal.json` (smallest valid document) and `full.json` (all optional fields populated).
- **Conformance test suite** at [`conformance/`](./conformance/) — 15 cases (7 valid, 8 invalid pairs), reference runner in Node.js ES module (`runner.mjs`) with documented at-least-one-keyword / at-least-one-path matching semantics.
- **`memnex-spec` npm package v0.1.0** — TypeScript-typed validator built on Ajv 8.x, generated types via `json-schema-to-typescript`, published as `latest` on npm.
- **GOVERNANCE.md** — BDFL bootstrap model with explicit transition path, semver versioning policy, 30-day discussion window for breaking changes, 3-year stability commitment from v1.0.0, conflict-of-interest disclosure, decision-making process.
- **CONTRIBUTING.md** — minimal contributor guide.
- **CODE_OF_CONDUCT.md** — Contributor Covenant v2.1.
- **Dual licensing** — `LICENSE-CODE` (MIT) for reference code, `LICENSE-SPEC` (CC0 1.0) for the specification, examples, and conformance test cases.
- **Schemastore catalog entry** — memnex registered in the universal JSON Schema catalog via PR [#5676](https://github.com/SchemaStore/schemastore/pull/5676) (merged the same day). IDE autocomplete and validation for `*.memnex.json` / `meeting-output.json` files works by default in VS Code, JetBrains IDEs, Neovim, and other editors with language-server support.

[Unreleased]: https://github.com/UladzKha/memnex/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/UladzKha/memnex/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/UladzKha/memnex/releases/tag/v0.1.0
