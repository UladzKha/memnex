# Examples

Reference documents that conform to the memnex specification at version `0.1.0`.

These examples are dedicated to the public domain under CC0 1.0 and may be freely reused for tests, fixtures, documentation, or any other purpose.

## Files

- `minimal.json` — Smallest valid document. Contains only the six required top-level fields, with a transcript-only pipeline.
- `full.json` — All optional fields populated. Includes speaker diarization, action items, decisions, and full per-stage provenance.

Both examples are tested against the schema in the conformance suite (`conformance/test-cases/valid/`).