#!/usr/bin/env node
/**
 * Sync canonical files from repo root into package dir.
 *
 * Single source of truth lives at:
 *   - schema/v0.1/meeting-output.schema.json
 *   - schema/v0.2/meeting-output.schema.json
 *   - examples/{minimal,full}.json                    (v0.1 examples, flat)
 *   - examples/v0.2/{minimal,full,full-with-config}.json   (v0.2 examples)
 *   - LICENSE-CODE
 *
 * Copies into package dir under version subdirectories so they ship with
 * `npm pack` / `npm publish`. Generated files are gitignored; this script
 * runs automatically before build and before pack.
 *
 * Output layout:
 *   spec/v0.1/meeting-output.schema.json
 *   spec/v0.1/examples/{minimal,full}.json
 *   spec/v0.2/meeting-output.schema.json
 *   spec/v0.2/examples/{minimal,full,full-with-config}.json
 *   LICENSE
 */

import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "..", "..");

const copies = [
    // v0.1 schema + examples
    {
        from: path.join(repoRoot, "schema", "v0.1", "meeting-output.schema.json"),
        to: path.join(packageRoot, "spec", "v0.1", "meeting-output.schema.json"),
    },
    {
        from: path.join(repoRoot, "examples", "minimal.json"),
        to: path.join(packageRoot, "spec", "v0.1", "examples", "minimal.json"),
    },
    {
        from: path.join(repoRoot, "examples", "full.json"),
        to: path.join(packageRoot, "spec", "v0.1", "examples", "full.json"),
    },

    // v0.2 schema + examples
    {
        from: path.join(repoRoot, "schema", "v0.2", "meeting-output.schema.json"),
        to: path.join(packageRoot, "spec", "v0.2", "meeting-output.schema.json"),
    },
    {
        from: path.join(repoRoot, "examples", "v0.2", "minimal.json"),
        to: path.join(packageRoot, "spec", "v0.2", "examples", "minimal.json"),
    },
    {
        from: path.join(repoRoot, "examples", "v0.2", "full.json"),
        to: path.join(packageRoot, "spec", "v0.2", "examples", "full.json"),
    },
    {
        from: path.join(repoRoot, "examples", "v0.2", "full-with-config.json"),
        to: path.join(packageRoot, "spec", "v0.2", "examples", "full-with-config.json"),
    },

    // License
    {
        from: path.join(repoRoot, "LICENSE-CODE"),
        to: path.join(packageRoot, "LICENSE"),
    },
];

async function main() {
    for (const { from, to } of copies) {
        await mkdir(path.dirname(to), { recursive: true });
        await copyFile(from, to);
        console.log(`Synced ${path.relative(repoRoot, from)} -> ${path.relative(packageRoot, to)}`);
    }
}

main().catch(err => {
    console.error("Failed to sync spec files:", err);
    process.exit(1);
});
