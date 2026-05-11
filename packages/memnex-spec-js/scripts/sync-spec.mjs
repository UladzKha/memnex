#!/usr/bin/env node
/**
 * Sync canonical files from repo root into package dir.
 *
 * Single source of truth lives at:
 *   - schema/v0.1/meeting-output.schema.json
 *   - examples/*.json
 *   - LICENSE-CODE
 *
 * Copies into package dir so they ship with `npm pack` / `npm publish`.
 * Generated files are gitignored; this script runs automatically
 * before build and before pack.
 */

import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "..", "..");

const copies = [
    {
        from: path.join(repoRoot, "schema", "v0.1", "meeting-output.schema.json"),
        to: path.join(packageRoot, "spec", "meeting-output.schema.json"),
    },
    {
        from: path.join(repoRoot, "examples", "minimal.json"),
        to: path.join(packageRoot, "spec", "examples", "minimal.json"),
    },
    {
        from: path.join(repoRoot, "examples", "full.json"),
        to: path.join(packageRoot, "spec", "examples", "full.json"),
    },
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