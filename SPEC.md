# memnex Specification

**Version:** 0.2.0 (draft)
**Schema URI:** `https://memnex.org/schema/v0.2/meeting-output.schema.json`
**JSON Schema dialect:** Draft 2020-12
**Status:** Draft. Field names and structure may change before `v1.0.0`. From `v1.0.0` onward, this specification commits to a 3-year no-breaking-changes window.
**Previous versions:** [v0.1.0](https://memnex.org/schema/v0.1/meeting-output.schema.json) (superseded by v0.2.0; remains valid — see Versioning).
**License:** This document is dedicated to the public domain under [CC0 1.0](./LICENSE-SPEC). Reference code is licensed under [MIT](./LICENSE-CODE).

## Abstract

memnex is an open specification for portable, verifiable, agent-accessible meeting data. It defines a JSON document format for the artifacts produced when an audio recording of a meeting is processed: time-aligned transcripts, free-form summaries, extracted action items, agreed decisions, identified participants, and per-stage chain-of-custody metadata. The format is deliberately tool-agnostic — no field is specific to any particular ASR engine, LLM runtime, or downstream consumer. memnex is designed for local-first pipelines, but is equally usable by cloud-hosted tools that wish to remain interoperable. A reference implementation exists as part of [Samuraizer](https://github.com/UladzKha/samuraizer-cli).

## Status of This Document

This is a public draft (`v0.2.0`) of the memnex specification. It is published for community review, early implementation feedback, and incorporation into reference tooling. It is **not** a stable release. Fields, value constraints, and structural decisions may change between minor versions during the `0.x` series.

v0.2.0 supersedes v0.1.0 with two backward-compatible additions (see [CHANGELOG.md](./CHANGELOG.md) for the full change list). All documents valid under `v0.1.0` remain valid under `v0.2.0`. Producers and consumers conformant with v0.1.0 are not required to upgrade.

A stable `v1.0.0` release is planned following implementation feedback. From `v1.0.0` onward, the specification commits to a minimum 3-year window with no breaking changes.

This document is maintained at <https://github.com/UladzKha/memnex>. Issues and pull requests are welcome.

## Conformance

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in [BCP 14] ([RFC 2119], [RFC 8174]) when, and only when, they appear in all capitals, as shown here.

### Producer conformance

A *producer* is any tool that emits memnex documents. A producer is conformant if and only if every document it emits validates successfully against the JSON Schema for the `schema_version` value declared in the document.

A producer **SHOULD** populate every field for which it has reliable information. A producer **MUST NOT** fabricate values to satisfy validation; if a value is unknown, the corresponding field **MUST** be omitted (when optional) or set to `null` (when the schema permits null).

### Consumer conformance

A *consumer* is any tool that reads memnex documents. A consumer is conformant if it accepts every document that validates against the JSON Schema for a `schema_version` whose major version it claims to support.

A consumer **MUST** check the `schema_version` field before parsing and **MAY** refuse to process documents whose major version it does not understand. A consumer **SHOULD** ignore unknown optional fields when the major version matches, to preserve forward compatibility within a major version.

### Validation

The normative JSON Schema for `v0.2.0` is located at:

```
https://memnex.org/schema/v0.2/meeting-output.schema.json
```

The previous version's schema remains available at:

```
https://memnex.org/schema/v0.1/meeting-output.schema.json
```

Both versions are maintained side by side. Documents declaring `schema_version: "0.1.0"` MUST be validated against the v0.1 schema; documents declaring `schema_version: "0.2.0"` MUST be validated against the v0.2 schema.

In the event of a discrepancy between this prose document and the JSON Schema, **the JSON Schema is authoritative for what validates**, and this document is authoritative for the **meaning** and **intended use** of each field.

## Why this specification exists

Today, every meeting-tool vendor — Otter, Fireflies, Granola, Zoom AI Companion — stores transcripts, summaries, action items and decisions in their own proprietary format inside their own cloud. Users cannot:

- export their meeting data without lock-in,
- feed meeting outputs from one tool into another,
- run independent agents over their own meeting history,
- verify how a transcript or action item was produced.

memnex is a small, opinionated proposal for a portable, tool-agnostic representation of a single processed meeting recording. Design goals, in order of priority:

1. **Portability.** No vendor lock-in. JSON, plain fields, no opaque blobs.
2. **Verifiability.** A consumer can tell which audio, which models, and which tools produced the document.
3. **Local-first friendliness.** Sensible defaults, no required network calls to dereference anything.
4. **Forward compatibility.** Versioned, with explicit rules for adding fields.
5. **Simplicity over completeness.** Cover the common case well; leave room for extension.

## High-level structure

A memnex document is a single JSON object with the following top-level fields:

| Field | Required | Purpose |
|---|---|---|
| `schema_version` | yes | Which version of this specification the document follows. |
| `meeting_id` | yes | Globally unique ID for this output. |
| `generated_at` | yes | When this document was produced. |
| `source` | yes | The original audio file. |
| `transcript` | yes | Time-aligned speech-to-text. |
| `summary` | no | Free-form meeting summary. |
| `action_items` | no | Tasks identified during the meeting. |
| `decisions` | no | Final decisions reached. |
| `participants` | no | Speakers, if known. |
| `provenance` | yes | Which tools and models produced each part. |
| `pipeline_config` | no | Snapshot of how the pipeline was configured. |

The minimum valid document has `schema_version`, `meeting_id`, `generated_at`, `source`, `transcript`, and `provenance`. A transcript-only output is valid; all LLM-derived blocks are optional.

## Field-by-field reference

### `schema_version`

A semver string matching one of the published specification versions. The current version is `"0.1.0"`. Consumers **MUST** check this field before parsing and **MAY** refuse to process documents whose major version they do not understand.

This field is duplicated by the schema's `$id` URL, but having it explicit in the document means tools that have never seen the URL can still detect the version.

### `meeting_id`

A globally unique identifier for this meeting output. [ULID] is **RECOMMENDED**:

- 26 characters, Crockford base32, URL-safe;
- lexicographically sortable by creation time, so a directory of files sorts in chronological order without any extra metadata;
- collision-free across machines, unlike timestamp-based IDs.

UUIDs ([RFC 9562]) are also accepted. The schema does not enforce ULID format because the field needs to remain forward-compatible with whatever IDs producers want to mint, but `minLength`/`maxLength` constraints rule out empty strings and abuse.

The ID identifies *this output document*, not the underlying audio. Reprocessing the same file with a different model produces a new document with a new `meeting_id`. That is intentional: two outputs with different provenance are different artifacts even when the source bytes are identical.

### `generated_at`

When this document was produced, as an [RFC 3339] timestamp with timezone (e.g. `"2026-05-07T14:30:00Z"`). Always present.

RFC 3339 was chosen over Unix timestamps because:

- it survives being copy-pasted, eyeballed, and grep-ed by humans;
- it preserves timezone, which Unix timestamps do not;
- it is the de-facto standard format for `format: "date-time"` in JSON Schema and OpenAPI.

This is distinct from `source.recorded_at` (when the recording was captured).

### `source`

Information about the original audio file. The required subset is `file_name`, `sha256`, `format`. Everything else (duration, sample rate, channels, codec, recording time) is optional and added when known.

`sha256` is the most important field in this block. It anchors the chain of custody: any downstream artifact (signed output, derivative document, exported task in Linear or Notion) can be tied back to the exact audio bytes that produced it. Two outputs with the same `source.sha256` came from the same recording even if they used different models.

`file_name` is intentionally a basename only. Stripping the path avoids leaking filesystem layout into shareable documents.

### `transcript`

The time-aligned speech-to-text output, with three required subfields: `language`, `text`, `segments`.

- `language` is a [BCP 47] language tag (`"en"`, `"ru"`, `"en-US"`). Use `"und"` if undetermined.
- `text` is the full transcript as plain text. It is a convenience field; the canonical content is in `segments`.
- `segments` is an ordered array of transcript chunks. Each segment has its own `id`, time range, text, and optional speaker and confidence.

#### Why segments have stable IDs

The segment `id` (recommended format `seg_NNNN`) is the unit that `action_items[].source_segment_ref` and `decisions[].source_segment_ref` point at. Using a string ID instead of an array index has two benefits:

1. **Stability under re-segmentation.** If a future version of the producer re-segments the transcript (for diarization, for example), array positions shift but IDs can be preserved.
2. **Forward compatibility.** Segments from multiple tracks (per-speaker streams) or merged segments can have IDs that do not correspond to a single linear array position.

#### Approximate timing

Many ASR pipelines do not emit real per-segment timecodes; they emit a flat block of text and the segments are reconstructed line-by-line. The schema flags this honestly with the optional `is_approximate_timing: true` field on a segment. Default is `false`.

This matters for trust: a consumer that wants to navigate audio by clicking on a segment needs to know whether the timing is real or fabricated. memnex surfaces that, rather than hiding it.

### `summary`

A single-field object with `text`. Plain text or lightweight Markdown. memnex does not impose structure (sections, bullet lists) on the summary because LLM summary styles vary widely and over-specification would force consumers to convert.

### `action_items`

An array of tasks. Each item has:

- `id` (`act_NNNN`): stable identifier.
- `text`: the task description.
- `assignee`: free-form name or null. **Not constrained to participants.** LLMs frequently name people who were not in the meeting ("send it to the legal team", "ask Sarah from accounting"). Forcing this to reference `participants[].id` would lose information.
- `due_date`: the original phrasing as it appeared in the meeting (`"by end of week"`, `"next Friday"`). Preserved verbatim.
- `due_date_iso`: a normalized ISO 8601 date (`YYYY-MM-DD`), if the original phrase could be resolved to a calendar date. Null otherwise.
- `status`: lifecycle state (`open`, `in_progress`, `done`, `cancelled`), defaulting to `open`. Forward-compatible: consumers may extend the enum in their own derivations, but the schema fixes the canonical four for interoperability.
- `source_segment_ref`: an array of segment IDs that support this action item. May be empty.

#### Why `due_date` is two fields

LLMs extract due dates from natural-language phrases, and many of those phrases are intentionally fuzzy (`"end of week"`, `"sometime next quarter"`, `"ASAP"`). A single `due_date: ISO 8601` field forces the LLM to either fabricate precision or drop the deadline entirely. Both lose information.

Splitting it into `due_date` (original) and `due_date_iso` (normalized) keeps both layers: humans see the meeting's phrasing, machines see the resolvable deadline. Either may be null independently.

#### Why `source_segment_ref` is an array

Action items often span multiple segments. A request and its acknowledgement ("Bob, can you handle X?" / "Sure, by Friday") together form the evidence for a single item. An array makes this natural; a single ID would force a choice.

The array **MAY** be empty when the LLM provides no grounding, but producers **SHOULD** populate it whenever possible. This is the spine of the verifiability story: every derived item links back to specific audio.

### `decisions`

An array of confirmed decisions. Same structure as `action_items` but simpler:

- `id` (`dec_NNNN`)
- `text`
- `context`: optional rationale or surrounding context.
- `source_segment_ref`: same role as in `action_items`.

No assignee, due date, or status — decisions are facts about what was agreed, not tasks.

### `participants`

Optional array of speakers. Each has `id`, `name`, optional `role`. Used to anchor `transcript.segments[].speaker_id` references.

The schema does not require `participants` because diarization is not always performed. When a producer does include participants, segments may reference them by ID; when no diarization is performed, segments simply omit `speaker_id`.

`id` allows diarizer-provided labels (`SPEAKER_00`) as well as numbered slots (`p_0001`). Both are common.

### `provenance`

Two required subfields: `producer` and `pipeline`.

`producer` identifies the software that produced the document — name and semver version. For Samuraizer outputs this is `{ "name": "samuraizer", "version": "0.2.0" }`.

`pipeline` identifies the per-stage tools and models, with each stage optional:

- `transcription`: ASR engine, engine version, model name, model SHA-256.
- `summary`, `action_items`, `decisions`: LLM runtime, runtime version, model name, model digest, temperature.

A document that has only a transcript will have only a `transcription` entry under `pipeline`. A summary-only document (run after the fact) is also valid.

#### Why this granularity

Provenance is what makes "verify" concrete. Given a memnex document, a reviewer can tell:

- which exact ASR engine and model produced the transcript,
- which LLM produced each derived block,
- whether the summary and the action items were produced by the same model or different ones,
- what sampling parameters were used.

Together with `source.sha256` and (in future versions) signed outputs, this makes the document **inspectable**: a reviewer can see exactly what produced what. memnex deliberately does **not** claim bit-for-bit reproducibility — see [Security & Privacy Considerations](#security--privacy-considerations) for why.

The fields `model_sha256` / `model_digest` are **not** required in `v0.1.0` because not every runtime exposes them ergonomically. Producers **SHOULD** include them when available.

#### `host_hash`

An optional salted SHA-256 hash of a host identifier (hostname, MAC address, or similar). When populated, it allows consumers to group memnex documents originating from the same machine without revealing the underlying identifier.

The salt is **producer-controlled** and **MUST NOT** appear in the document. Two memnex documents with the same `host_hash` were produced on the same host using the same salt. Two documents with different `host_hash` values were either produced on different hosts, or on the same host with different salts (e.g., after salt rotation).

Producers **SHOULD** omit this field by default and populate it only when host grouping is an explicit requirement. The field is `null`-able for cases where the producer needs to record that grouping was deliberately not performed.

Consumers **MUST NOT** treat `host_hash` as a stable identifier across producers, across documents with different salts, or as a verifiable claim about origin. It is a grouping signal, not an attestation.

### `pipeline_config`

An optional object capturing the configuration of the pipeline that produced this document. Where `provenance` records *what* tools and models were used, `pipeline_config` records *how* they were configured: language hints, audio segmentation strategy, which downstream stages were enabled, and (when available) a digest of the prompt templates fed to the LLM.

The field is **OPTIONAL** at the top level. When omitted, consumers **MUST NOT** infer absence of configuration — only absence of disclosure.

`pipeline_config` defines a small set of standardized sub-fields representing common-ground configuration that any producer can reasonably surface. It also accepts arbitrary additional keys (`additionalProperties: true` in the schema), allowing producers to attach their own configuration namespace without breaking validation. Standardized sub-fields are described below; producer-specific extensions are out of scope for this specification.

#### Standardized sub-fields

- **`language_hint`** — A [BCP 47] language tag passed to the ASR engine as a hint (`"en"`, `"ru"`, `"en-US"`). May be `null` if auto-detection was used. Distinct from `transcript.language`, which records the *result* of detection or specification; `language_hint` records the *input*.

- **`chunking`** — An object describing how the source audio was segmented for processing. Sub-fields:
    - **`strategy`** — One of `"none"` (whole-file pass), `"fixed_duration"` (regular interval slicing), `"vad"` (voice-activity-detection-driven), or `"silence"` (silence-detected boundaries).
    - **`chunk_duration_sec`** — Target chunk length in seconds when `strategy` is `"fixed_duration"`. May be `null` when not applicable.
    - **`overlap_sec`** — Overlap between adjacent chunks in seconds, when applicable. May be `null`.

- **`output_stages`** — An array of stage names that were enabled in this pipeline run. Permitted values: `"summary"`, `"action_items"`, `"decisions"`, `"participants"`. The array **MUST** have unique entries. Allows consumers to distinguish *intentional absence* of a derived block (the stage was disabled) from *missing data* (the stage failed or the producer chose not to disclose).

- **`prompt_template_digest`** — A SHA-256 hash (lowercase hex) of the prompt template(s) used for LLM-driven stages, concatenated in a producer-defined order. May be `null` when no LLM stages were run, or when the producer cannot or chooses not to disclose the digest. Enables consumers to detect when a producer's prompts have changed between runs, even when model name and version remain stable.

#### Why these sub-fields and not more

`pipeline_config` is deliberately small. The four standardized sub-fields cover the cases where divergence between producers most often surprises consumers: an unexpected ASR language hint, a chunking strategy that affects timestamp accuracy, an output stage silently disabled, or a changed prompt regime that explains drift in downstream content. Producer-specific configuration (whisper threads, ollama keep-alive timeouts, audio normalization filters) does not need standardization to be useful — it goes under producer-namespaced keys via `additionalProperties`.

#### Hash naming convention

Fields holding hashes are named for their algorithm (`prompt_template_digest` is SHA-256). If a future version standardizes additional hash algorithms, new fields **MUST** be added as siblings (e.g., `prompt_template_digest_blake3`) rather than as renames or as algorithm-agnostic fields with a separate `algorithm` discriminator. This keeps the schema self-documenting and avoids the validation complexity of agility-by-discriminator.

## Versioning

This specification follows [semantic versioning] at the document level:

- **Patch** versions (`0.1.0` → `0.1.1`): clarifications, doc fixes, no schema changes that affect validation.
- **Minor** versions (`0.1.0` → `0.2.0`): backward-compatible additions. New optional fields, new optional `$defs`, new examples. Documents valid under `0.1.x` remain valid under `0.2.x` at the same major version.
- **Major** versions (`0.x` → `1.0`, `1.x` → `2.0`): breaking changes. Field renames, removals, type changes, required field additions.

The `schema_version` field in each document **MUST** match a published version. Consumers **SHOULD** accept any minor version within the major version they target.

`0.x` is explicitly an unstable major. `1.0` will be the first stable contract. From `v1.0.0` onward, this specification commits to a minimum 3-year window with no breaking changes.

## Security & Privacy Considerations

This section is normative for considerations producers and consumers should be aware of, even where the schema itself does not enforce them.

### What memnex protects

- **Source integrity.** The `source.sha256` field allows any consumer to verify, by re-hashing the audio file, that a memnex document references unmodified source material.
- **Pipeline transparency.** The `provenance` block makes the production pipeline auditable: a reviewer can read off which engine, model, and parameters produced each derived block, without trusting the producer's claims about its own behaviour.
- **No required network calls.** A memnex document is fully self-contained. Validators **MUST NOT** require dereferencing of the schema URI to validate a document; the schema is identified by URI but consumed locally.

### What memnex does not protect

- **LLM output reproducibility.** memnex records which model and runtime produced each block, but it does **not** guarantee that re-running the pipeline with the same inputs yields identical output. Modern LLM runtimes are non-deterministic even at `temperature: 0` due to floating-point non-associativity in parallel matrix operations, model loading order, and runtime-specific scheduling. The provenance block enables *inspection*, not *replay*.
- **Author identity.** memnex documents are not signed in `v0.1.0`. A future version is expected to define an optional `signature` field carrying a detached cryptographic signature. Until then, document origin **MUST NOT** be inferred from `provenance.producer` alone.
- **Diarization stability.** When `participants` and `speaker_id` are present, they reflect the diarizer's output at production time. Re-running diarization may produce different speaker assignments. Producers **SHOULD NOT** treat `participants[].id` as a stable identity outside the document.

### Privacy considerations for producers

- **File paths.** The `source.file_name` field is specified as a basename to avoid leaking filesystem layout. Producers **MUST NOT** populate it with a full path, and **SHOULD NOT** populate it with relative paths containing directory components.
- **Personal names.** `assignee` and `participants[].name` fields may contain personally identifiable information. Producers **SHOULD** consider local privacy obligations (GDPR, CCPA, sector-specific regulations) before storing, transmitting, or publishing memnex documents containing such data.
- **Audio retention.** memnex documents are derivatives of audio recordings. Privacy obligations attached to the source audio (consent, retention limits, jurisdictional restrictions) generally apply equally to memnex documents derived from it.
- **Host identification.** The optional `provenance.host_hash` field is provided for producers that need to group documents from the same machine. Producers **SHOULD** use a salt that is itself unique to a privacy boundary (e.g., per-user, per-project) and **MUST NOT** include the salt in the document. Reusing a global static salt undermines the field's privacy benefit and is **NOT RECOMMENDED**.

### Considerations for consumers

- **Untrusted producers.** A memnex document is structured data, not a trust statement. Consumers **MUST NOT** assume that the values in `provenance` accurately describe what a producer actually did. A malicious or buggy producer can claim any model and any version. Verification, where required, **MUST** rely on cryptographic signing (forthcoming) or out-of-band trust.
- **Source verification.** Consumers that have access to the original audio **SHOULD** verify `source.sha256` matches a re-computed hash before relying on derived content.
- **Host grouping is not identity.** Consumers **MUST NOT** treat `provenance.host_hash` as a verified identifier of a machine or user. It is a producer-controlled grouping signal under a producer-controlled salt; it does not survive salt rotation, and a malicious producer can fabricate it. Use it for de-duplication and clustering, not for trust decisions.

## Reference Implementations

The reference producer for memnex `v0.1.0` is [Samuraizer], a local-first CLI tool that processes meeting audio recordings into memnex documents using whisper.cpp (transcription) and Ollama (summarization, action item and decision extraction).

The reference validator and TypeScript type definitions are published as the [`memnex-spec`] npm package. The validator is built on [Ajv] with format extensions and accepts any JSON value, returning either a typed document or a list of validation errors.

Implementations in other languages are welcomed. Conformance test suites are published alongside this specification:

- [`conformance/`](./conformance/) — v0.1 suite (frozen at 15 cases)
- [`conformance/v0.2/`](./conformance/v0.2/) — v0.2 suite (17 cases; backward-compatibility-tested against v0.1 fixtures)

Each suite has its own README documenting the test matrix, runner invocation, and matching semantics. Implementers SHOULD run the suite matching the `schema_version` they intend to produce or consume.

## Governance & Stability

This specification is currently maintained under a transitional BDFL model by [Uladz Kha]. Decisions are made through public GitHub issues and pull requests at <https://github.com/UladzKha/memnex>.

Breaking changes **MUST** be accompanied by a major version bump and **MUST** be preceded by a minimum 30-day public discussion window. This governance model is explicitly transitional. As adoption grows, the project intends to evolve toward a multi-stakeholder governance model, potentially under the umbrella of a neutral foundation such as [The Commons Conservancy], [OASIS], or a W3C Community Group.

See [GOVERNANCE.md](./GOVERNANCE.md) for the full governance statement, contribution model, and stability commitment.

## Open Questions

The following are open design questions for future versions. They are noted, not decided. Feedback is welcomed.

- Should `transcript.segments[].text` be required, or should a segment with only a confidence drop and no text be permitted (silence/noise markers)?
- Should `summary` gain optional structured subfields (`headline`, `bullets`) without breaking the free-text default?
- Should `action_items[].priority` be added, and if so, with what enum?
- Should signed outputs be defined in this same schema or as a thin wrapper schema that embeds this one?
- Is `due_date_iso` enough, or do we also need `due_date_window` for "by end of week" → start/end pairs?
- Should the specification adopt a stronger reproducibility claim once LLM runtimes mature (e.g., when deterministic inference becomes widely available), and if so, what additional fields are needed?
- Should `participants[].id` be cross-document stable (e.g., for tracking a person across meetings) or strictly document-local (as it is now)?

## References

### Normative

- [RFC 2119] — Key words for use in RFCs to Indicate Requirement Levels
- [RFC 8174] — Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words
- [RFC 3339] — Date and Time on the Internet: Timestamps
- [RFC 9562] — Universally Unique IDentifiers (UUIDs)
- [BCP 14] — RFC 2119 and RFC 8174 combined
- [BCP 47] — Tags for Identifying Languages
- [JSON Schema 2020-12] — JSON Schema specification (Draft 2020-12)
- [ULID] — Universally Unique Lexicographically Sortable Identifier specification
- [semantic versioning] — Semantic Versioning 2.0.0

### Informative

- [PROV-O] — W3C Provenance Ontology, conceptual ancestor of the provenance approach
- [C2PA] — Coalition for Content Provenance and Authenticity, parallel work on media chain-of-custody
- [Schema.org Action] — Cross-domain action vocabulary, informative comparison for `action_items`
- [WebVTT] — Forthcoming target for accessibility extensions (subtitle generation)

---

[RFC 2119]: https://www.rfc-editor.org/rfc/rfc2119
[RFC 8174]: https://www.rfc-editor.org/rfc/rfc8174
[RFC 3339]: https://www.rfc-editor.org/rfc/rfc3339
[RFC 9562]: https://www.rfc-editor.org/rfc/rfc9562
[BCP 14]: https://www.rfc-editor.org/info/bcp14
[BCP 47]: https://www.rfc-editor.org/info/bcp47
[JSON Schema 2020-12]: https://json-schema.org/draft/2020-12/schema
[ULID]: https://github.com/ulid/spec
[semantic versioning]: https://semver.org/spec/v2.0.0.html
[PROV-O]: https://www.w3.org/TR/prov-o/
[C2PA]: https://c2pa.org/specifications/specifications/2.1/index.html
[Schema.org Action]: https://schema.org/Action
[WebVTT]: https://www.w3.org/TR/webvtt1/
[Samuraizer]: https://github.com/UladzKha/samuraizer-cli
[`memnex-spec`]: https://www.npmjs.com/package/memnex-spec
[Ajv]: https://ajv.js.org/
[Uladz Kha]: https://github.com/UladzKha
[The Commons Conservancy]: https://commonsconservancy.org/
[OASIS]: https://www.oasis-open.org/