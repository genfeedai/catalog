# Genfeed catalog

The public catalog of the data the Genfeed app builds on: presets, prompts and workflows.

| Folder | What it holds |
| --- | --- |
| `presets/` | The starting points the Genfeed app offers for generating images and video, and the free listings in the Genfeed shop |
| `prompts/` | Reusable prompts. Format in [`prompts/README.md`](prompts/README.md) |
| `workflows/` | Workflows kept as data. Format in [`workflows/README.md`](workflows/README.md) |

Skills are not kept here. They live in [genfeedai/skills](https://github.com/genfeedai/skills).

## Presets

Each preset is a folder, `presets/<group>/<key>/preset.json`, so a thumbnail or example can sit beside it later. Groups:

| Group | What it holds |
| --- | --- |
| `studio` | Studio starting points: profile picture, banner, thumbnail, meme, animation, edits |
| `ad` | Video ad presets with their prompt sections |
| `cinematic` | Cinematic short presets with shot plans |
| `b2b` | B2B playbooks with reference slots and allowed models |

`presets/catalog.json` lists the groups and the order the app shows the presets in.

## Keys

In every folder the item's folder name is its `key`, and a key never changes: the app database and the shop identify a preset by it.

## Changes

Change the catalog by pull request, then run `node scripts/validate.mjs`. The Genfeed app pins this repository at a commit and loads the pinned copy into its database, and the shop sync reads the same files, so a merged change reaches both when the pin moves.

Licensed MIT, like [genfeedai/skills](https://github.com/genfeedai/skills).
