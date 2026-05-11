# Contributing to memnex

Thanks for your interest. memnex is an open specification — contributions of any size are welcome.

## How to contribute

- **Spec proposals, clarifications, examples:** open a GitHub issue or pull request.
- **Conformance test cases:** add to `conformance/test-cases/valid/` or `conformance/test-cases/invalid/`. Run `cd conformance && npm test` to verify.
- **Reference implementation (`memnex-spec` npm package):** see `packages/memnex-spec-js/`.

## Before submitting a PR

- Run the conformance suite: `cd conformance && npm test`. All 15 tests must pass.
- If you changed `schema/v0.1/meeting-output.schema.json`, run `cd packages/memnex-spec-js && npm run build` to regenerate types.
- Follow existing style. No special tooling required.

## Governance

See [GOVERNANCE.md](./GOVERNANCE.md) for the decision-making process, versioning policy, and how breaking changes are handled.

## Code of Conduct

This project adopts the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).
