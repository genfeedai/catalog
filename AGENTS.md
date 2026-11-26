# AGENTS.md

This repository is the public catalogue of Genfeed presets. Each preset is `<group>/<key>/preset.json`; the folder name is the key and never changes.

- Open a pull request from a short-lived branch. Never push to `master`.
- Run `node scripts/validate.mjs` before you open it.
- Do not put customer, lead or private brand names in a preset.
- The Genfeed app pins this repository and loads the pinned copy; the shop sync reads the same files. Do not rename a key: both identify a preset by it.
