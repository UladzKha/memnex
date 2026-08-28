import { validate } from "memnex-spec";
import example from "memnex-spec/examples/v0.2/minimal" with { type: "json" };

const result = validate(example);

if (!result.valid) {
  console.error(result.errors);
  process.exitCode = 1;
} else {
  console.log(`Valid memnex ${example.schema_version} document: ${example.meeting_id}`);
}
