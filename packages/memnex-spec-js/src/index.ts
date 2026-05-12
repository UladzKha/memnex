/**
 * memnex-spec — reference JavaScript/TypeScript implementation
 * of the memnex specification for meeting outputs.
 *
 * Public API:
 * - validate (data): runtime validation with detailed errors
 * - isValid (data): type guard variant
 * - schema: the raw JSON Schema document, for downstream tools
 * - MeetingOutput, ValidationResult, ValidationError: types
 *
 * Specification: https://github.com/UladzKha/memnex
 */

import schema from "../spec/v0.1/meeting-output.schema.json" with { type: "json" };

export { validate, isValid } from "./validate.js";
export type { ValidationResult, ValidationError } from "./validate.js";
export type { MeetingOutput } from "../dist/v0.1/types.js";

/**
 * The raw JSON Schema document. Useful for tools that want to compile
 * their own validator (e.g. with a different ajv configuration) or
 * generate language bindings beyond TypeScript.
 */
export { schema };