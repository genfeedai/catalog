# AGENTS.md

This repository is the public Genfeed catalog: `presets/`, `prompts/` and `workflows/`. Skills belong in `genfeedai/skills`, not here.

| Item | Path |
| --- | --- |
| Preset | `presets/<group>/<key>/preset.json`, listed in `presets/catalog.json` |
| Prompt | `prompts/<key>/prompt.json` |
| Workflow | `workflows/<key>/workflow.json` |

- The folder name is the key and never changes. Do not rename a key: the app database and the shop sync identify a preset by it.
- Open a pull request from a short-lived branch. Never push to `master`.
- Run `node scripts/validate.mjs` before you open it.
- Do not add other top-level folders; the validator rejects them.
- Do not put customer, lead or private brand names in the catalog.
- The Genfeed app pins this repository and loads the pinned copy; the shop sync reads the same files.
