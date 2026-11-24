# Environmental Exploration

Environmental examination is a lightweight, data-driven way to let players inspect meaningful details in existing Twell artwork without adding new scenes, changing NPC dialogue, or introducing new lore.

## Files

```text
src/game/data/EnvironmentalObjectRegistry.ts
src/game/data/environmentalRegion.ts
src/game/components/EnvironmentalLayer.tsx
src/game/components/EnvironmentalExaminationModal.tsx
src/game/components/EnvironmentalExaminationModal.css
src/battle/test/environment.test.ts
Design/environmental-exploration.md
```

`GameContext` also exposes `examinedObjects: string[]` and `examineObject(objectId)`. The history is session-scoped and idempotent; repeated examinations show the standard description instead of the first-observation text.

## Registry

Each entry contains:

- a stable `EnvironmentalObjectId`
- the background id it belongs to (`twell`, `weaponShop`, `inn`)
- the existing background image path and source dimensions
- a normalized region (`left`, `top`, `width`, `height` from 0 to 1)
- a `cover` or `contain` fit mode matching the background CSS
- prompt, name, description, and optional first-observation description

Current objects:

| Id | Background | Prompt |
|---|---|---|
| `twell-windmills` | `twell` | Examine the turning sails |
| `twell-fountain` | `twell` | Listen to the fountain |
| `weapon-shop-stone` | `weaponShop` | Examine the stone display |
| `inn-hearth` | `inn` | Warm yourself by the hearth |

The windmill and fountain entries are used in the Twell hub. The stone display and hearth entries are used inside their existing location modals. The stone display region sits near the existing Twellian Stone relic marker; the marker still opens relic inspection, while the environmental hotspot provides atmosphere only.

## Region math

`regionToStyle` converts a source-image region into CSS percentages for the current container size. It mirrors `background-size`:

- `cover`: scale by the larger of width/height scale, then center-crop.
- `contain`: scale by the smaller of width/height scale, then center-letterbox.

A `ResizeObserver` supplies the container size. The hotspots are transparent circular buttons laid over the background; no artwork is modified or regenerated.

All source images are treated as `1536 × 1024`. The Twell hub, weapon shop, and inn use the existing images at their existing paths.

## Provisional nature of positions

The current regions are intentionally provisional. They were chosen from CSS overlay positions, dialogue references, and image aspect ratios; the implementation does not claim the artwork has been visually re-annotated. Descriptions are atmospheric and do not establish new story facts.

When tuning:

1. Change only the `region` and optional `fit` in the registry.
2. Keep prompt text short enough for a small hotspot label.
3. Add or update a deterministic `environment.test.ts` assertion for any math or grouping change.
4. Do not move existing NPC or relic markers unless explicitly requested.

## Adding an object

1. Add an id to `EnvironmentalObjectId`.
2. Add a definition to `ENVIRONMENTAL_OBJECTS`.
3. Ensure the target background uses the same `fit` mode in CSS.
4. Render `<EnvironmentalLayer backgroundId="..." />` inside a positioned container for that background.
5. Run `npm test`, typecheck, lint, and build.

## Future story flags

`examinedObjects` is intentionally generic. If an examination should change later dialogue or unlock content, add a specific flag to `GameContext` and read it from the relevant dialogue condition instead of giving environmental text new lore responsibility.
