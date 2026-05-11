cat > conformance/README.md << 'EOF'
# Conformance suite

Test cases that any implementation of memnex must pass to claim conformance with the specification.

## Structure

- `test-cases/valid/` — Documents that MUST validate successfully
- `test-cases/invalid/` — Documents that MUST fail validation, each accompanied by an `.expected.json` describing the expected error

## Running

A reference runner is provided in `runner.ts`. Implementations in other languages are encouraged to write their own runner against the same test cases.

```bash
npx tsx runner.ts
```

(Content lands during spec extraction phase, May 11-13, 2026.)
EOF