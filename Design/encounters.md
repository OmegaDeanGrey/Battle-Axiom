# Encounter Framework

Encounter selection is data-driven and kept separate from the combat engine. The engine owns turns, targeting, damage, status effects, and victory/defeat. Authoritative reward resolution in `src/battle/progression/resolveBattleOutcome.ts` owns per-hero XP, level, skill point, and HP results shown in the resolution modal and committed by `GameContext`.

## Layout

```text
src/battle/encounters/
  encounterTypes.ts       shared encounter, condition, and dialogue types
  encounterRegistry.ts    location pools and location difficulty
  encounterGenerator.ts   scripted/random selection, dialogue gate, difficulty scaling
  scriptedEncounters.ts   named scripted parties and opening dialogue
  encounterProgress.ts    session completion tracking and outcome guards

src/battle/enemies/
  enemyDefinitions.ts     enemy stats, abilities, tags, and instance creation
```

## Selection flow

1. A location id is resolved from the battle route (`/battle/:locationId`, defaulting to `twell-outskirts`).
2. `generateLocationEncounter(locationId, options)` reads `ENCOUNTER_LOCATIONS`.
3. If the location has an unfinished `firstEncounterId` whose conditions are met, the scripted party and opening dialogue are returned.
4. Otherwise, `soloEncounters` are checked first with independent whole-encounter chance rolls.
5. If a solo encounter wins its roll, exactly one exclusive enemy is returned and it is excluded from pack rolls.
6. If no solo encounter is selected, a random enemy count is chosen uniformly from `minEnemies` through `maxEnemies`.
7. Each enemy slot independently runs weighted selection over `enemyWeights` after exclusive solo ids are excluded.
8. Every enemy is created as a fresh `Unit` with its own id, HP, statuses, and timeline.
9. The battle route freezes the generated encounter for the lifetime of the battle mount and passes its units and dialogue to `BattleView`.

`random` and `createId` can be injected through `GenerateEncounterOptions` for deterministic tests. Production uses `Math.random` and `crypto.randomUUID`.

## Add a new enemy type

1. Add the id to `EnemyId` in `src/battle/encounters/encounterTypes.ts`.
2. Add a definition to `ENEMY_DEFINITIONS` in `src/battle/enemies/enemyDefinitions.ts`. Use the existing `Unit` fields and existing abilities from `src/battle/abilities`; no new combat mechanics are required.
3. Add a visual entry to `CHARACTER_VISUALS` in `src/battle/visuals/battleVisualAssets.ts`. The key must match one of the resolver keys derived from the unit id, name, or hero class. For names with spaces, the normalized key uses underscores (for example, `King Goblin` resolves through `king_goblin`).
4. Place artwork in `public/battle/characters/<key>/` (or use a placeholder SVG) and point the visual entry's `poses.idle` at the file.
5. Add the enemy id and weight to any location pool where it should appear.

Enemy stats are baseline `Unit` values. Twell Outskirts uses this relative difficulty curve:

| Enemy | HP | Attack | Defense | Speed | Role |
|---|---:|---:|---:|---:|---|
| Goblin | 100 | 15 | 15 | 20 | baseline pack enemy |
| Hobgoblin | 170 | 22 | 22 | 22 | tougher veteran |
| Orc | 260 | 30 | 30 | 16 | slow, durable bruiser |
| Nightmare | 340 | 36 | 26 | 30 | fast magical threat |
| King Goblin | 620 | 40 | 38 | 24 | scripted leader |

Victory XP comes from `calculateBattleRewards`, which sums enemy reward data and scripted overrides. It is resolved once into per-hero progress; `checkVictory` no longer grants a flat award.

## Create a new location pool

Add an entry to `ENCOUNTER_LOCATIONS`:

```ts
"northern-road": {
  id: "northern-road",
  difficulty: {
    levelOffset: 1,
    statScale: 1.05
  },
  randomEncounters: {
    minEnemies: 2,
    maxEnemies: 5,
    enemyWeights: [
      { enemyId: "goblin", weight: 50 },
      { enemyId: "orc", weight: 35 }
    ],
    soloEncounters: [
      { enemyId: "nightmare", chance: 0.05 }
    ]
  }
}
```

`difficulty.levelOffset` and `difficulty.statScale` are applied only to generated enemies. Heroes and combat formulas are untouched.

Add an artwork entry to `BATTLE_BACKGROUNDS` in `battleVisualAssets.ts` when the new location has its own battlefield art. Navigate to `/battle/<location-id>` to use the pool.

## Define a scripted first encounter

1. Add an entry to `SCRIPTED_ENCOUNTERS` in `scriptedEncounters.ts` with a stable `id`, ordered `enemies`, and optional `openingDialogue`.
2. Set `firstEncounterId` on the location config to that id.
3. Each `enemies` entry takes an `enemyId` and an optional `displayName` (used for the Goblin Henchmen, which are ordinary Goblin units with a script-specific label).
4. Dialogue lines use the existing `{ speaker, portrait, text }` convention from `src/game/dialogue` and are rendered with the existing `DialogueBox`.
5. Optional `conditions` may require completed quests, story flags, defeated bosses, or a minimum party level. Conditions are evaluated against `EncounterContext`.

Completion is stored in `GameContext.completedScriptedEncounters` and is only written after a player victory in `BattleScreen.handleBattleEnd`. Defeat, exit, and interruption do not mark it complete. The update is idempotent.

## Configure weighted probabilities

Weights are relative probabilities per enemy slot, not whole-encounter templates. For Twell Outskirts:

| Enemy | Weight | Share of pack rolls |
|---|---:|---:|
| Goblin | 70 | 73.7% |
| Hobgoblin | 15 | 15.8% |
| Orc | 10 | 10.5% |

Nightmare is no longer a pack enemy. It is an exclusive solo encounter with a 5% whole-encounter chance in Twell Outskirts. `selectWeightedEnemy(weights, random)` uses a single roll over the summed weights and is exported for direct testing.

## Connect encounters to battle initialization

`App.tsx` is the only production call site of `generateLocationEncounter`. It freezes the encounter and cloned units in a state initializer, then passes them to `BattleView`. On battle end it builds one authoritative `BattleResult`, shows `BattleResolutionModal` for a victory, and commits through `applyBattleResult`. For scripted encounters only, the result also calls `completeScriptedEncounter`. `canResolveEncounterOutcome`, `outcomeResolved`, and `outcomeCommitted` guard against duplicate resolution and duplicate reward/completion handling.

`BattleView` gates targeting, ability selection, skill buttons, Next Tick, and engine-level `tick`/`act` while the opening dialogue is active. The gate uses `createDialogueGateState`, `isDialogueActive`, `currentDialogueLine`, and `advanceDialogue` from `encounterGenerator`.

## Register artwork

Use the existing registry in `src/battle/visuals/battleVisualAssets.ts`:

```ts
king_goblin: {
  poses: {
    idle: "/battle/characters/king-goblin-placeholder.svg"
  },
  scale: 1.16,
  offsetY: 4,
  facing: "right",
  accent: "#f0c84e"
}
```

The King Goblin uses a crowned placeholder and a larger scale so it is visually distinct from ordinary Goblins while the real art is pending.

## Tests

Run:

```bash
npm test
```

The suite is bundled with the project's existing Rolldown dependency and executed with Node's built-in test runner. It covers scripted composition and dialogue, input gating, first-encounter tracking, random counts and membership, exclusive solo encounters, deterministic weighted selection, unique instance ids, engine compatibility, HP/XP continuity, duplicate reward prevention, purchase rules, authoritative progression, HP bounds, environmental regions, and a large deterministic distribution simulation.
