#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const GROUPS = ['studio', 'ad', 'cinematic', 'b2b'];
const errors = [];
const keys = new Set();
let count = 0;

for (const group of GROUPS) {
  const groupDir = path.join(root, group);
  for (const folder of readdirSync(groupDir).sort()) {
    const dir = path.join(groupDir, folder);
    if (!statSync(dir).isDirectory()) continue;
    const label = `${group}/${folder}`;
    let preset;
    try {
      preset = JSON.parse(readFileSync(path.join(dir, 'preset.json'), 'utf8'));
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

for (const group of readdirSync(root)) {
  if (statSync(path.join(root, group)).isDirectory() && !group.startsWith('.') &&
    !GROUPS.includes(group) && group !== 'scripts') {
    errors.push(`${group}: not a known group (${GROUPS.join(', ')})`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`${count} presets are valid`);
