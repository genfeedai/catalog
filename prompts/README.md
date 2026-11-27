# Prompts

Reusable prompts, one folder each: `prompts/<key>/prompt.json`. This folder may be empty.

| Field | Rule |
| --- | --- |
| `key` | Equals the folder name. It never changes. |
| `label` | Non-empty string |
| `description` | Non-empty string |
| `text` | Non-empty string: the prompt itself |

Run `node scripts/validate.mjs` from the repository root before you open a pull request.
