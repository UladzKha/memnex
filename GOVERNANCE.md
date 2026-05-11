# Governance

## Status

memnememnex v0.1 is published as a draft specification with a working reference implementation. The schema is stable within v0.1.x; breaking changes will follow the versioning policy in [GOVERNANCE.md](./GOVERNANCE.md).

- **Specification:** see [SPEC.md](./SPEC.md) and [schema/v0.1/](./schema/v0.1/)
- **Reference implementation:** [`memnex-spec`](https://www.npmjs.com/package/memnex-spec) on npm
- **Reference adopter:** [Samuraizer](https://github.com/UladzKha/samuraizer-cli) (local-first meeting processing CLI)
- **Conformance suite:** [conformance/](./conformance/) — 15 test cases, ajv-based reference runner

Pre-v1.0 versions are experimental. Stability commitment kicks in from v1.0.0.x is currently maintained by Uladz Kha (BDFL model) as a bootstrap phase. This governance model is explicitly transitional. As adoption grows, the project intends to evolve toward a multi-stakeholder governance model, potentially under the umbrella of a neutral foundation (e.g., The Commons Conservancy, OASIS, or W3C Community Group).

## Decision-making

Decisions about the specification are made through public GitHub issues and pull requests. The maintainer reviews proposals, solicits feedback in the open, and merges changes once consensus or reasonable resolution is reached.

For non-breaking changes (clarifications, new optional fields, documentation), decisions can be made within a single PR cycle. For breaking changes (see Versioning), a 30-day public discussion window is required before merge.

## Versioning

memnex follows semantic versioning:

- **Patch (0.1.0 → 0.1.1):** editorial fixes, typo corrections, non-normative clarifications. No schema changes.
- **Minor (0.1.0 → 0.2.0):** backward-compatible schema additions (new optional fields, new examples, new conformance cases). Existing valid documents remain valid.
- **Major (0.x.x → 1.0.0):** breaking changes. New required fields, renames, removed fields, changed semantics. Requires 30-day public discussion window before merge.

The `schema_version` field in produced documents always reflects the full semver of the schema they conform to.

## Stability commitment

Starting from v1.0.0, memnex commits to:

- No breaking changes to the schema for a minimum of 3 years from the v1.0.0 release date.
- Backward-compatible additions only within the v1.x series.
- Any future breaking change (v2.0.0) will be announced at least 12 months before release, with migration guidance.

Pre-v1.0 versions are explicitly experimental and may change between minor versions.

## Conflict of interest disclosure

The current maintainer (Uladz Kha) is also the author of [Samuraizer](https://github.com/UladzKha/samuraizer-cli), the first reference implementation of memnex. The maintainer commits to:

- Treating Samuraizer as one implementation among many, not as the privileged definition of the spec.
- Designing schema changes to serve the broader ecosystem, not Samuraizer-specific needs.
- Welcoming and prioritizing second-implementation feedback when it surfaces ecosystem gaps.

This dual role is transitional. As additional implementations adopt memnex, governance will move toward multi-stakeholder.

## Code of Conduct

This project adopts the [Contributor Covenant Code of Conduct v2.1](./CODE_OF_CONDUCT.md). All contributors are expected to abide by it.

## How to propose changes

1. Open a GitHub issue describing the problem or proposal.
2. Discuss in the open. The maintainer (or others) will respond and refine.
3. Once direction is clear, submit a PR referencing the issue.
4. For breaking changes, the 30-day window starts when the PR is opened with a `[BREAKING]` tag in the title.
5. Merging requires passing conformance suite and maintainer approval.

## How to escalate

If you believe a governance decision was made incorrectly or in bad faith, open a public issue with the `governance` label. The maintainer will respond publicly. If unresolved, escalation paths through future foundation governance will be added once that transition occurs.
