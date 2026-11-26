# Genfeed presets

The public catalogue of Genfeed presets: the starting points the Genfeed app offers for generating images and video, and the free listings in the Genfeed shop.

Each preset is a folder, `<group>/<key>/preset.json`, so a thumbnail or example can sit beside it later. Groups:

| Group | What it holds |
| --- | --- |
| `studio` | Studio starting points: profile picture, banner, thumbnail, meme, animation, edits |
| `ad` | Video ad presets with their prompt sections |
| `cinematic` | Cinematic short presets with shot plans |
| `b2b` | B2B playbooks with reference slots and allowed models |

The folder name is the preset's `key` and never changes: the app database and the shop both identify a preset by it.

Change a preset by pull request, then run `node scripts/validate.mjs`. The Genfeed app pins this repository at a commit and loads the pinned copy into its database, and the shop sync reads the same files, so a merged change reaches both when the pin moves.

Licensed MIT, like [genfeedai/skills](https://github.com/genfeedai/skills).
