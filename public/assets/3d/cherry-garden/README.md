# Cherry garden assets

## Active runtime tree

- Generator: [`@dgreenheck/ez-tree`](https://github.com/dgreenheck/ez-tree)
- License: MIT.
- Use: deterministic branch, bark, and blossom geometry generated in the browser, with a shared-geometry lateral crown for the reference's long overhanging bough.

This is the tree system currently rendered by `CherryGarden3D`. The supplied screenshot and Figma frame are visual references only and are never rendered as the scene background.

## `ajimano-sakura.glb`

- Source: [code4fukui/vr-ajimano](https://github.com/code4fukui/vr-ajimano)
- Direct source file: [ajimano-sakura.glb](https://github.com/code4fukui/vr-ajimano/blob/main/ajimano-sakura.glb)
- Description: photogrammetry-scanned single cherry-blossom tree from the Ajimano Elementary School digital-preservation project.
- Attribution: Code for FUKUI / Digital Twin Echizen Production Executive Committee.
- License: CC BY Open Data, as stated in the source repository.
- Local size: approximately 2.1 MB.
- Status: retained as an attributed source experiment, but not loaded by the active scene because its single-view scan produced a flatter silhouette than the supplied reference.

All visible cherry-garden scenery is live Three.js geometry.
