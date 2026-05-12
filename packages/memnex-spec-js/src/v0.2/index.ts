/**
 * memnex-spec/v0.2 — version-pinned entry for the v0.2 schema.
 *
 * Public API (identical shape to v0.1):
 * - validate (data): runtime validation against v0.2 schema
 * - isValid (data): type guard variant
 * - schema: the raw v0.2 JSON Schema document
 * - MeetingOutput, ValidationResult, ValidationError: v0.2 types
 *
 * Specification: https://github.com/UladzKha/memnex
 */

import schema from "../../spec/v0.2/meeting-output.schema.json" with { type: "json" };

export { validate, isValid } from "./validate.js";
export type { ValidationResult, ValidationError } from "./validate.js";
export type { MeetingOutput } from "../../dist/v0.2/types.js";

/**
 * The raw v0.2 JSON Schema document.
 */
export { schema };
