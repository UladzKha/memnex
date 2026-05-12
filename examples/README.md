# Examples

Reference documents that conform to the memnex specification. Examples are provided for each schema version; all are dedicated to the public domain under CC0 1.0 and may be freely reused for tests, fixtures, documentation, or any other purpose.

## v0.1 examples

Located in this directory (`examples/`):

- `minimal.json` — Smallest valid document at schema version 0.1.0. Contains only the six required top-level fields, with a transcript-only pipeline.
- `full.json` — All optional v0.1 fields populated. Includes speaker diarization, action items, decisions, and full per-stage provenance.

Both files are tested against the v0.1 schema in the v0.1 conformance suite (`conformance/test-cases/valid/`).

## v0.2 examples

Located in `examples/v0.2/`:

- `minimal.json` — Smallest valid document at schema version 0.2.0. Structurally identical to the v0.1 minimal example with `schema_version` bumped, demonstrating backward compatibility at the example layer.
- `full.json` — All optional v0.1 fields populated, at schema version 0.2.0. No v0.2-specific fields used.
- `full-with-config.json` — v0.2-specific showcase. Adds `pipeline_config` with all standardized sub-fields (`language_hint`, `chunking`, `output_stages`, `prompt_template_digest`) plus a `samuraizer_extensions` object demonstrating that `additionalProperties: true` on `pipeline_config` admits arbitrary producer-namespaced extension keys.

All v0.2 examples are tested against the v0.2 schema in the v0.2 conformance suite (`conformance/v0.2/test-cases/valid/`).
