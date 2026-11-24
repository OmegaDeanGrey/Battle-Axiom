# Battle Axiom — Side-View Battle Presentation

## Artwork locations

Place custom artwork in `public/` so it can be swapped without rebuilding battle logic:

```text
public/battle/
  backgrounds/
    placeholder-field.svg      temporary painted-field placeholder
    <location>.png|webp         custom battlefield backgrounds
  characters/
    placeholder-character.svg  temporary full-body silhouette
    <character>/idle.png        one transparent full-body pose per state
    <character>/attack.png
    <character>/casting.png
    <character>/damage.png
    <character>/defeated.png
    <character>/victory.png
```

Use transparent PNG or WebP for character art. SVG works for placeholders. Draw feet at the bottom of the image and leave transparent padding to the canvas edges; the layout anchors artwork to the battlefield ground and never stretches it.

## Registering characters

Edit `src/battle/visuals/battleVisualAssets.ts` → `CHARACTER_VISUALS`. Keys are matched, in order, against `unit.id`, `unit.name.toLowerCase()`, `unit.heroClass.toLowerCase()`, and the name with spaces/hyphens replaced by underscores (for example, `Baby Dragon` matches `baby_dragon`). The first match wins.

```ts
knight: {
  poses: {
    idle: "/battle/characters/knight/idle.webp",
    attack: "/battle/characters/knight/attack.webp",
    casting: "/battle/characters/knight/casting.webp",
    damage: "/battle/characters/knight/damage.webp",
    defeated: "/battle/characters/knight/defeated.webp",
    victory: "/battle/characters/knight/victory.webp"
  },
  scale: 1.1,       // relative size; 1 is the default
  offsetX: 0,       // horizontal nudge in px within the formation slot
  offsetY: 2,       // vertical nudge in px (higher value = higher on screen)
  facing: "left",   // "left" faces the enemy side; "right" faces the hero side
  accent: "#e3c46a" // cast-effect glow color
}
```

Omit any pose that is not finished. A missing pose falls back to that character's `idle` image, then to the generic placeholder. Defeated and victory poses fall back the same way; CSS still applies desaturation/fallover and a gentle victory motion when dedicated artwork is absent.

For an enemy, set `facing: "right"`. If a character entry omits `facing`, it defaults by team: enemies face right, heroes face left. Artwork created facing the opposite direction can simply flip `facing` rather than editing the image.

`scale`, `offsetX`, and `offsetY` are per character so composition can be tuned without CSS exceptions. Width and height are derived from the artwork's aspect ratio; no distortion is applied.

## Registering backgrounds

`BATTLE_BACKGROUNDS` in the same file maps a location id to an image URL:

```ts
export const BATTLE_BACKGROUNDS: Record<string, string> = {
  default: "/battle/backgrounds/placeholder-field.svg",
  "twell-outskirts": "/battle/backgrounds/twell-outskirts.webp"
}
```

`BattleView` receives the location through its optional `backgroundId` prop (currently `"twell-outskirts"` from `App.tsx`). Unknown ids fall back to `default`. Backgrounds use `background-size: cover`, so they fill the stage at any desktop width without letterboxing.

## How poses are selected

- `idle` — default state, with a subtle breathing motion.
- `attack` — physical attack (lunge toward target, impact, recoil, damage number).
- `casting` — magic/support (cast ring at caster, spell/heal effect at target).
- `damage` — recoil/shake when hit.
- `defeated` — used when displayed HP reaches zero; stays on screen, desaturated and toppled.
- `victory` — surviving heroes after a player win.

## Data flow

Combat remains unchanged. `src/battle/events/combatEvents.ts` defines a read-only event stream (`turn-start`, `ability-used`, `damage`, `heal`, `status-applied`, `status-tick`, `miss`, `defeat`, `victory`) that the engine records into `BattleState.combatEvents` alongside its existing log. `useBattlePresentation` plays those events back in order, drives floating numbers and the delayed HP bars, and locks input while a sequence is running. The registry and event types are plain TypeScript with no React dependency, so they can be reused by a different renderer later.

## Known limitations

- The engine is single-target, so one `ability-used` event has one target. Multiple effect events (damage plus status, etc.) are supported and played in order.
- There is no hit/miss roll in the engine; the `miss` visual is implemented but no event is emitted yet.
- Poses are static images with CSS motion, not sprite sheets or skeletal animation.
