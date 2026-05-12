/**
 * memnex conformance runner (reference implementation)
 *
 * Validates every file in test-cases/valid/ and test-cases/invalid/ against
 * the memnex v0.2 JSON Schema using AJV (Draft 2020-12).
 *
 * Exit code: 0 if all cases pass, 1 otherwise.
 *
 * Implementers writing runners in other languages should use the same test
 * cases and apply the same at-least-one matching semantics described below.
 */

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Resolve paths relative to this file so the runner works from any CWD.
const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "..", "schema", "v0.2", "meeting-output.schema.json");
const validDir   = join(__dirname, "test-cases", "valid");
const invalidDir = join(__dirname, "test-cases", "invalid");

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));

// allErrors: true — collect every violation rather than stopping at the first,
// so the matching logic has the full error set to work with.
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

let passed = 0;
let failed = 0;

// ---------------------------------------------------------------------------
// Valid cases — expect validation success
// ---------------------------------------------------------------------------

const validFiles = readdirSync(validDir)
  .filter(f => f.endsWith(".json"))
  .sort();

for (const file of validFiles) {
  const doc = JSON.parse(readFileSync(join(validDir, file), "utf8"));
  const ok  = validate(doc);

  if (ok) {
    console.log(`✅  valid/${file}`);
    passed++;
  } else {
    console.log(`❌  valid/${file}`);
    console.log("    Expected valid — actual errors:");
    for (const e of validate.errors) {
      console.log(`      [${e.keyword}] ${e.instancePath || "(root)"}: ${e.message}`);
    }
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Invalid cases — expect validation failure, then check the error matches
// ---------------------------------------------------------------------------

const invalidFiles = readdirSync(invalidDir)
  .filter(f => f.endsWith(".json") && !f.endsWith(".expected.json"))
  .sort();

for (const file of invalidFiles) {
  const stem = file.slice(0, -5); // strip ".json"
  const doc  = JSON.parse(readFileSync(join(invalidDir, file), "utf8"));
  const ok   = validate(doc);

  if (ok) {
    console.log(`❌  invalid/${file}`);
    console.log("    Expected invalid — document passed validation unexpectedly");
    failed++;
    continue;
  }

  const actualErrors = validate.errors;
  const expected = JSON.parse(
    readFileSync(join(invalidDir, `${stem}.expected.json`), "utf8")
  );

  // At-least-one keyword match: exact-set matching is too brittle because AJV
  // often emits multiple related errors for the same violation (e.g. "type"
  // plus "const" when both constraints apply).  Requiring that at least one
  // actual keyword appears in the expected set is sufficient for unambiguous
  // attribution while tolerating AJV's multi-error output.
  const keywordOk = actualErrors.some(e =>
    expected.expected_error_keywords.includes(e.keyword)
  );

  // At-least-one path match: we accept the expected path as a substring of the
  // actual instancePath so that "" (document root) and partial pointers like
  // "/action_items/0" remain valid specs even when the exact sub-path varies
  // between AJV versions.
  const pathOk = actualErrors.some(e =>
    expected.expected_error_paths.some(p =>
      e.instancePath === p || e.instancePath.includes(p)
    )
  );

  if (keywordOk && pathOk) {
    console.log(`✅  invalid/${file}`);
    passed++;
  } else {
    console.log(`❌  invalid/${file}`);
    if (!keywordOk) {
      const actual = [...new Set(actualErrors.map(e => e.keyword))];
      console.log(`    keyword mismatch:`);
      console.log(`      expected one of: ${JSON.stringify(expected.expected_error_keywords)}`);
      console.log(`      actual:          ${JSON.stringify(actual)}`);
    }
    if (!pathOk) {
      const actual = [...new Set(actualErrors.map(e => e.instancePath))];
      console.log(`    path mismatch:`);
      console.log(`      expected one of: ${JSON.stringify(expected.expected_error_paths)}`);
      console.log(`      actual:          ${JSON.stringify(actual)}`);
    }
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const total = passed + failed;
console.log(`\n${total} total — ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
