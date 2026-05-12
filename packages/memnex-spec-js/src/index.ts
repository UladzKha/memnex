/**
 * memnex-spec — reference JavaScript/TypeScript implementation
 * of the memnex specification for meeting outputs.
 *
 * This module re-exports the latest schema version (currently v0.2).
 * For version-pinned imports, use:
 *   - `memnex-spec/v0.1` — pin to v0.1 schema
 *   - `memnex-spec/v0.2` — pin to v0.2 schema (same as default)
 *
 * Public API:
 * - validate (data): runtime validation against latest schema
 * - isValid (data): type guard variant
 * - schema: the raw JSON Schema document for the latest version
 * - MeetingOutput, ValidationResult, ValidationError: types
 *
 * Specification: https://github.com/UladzKha/memnex
 */

export { validate, isValid, schema } from "./v0.2/index.js";
export type { ValidationResult, ValidationError, MeetingOutput } from "./v0.2/index.js";
