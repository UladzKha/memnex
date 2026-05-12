/**
 * memnex-spec/v0.1 — version-pinned entry for the v0.1 schema.
 *
 * Public API (identical shape to v0.2):
 * - validate (data): runtime validation against v0.1 schema
 * - isValid (data): type guard variant
 * - schema: the raw v0.1 JSON Schema document
 * - MeetingOutput, ValidationResult, ValidationError: v0.1 types
 *
 * Specification: https://github.com/UladzKha/memnex
 */

import schema from "../../spec/v0.1/meeting-output.schema.json" with { type: "json" };

export { validate, isValid } from "./validate.js";
export type { ValidationResult, ValidationError } from "./validate.js";
export type { MeetingOutput } from "../../dist/v0.1/types.js";

/**
 * The raw v0.1 JSON Schema document.
 */
export { schema };
