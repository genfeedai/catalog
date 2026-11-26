#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const groups = Object.keys(catalog.groups);
const errors = [];
const keys = new Set();
let count = 0;

for (const group of groups) {
  const listed = catalog.groups[group];
  const folders = readdirSync(path.join(root, group)).filter((name) =>
    statSync(path.join(root, group, name)).isDirectory()
  );
  for (const key of listed) {
    if (!folders.includes(key)) errors.push(`${group}/${key}: listed in catalog.json but has no folder`);
  }
  for (const folder of folders) {
    const label = `${group}/${folder}`;
    if (!listed.includes(folder)) errors.push(`${label}: has a folder but is not listed in catalog.json`);
    let preset;
    try {
      preset = JSON.parse(readFileSync(path.join(root, group, folder, 'preset.json'), 'utf8'));
    } catch (error) {
      errors.push(`${label}: preset.json is missing or is not valid JSON (${error.message})`);
      continue;
    }
    count += 1;
    if (preset.key !== folder) errors.push(`${label}: key "${preset.key}" must match the folder name`);
    for (const field of ['label', 'description']) {
      if (typeof preset[field] !== 'string' || !preset[field].trim()) {
        errors.push(`${label}: ${field} must be a non-empty string`);
      }
    }
    if (keys.has(preset.key)) errors.push(`${label}: key "${preset.key}" is used twice`);
    keys.add(preset.key);
  }
}

for (const entry of readdirSync(root)) {
  if (
    statSync(path.join(root, entry)).isDirectory() &&
    !entry.startsWith('.') &&
    entry !== 'scripts' &&
    !groups.includes(entry)
  ) {
    errors.push(`${entry}: not a group listed in catalog.json`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`${count} presets are valid`);
