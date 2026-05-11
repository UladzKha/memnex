# memnex-spec

Reference JavaScript/TypeScript implementation of the [memnex specification](https://github.com/UladzKha/memnex) — an open standard for portable meeting outputs.

This package provides:

- A runtime validator built on [ajv](https://ajv.js.org/) (JSON Schema Draft 2020-12)
- TypeScript types generated directly from the schema
- The raw schema document, for downstream tools

## Install

```bash
npm install memnex-spec
```

## Usage

```typescript
import { validate, isValid, schema, type MeetingOutput } from "memnex-spec";

// Detailed validation with error reporting
const result = validate(JSON.parse(text));
if (result.valid) {
    const meeting: MeetingOutput = result.data;
    console.log(meeting.meeting_id);
} else {
    for (const err of result.errors) {
        console.error(`${err.path}: ${err.message}`);
    }
}

// Type guard variant
if (isValid(data)) {
    // data is narrowed to MeetingOutput
}
```

## Subpath exports

```typescript
// Raw JSON Schema
import schema from "memnex-spec/schema";

// Example meeting outputs
import minimal from "memnex-spec/examples/minimal";
import full from "memnex-spec/examples/full";

// Types only (no runtime dependency)
import type { MeetingOutput } from "memnex-spec/types";
```

## What is memnex?

memnex is an open specification for storing meeting recordings as structured data: a single JSON document that combines transcript, summary, action items, decisions, and provenance metadata, in a format any tool can read and write.

The full specification lives at [github.com/UladzKha/memnex](https://github.com/UladzKha/memnex).

## Version compatibility

| `memnex-spec` package | memnex schema version |
| --------------------- | --------------------- |
| `0.1.x`               | `0.1`                 |

## License

MIT. See [LICENSE-CODE](https://github.com/UladzKha/memnex/blob/main/LICENSE-CODE) at the repository root.