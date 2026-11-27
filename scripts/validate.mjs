#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const topFolders = ['presets', 'prompts', 'workflows', 'scripts'];
const errors = [];

const isFolder = (relative) => statSync(path.join(root, relative)).isDirectory();

function entries(relative) {
  if (!existsSync(path.join(root, relative))) {
    errors.push(`${relative}: folder is missing`);
    return [];
  }
  return readdirSync(path.join(root, relative));
}

const subfolders = (relative) => entries(relative).filter((name) => isFolder(`${relative}/${name}`));

function readObject(relative) {
  try {
    const value = JSON.parse(readFileSync(path.join(root, relative), 'utf8'));
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
    errors.push(`${relative}: must hold a JSON object`);
  } catch (error) {
    errors.push(`${relative}: is missing or is not valid JSON (${error.message})`);
  }
  return null;
}

// Checks one <folder>/<file> item: key matches the folder, fields are filled, key is used once.
function checkItem(folder, file, fields, keys) {
  const item = readObject(`${folder}/${file}`);
  if (!item) return 0;
  const name = path.basename(folder);
  if (item.key !== name) errors.push(`${folder}: key "${item.key}" must match the folder name`);
  for (const field of fields) {
    if (typeof item[field] !== 'string' || !item[field].trim()) {
      errors.push(`${folder}: ${field} must be a non-empty string`);
    }
  }
  if (keys.has(item.key)) errors.push(`${folder}: key "${item.key}" is used twice`);
  keys.add(item.key);
  return 1;
}

function checkPresets() {
  const groups = readObject('presets/catalog.json')?.groups ?? {};
  const keys = new Set();
  let count = 0;
  for (const [group, listed] of Object.entries(groups)) {
    const folders = subfolders(`presets/${group}`);
    for (const key of listed) {
      if (!folders.includes(key)) {
        errors.push(`presets/${group}/${key}: listed in catalog.json but has no folder`);
      }
    }
    for (const folder of folders) {
      if (!listed.includes(folder)) {
        errors.push(`presets/${group}/${folder}: has a folder but is not listed in catalog.json`);
      }
      count += checkItem(`presets/${group}/${folder}`, 'preset.json', ['label', 'description'], keys);
    }
  }
  for (const folder of subfolders('presets')) {
    if (!folder.startsWith('.') && !Object.hasOwn(groups, folder)) {
      errors.push(`presets/${folder}: not a group listed in catalog.json`);
    }
  }
  return count;
}

// A flat folder of <key>/<file> items, with a README.md beside them.
function checkFlat(top, file, fields) {
  const keys = new Set();
  let count = 0;
  for (const name of entries(top)) {
    if (name.startsWith('.') || name === 'README.md') continue;
    if (!isFolder(`${top}/${name}`)) {
      errors.push(`${top}/${name}: expected a <key>/${file} folder`);
      continue;
    }
    count += checkItem(`${top}/${name}`, file, fields, keys);
  }
  return count;
}

const counts = {
  presets: checkPresets(),
  prompts: checkFlat('prompts', 'prompt.json', ['label', 'description', 'text']),
  workflows: checkFlat('workflows', 'workflow.json', ['label']),
};

for (const entry of readdirSync(root)) {
  if (isFolder(entry) && !entry.startsWith('.') && !topFolders.includes(entry)) {
    errors.push(`${entry}: not a catalog folder (expected ${topFolders.join(', ')})`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
for (const [folder, count] of Object.entries(counts)) {
  console.log(`${folder}: ${count} valid`);
}
