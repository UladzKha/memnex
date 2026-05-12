#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { compileFromFile } from 'json-schema-to-typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const distDir = path.join(packageRoot, "dist");

const versions = [
    {
        version: "v0.1",
        schemaPath: path.join(packageRoot, "spec", "v0.1", "meeting-output.schema.json"),
        outputPath: path.join(distDir, "v0.1", "types.d.ts"),
        sourceRef: "schema/v0.1/meeting-output.schema.json",
    },
    {
        version: "v0.2",
        schemaPath: path.join(packageRoot, "spec", "v0.2", "meeting-output.schema.json"),
        outputPath: path.join(distDir, "v0.2", "types.d.ts"),
        sourceRef: "schema/v0.2/meeting-output.schema.json",
    },
];

function makeBanner(sourceRef) {
    return `/**
 * AUTO-GENERATED. Do not edit by hand.
 *
 * Generated from the memnex specification schema (${sourceRef}).
 * To regenerate, run: npm run build --workspace=memnex-spec
 */
`;
}

async function generate({ version, schemaPath, outputPath, sourceRef }) {
    const ts = await compileFromFile(schemaPath, {
        bannerComment: makeBanner(sourceRef),
        additionalProperties: false,
        strictIndexSignatures: true,
        style: { singleQuote: false, semi: true, },
        format: true
    });

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, ts, "utf-8");

    const sourceSchema = JSON.parse(await readFile(schemaPath, "utf-8"));
    console.log(`Generated ${path.relative(packageRoot, outputPath)}`);
    console.log(`  Schema: ${sourceSchema.$id}`);
    console.log(`  Version: ${sourceSchema.properties.schema_version.const}`);
}

async function main() {
    for (const v of versions) {
        await generate(v);
    }
}

main().catch(err => {
    console.error("Failed to generate types: ", err);
    process.exit(1);
});
