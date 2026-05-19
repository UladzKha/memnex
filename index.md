---
layout: default
title: memnex
---

# memnex

**An open specification for portable meeting outputs.**

memnex defines a JSON schema for the structured artifacts that meeting-processing tools produce — transcripts, summaries, action items, decisions, and participants — in a way that is portable across tools, durable across versions, and free of vendor lock-in.

It is designed for local-first applications, where meeting recordings and their derivatives stay on the user's machine but remain interoperable with other software they may use over time.

---

## Status

- **Current version:** v0.2 ([schema]({{ '/schema/v0.2/meeting-output.schema.json' | relative_url }}))
- **Previous version:** v0.1 (frozen, [schema]({{ '/schema/v0.1/meeting-output.schema.json' | relative_url }}))
- **Listed in:** [SchemaStore.org](https://www.schemastore.org/)
- **Reference implementation:** [Samuraizer CLI](https://github.com/UladzKha/samuraizer-cli)

## Resources

- **Specification:** [SPEC.html](/SPEC.html)
- **Changelog:** [CHANGELOG (GitHub)](https://github.com/UladzKha/memnex/blob/main/CHANGELOG.md)
- **Governance:** [GOVERNANCE (GitHub)](https://github.com/UladzKha/memnex/blob/main/GOVERNANCE.md)
- **Source repository:** [github.com/UladzKha/memnex](https://github.com/UladzKha/memnex)
- **JavaScript package:** [memnex-spec on npm](https://www.npmjs.com/package/memnex-spec)

## License

Dual-licensed:

- **Specification text:** [CC0 1.0](https://github.com/UladzKha/memnex/blob/main/LICENSE-SPEC) (public domain)
- **Reference code and validation utilities:** [MIT](https://github.com/UladzKha/memnex/blob/main/LICENSE-CODE)

---

<small>memnex is independently maintained. Discussion happens via GitHub issues. See [GOVERNANCE](https://github.com/UladzKha/memnex/blob/main/GOVERNANCE.md) for how decisions are made.</small>
