# memnex

**Make meeting output portable.** Add one JSON export that any meeting app, local AI agent, or MCP server can read.

memnex is a small, vendor-neutral contract for transcripts, summaries, action items, decisions, and provenance. It is CC0, versioned, and validated with JSON Schema. Your app keeps its own UX and storage; memnex is the interchange layer.

### For adopters

Install `memnex-spec`, map your output to the schema, run the conformance fixtures, and ship a `*.memnex.json` example:

```bash
npm install memnex-spec
```

```ts
import { validate } from "memnex-spec";

const result = validate(meetingOutput);
if (!result.valid) throw new Error(JSON.stringify(result.errors));
await writeFile("meeting.memnex.json", JSON.stringify(meetingOutput, null, 2));
```

At minimum, emit `schema_version: "0.2.0"`, keep transcript segment IDs stable, populate `source_segment_ref` for derived decisions and actions where possible, record producer and pipeline provenance, run the [v0.2 conformance suite](./conformance/v0.2/), and publish one example.

### Already using an MCP server?

Expose the same memnex document through a resource or tool so agents can query meeting history without learning a vendor-specific shape. [Samuraizer](https://github.com/UladzKha/samuraizer-cli) is the reference implementation.

### Try it in 60 seconds

Run the validator against the bundled v0.2 example:

```bash
mkdir memnex-demo && cd memnex-demo
npm init -y
npm install memnex-spec
curl -O https://raw.githubusercontent.com/UladzKha/memnex/main/examples/quickstart.mjs
node quickstart.mjs
```

The example source is [`examples/v0.2/minimal.json`](./examples/v0.2/minimal.json), and the complete runnable script is [`examples/quickstart.mjs`](./examples/quickstart.mjs).

The specification remains available below for implementers who need the full contract.

Current version: v0.2 (May 2026). See [SPEC.md](./SPEC.md) for the full specification.

The [`memnex-spec`](https://www.npmjs.com/package/memnex-spec) package on npm is the reference TypeScript/JavaScript validator. [Samuraizer](https://github.com/UladzKha/samuraizer-cli) is a reference adopter — a local-first meeting processing CLI that produces memnex-conforming outputs.

## Status

memnex `v0.2.0` is the current draft specification. `v0.1.0` remains valid and supported — v0.2 is a backward-compatible minor release; documents valid under v0.1 remain valid under v0.2. The schema is stable within each minor series; breaking changes will follow the versioning policy in [GOVERNANCE.md](./GOVERNANCE.md). See [CHANGELOG.md](./CHANGELOG.md) for the full release history.

- **Specification:** see [SPEC.md](./SPEC.md), [schema/v0.1/](./schema/v0.1/), and [schema/v0.2/](./schema/v0.2/)
- **Reference implementation:** [`memnex-spec`](https://www.npmjs.com/package/memnex-spec) on npm (v0.2.0)
- **Reference adopter:** [Samuraizer](https://github.com/UladzKha/samuraizer-cli) (local-first meeting processing CLI)
- **Conformance suites:**
  - [conformance/](./conformance/) — v0.1 (15 test cases, frozen)
  - [conformance/v0.2/](./conformance/v0.2/) — v0.2 (17 test cases)

Pre-v1.0 versions are experimental. Stability commitment kicks in from v1.0.0.

## Governance and stability

memnex is maintained under a BDFL bootstrap model with an explicit transition path toward multi-stakeholder governance. See [GOVERNANCE.md](./GOVERNANCE.md) for the decision-making process, versioning policy, conflict-of-interest disclosure, and the post-v1.0 stability commitment (no breaking changes for 3 years).

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

This repository uses a dual-license model:

- **Specification documents** (`SPEC.md`, schema files in `schema/`, examples in `examples/`) are dedicated to the public domain under [CC0 1.0](./LICENSE-SPEC).
- **Reference code** (validators, type definitions, test runners) is licensed under [MIT](./LICENSE-CODE).

This separation exists so the specification itself can be freely adopted, copied, and re-implemented without any licensing friction, while code contributions remain attributable.
