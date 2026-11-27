# Workflows

Workflows kept as data, one folder each: `workflows/<key>/workflow.json`. This folder may be empty.

The full workflow format and its schema are tracked in [genfeedai/genfeed.ai#11492](https://github.com/genfeedai/genfeed.ai/issues/11492). Until then the validator only checks that:

- `workflow.json` is a valid JSON object
- `key` equals the folder name. It never changes.
- `label` is a non-empty string

Run `node scripts/validate.mjs` from the repository root before you open a pull request.
