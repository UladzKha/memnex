# memnex

An open specification for verifiable, agent-accessible meeting data.

Draft v0.1 — work in progress. First public release expected May 2026.

A reference implementation is being developed as part of [Samuraizer](https://github.com/UladzKha/samuraizer-cli).

## Status

memnex v0.1 is published as a draft specification with a working reference implementation. The schema is stable within v0.1.x; breaking changes will follow the versioning policy in [GOVERNANCE.md](./GOVERNANCE.md).

- **Specification:** see [SPEC.md](./SPEC.md) and [schema/v0.1/](./schema/v0.1/)
- **Reference implementation:** [`memnex-spec`](https://www.npmjs.com/package/memnex-spec) on npm
- **Reference adopter:** [Samuraizer](https://github.com/UladzKha/samuraizer-cli) (local-first meeting processing CLI)
- **Conformance suite:** [conformance/](./conformance/) — 15 test cases, ajv-based reference runner

Pre-v1.0 versions are experimental. Stability commitment kicks in from v1.0.0.

## Governance and stability

memnex is maintained under a BDFL bootstrap model with an explicit transition path toward multi-stakeholder governance. See [GOVERNANCE.md](./GOVERNANCE.md) for the decision-making process, versioning policy, conflict-of-interest disclosure, and the post-v1.0 stability commitment (no breaking changes for 3 years).

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

This repository uses a dual-license model:

- **Specification documents** (`SPEC.md`, schema files in `schema/`, examples in `examples/`) are dedicated to the public domain under [CC0 1.0](./LICENSE-SPEC).
- **Reference code** (validators, type definitions, test runners) is licensed under [MIT](./LICENSE-CODE).

This separation exists so the specification itself can be freely adopted, copied, and re-implemented without any licensing friction, while code contributions remain attributable.