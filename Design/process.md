# Process Log — Session Changes

Scope: this document covers the changes made in the recent working sessions. The repository
also contains uncommitted work that predates these edits (shop menus, sleep sequence, relationship
and skill-tree screens, synergy and skill-tree engine work, etc.); that work is not described here.

## 1. Windmill Row location modal

Goal: make the Windmill Row interior behave like the other Twell location modals and give it
NPC interaction, a tavern entrance, and an exit that opens the world map.

### New files

- `src/game/dialogue/twell/windmillMiller.ts` — Miller Garrick dialogue; portrait `/InnPatron1.png`.
- `src/game/dialogue/twell/windmillApprentice.ts` — Milla dialogue; portrait `/TwellWomanVillager.png`.
- `src/game/dialogue/twell/windmillTraveler.ts` — Old Rowan dialogue; portrait `/InnPatron2.png`.

These three NPCs are intentional placeholder content created because no named Windmill Row
residents existed in the codebase. Their lines reference the existing lore (strange lights beyond
the windmills, unrest on the outskirts, the Mayor's request).

### Modified files

- `src/pages/Twell/LocationModal.tsx`
  - Added props: `onWindmillMillerClick`, `onWindmillApprenticeClick`,
    `onWindmillTravelerClick`, `onExitTwell`.
  - Added `tavernBubbleOpen` state.
  - Windmill Row now renders three `npc-marker` buttons (`windmill-miller-marker`,
    `windmill-apprentice-marker`, `windmill-traveler-marker`), a `Tavern Entrance` button, a
    dismissible text bubble reading `we do not have time for that now, the Mayor needs us`, and
    an `Exit Twell` button.
  - The close button clears the bubble state before calling `onClose`.
- `src/pages/Twell/useTwellDialogue.ts`
  - Added three dialogue index/setter pairs for the new NPCs and exported them.
- `src/pages/Twell/DialogueRenderer.tsx`
  - Added `windmillMiller`, `windmillApprentice`, and `windmillTraveler` dialogue configs.
- `src/pages/Twell/TwellTown.tsx`
  - Imported the three new dialogue arrays, wired the marker callbacks and renderer configs,
    and added `handleExitTwell()` which calls `setTownOutskirtsUnlocked(true)`, closes the modal,
    and navigates to `/world`.
- `src/pages/WorldMap.tsx`
  - Imported `useGame` and conditionally rendered the `TwellOutskirtsButton` when
    `townOutskirtsUnlocked` is true.
- `src/pages/WorldMap.css`
  - Added `#TwellOutskirtsButton` styling (small world-map marker near Twell).
- `src/pages/Twell/Twell.css` (at the time)
  - Added styling for the Windmill Row close button, the three NPC marker positions, the tavern
    entrance button and its speech bubble, and the Exit Twell button. These rules were later
    moved during the CSS split described below.

Marker positions are approximate because the `WindmillRow.png` background could not be viewed
directly; they were placed using percentage-based offsets inside the modal.

## 2. CSS split of Twell.css

Goal: one stylesheet per Twell module, named after the component it styles.

- Deleted `src/pages/Twell/Twell.css`.
- Created:
  - `src/pages/Twell/TwellTown.css` — page background and the fade-to-black sleep overlay.
  - `src/pages/Twell/TwellBackground.css` — birds, waterfalls, fountains, windmills, keyframes.
  - `src/pages/Twell/TownLocationButtons.css` — town buttons, exit/audio buttons, town NPC markers.
  - `src/pages/Twell/LocationModal.css` — modal shell, all per-location interiors, shared
    `npc-marker`, tavern UI, and candle/fire effects.
- Added the matching CSS import to each component: `TwellTown.tsx`, `TwellBackground.tsx`,
  `TownLocationButtons.tsx`, `LocationModal.tsx`.

Verification: all 126 selectors from the original stylesheet were accounted for in the four new
files (no missing or extra selectors), and declaration blocks matched apart from one intentional
pre-existing `position: relative` addition to `.town-modal`.

## 3. Tavern bubble fade-out

Goal: keep the message readable, then fade it away automatically.

- `src/pages/Twell/LocationModal.tsx` — the bubble now has
  `onAnimationEnd={() => setTavernBubbleOpen(false)}`, so it unmounts after the animation and can
  be shown again on a later click.
- `src/pages/Twell/LocationModal.css` — added
  `animation: tavernBubbleFade .4s ease-in 2s forwards` plus the `@keyframes tavernBubbleFade`
  rule that animates opacity to 0 and sets `visibility: hidden`.

Effect: message holds for two seconds, fades over 0.4 seconds, then disappears.

## 4. Twell Outskirts → first battle

Goal: launch the existing battle system directly from the world map, with a clean future hook
for a first-visit story.

### World Map

- `src/pages/WorldMap.tsx`
  - Added `handleTwellOutskirtsEnter()` as the single entry function; it currently only calls
    `navigate("/battle")`.
  - Wired it to the `TwellOutskirtsButton` `onClick`.

This is the deliberate insertion point for a later flow change to
`World Map → First-Visit Story → Battle`. No story flag or persistent state was added.

### Battle route

- `src/App.tsx`
  - Removed the broken `applyBattleResults` destructure from `useGame()` and the corresponding
    `onBattleEnd` wiring; `GameContext` has never defined that method, so this was a typecheck
    failure.
  - Removed the now-unused `BattleState` import; added `useNavigate`.
  - `BattleScreen` now receives `relationships` from context, clones the current `party` with
    `structuredClone`, appends the temporary encounter units, and renders `BattleView`.
  - Added a `Return to World Map` button that navigates to `/world`.

No combat rules, engine functions, or progression logic were changed. Battle setup, turn order,
actions, victory/defeat detection, and XP granting remain the existing implementations. The
battle is recreated on each visit because `BattleView` remounts when the route changes. The
absence of reward wiring was temporary; section 7 documents the later `onBattleEnd` connection.

### Temporary encounter data

- `createTwellOutskirtsTestEncounter()` in `src/App.tsx` returns `[createGoblin()]`, using the
  existing `src/battle/units/enemies/goblin.ts` definition. This is the only enemy available and
  is the same one used by `src/battle/test/testBattle.ts`. No new enemy model or stats were added.

## 5. Verification performed

At the time of the original edits:

- `npx vite build` — passed (124 modules transformed).
- `npm run build` (`tsc -b && vite build`) — still failed on two pre-existing, unrelated errors in
  `src/game/components/SkillTreeScreen.tsx` (`updateHero` missing from `GameContext`, implicit
  `any` on `heroCopy`). The previous `App.tsx` type error was resolved by these changes.
- `npm run lint` — unchanged pre-existing errors/warning in `GameContext.tsx`, `TwellTown.tsx`,
  `useTwellDialogue.ts`, and `useBattle.ts`; no new findings in files changed here.
- `src/battle/test/testBattle.ts` bundled with esbuild and run under Node — passed; the log shows
  the goblin attacking, the Knight taking damage/critical damage, and the Knight's turn starting.

After the later changes in section 7, `npm run build` now passes (125 modules transformed), so the
two `SkillTreeScreen.tsx` type errors are resolved. Current lint and test results are listed in
section 7. No browser gameplay was exercised; no automated test script exists in `package.json`.

## 6. Known issues and manual checks

- Pre-existing engine gap: `checkVictory` is only called from `performAction`, so a defeat caused
  by an enemy killing the last player during its own turn may not set `winner: "enemy"`. This was
  left untouched to avoid changing combat rules.
- Manually confirm in the browser: unlock Windmill Row via the Mayor, enter Windmill Row, talk to
  the three NPCs, open the tavern bubble and watch it fade, use Exit Twell, click Twell Outskirts
  on the world map, play a battle, return to the world map, and re-enter for a fresh encounter.
- A party must be selected first (via `/party`); no hardcoded fallback party was added.

## 7. Battle reward persistence and global party state

Goal: carry battle results back into permanent hero state and make shared game state (gold,
inventory, relationships, recruited heroes) available from the app shell.

### GameContext

- `src/game/context/GameContext.tsx`
  - Added `InventoryId` (`ItemId | RelicId`) and an `Inventory` type backed by
    `Partial<Record<InventoryId, number>>`.
  - Added state for `relationships`, `recruitedHeroes`, `gold` (initial value 100), `inventory`,
    and `mayorRewardClaimed`; consolidated the existing location-unlock state under the provider.
  - Added actions: `updateHero`, `commitBattleResults`, `addItem`, `removeItem`, `healParty`,
    `registerHeroes`, and the corresponding setters for the new state.
  - `registerHeroes` deduplicates heroes by id and refreshes relationship member metadata with
    `registerRelationshipMembers`.
  - `updateHero` finds a hero in `party` or `recruitedHeroes`, clones it, applies the updater, and
    writes the updated hero to both collections.
  - `commitBattleResults` calls `commitBattleProgress(prev, battleUnits)` for both `party` and
    `recruitedHeroes`. Level, XP, skill points, skill tree, abilities, and the derived stats
    calculated by `commitBattleProgress` now survive the battle.
  - `addItem`/`removeItem` change item quantities and delete the key when the count reaches zero.
    `healParty` restores HP to `maxHp` and clears statuses.

### App shell and battle route

- `src/App.tsx`
  - Reads `relationships` and `commitBattleResults` from `useGame()` and renders
    `GlobalPartyButton` above the routes, so the party screen is reachable from any route.
  - `BattleScreen` now accepts `relationships` and `onBattleComplete`. It clones the party with
    `structuredClone` before building the encounter, guards the completion callback with a
    `useRef` flag and a `battle.winner === "player"` check, and passes it to `BattleView` as
    `onBattleEnd`. Rewards are therefore committed once, only on a win, and never written directly
    to the live party clones used during the fight.
  - The `Return to World Map` button from the earlier session is unchanged.

### Integration checks

- Added `src/battle/test/testProgressionIntegration.ts` with 14 assertions covering: victory
  detection and XP granted to the battle clone, persistence of XP/level/skill points/skill tree
  into committed party and recruited-roster state, isolation of other party members, the
  one-shot completion callback and idempotence of a duplicate commit, skill-point spending on the
  correct hero, and defeat producing neither rewards nor permanent progression changes.

### Verification performed

- `npm run build` (`tsc -b && vite build`) — passed (125 modules transformed); the two
  `SkillTreeScreen.tsx` type errors recorded in section 5 are resolved.
- `testProgressionIntegration.ts` bundled with
  `npx esbuild ... --bundle --platform=node --format=esm --loader:.png=dataurl` and run under Node
  — all 14 checks passed.
- `npm run lint` — 7 problems (6 errors, 1 warning). Two errors are new in `GameContext.tsx`: the
  unused `_` binding from the `removeItem` key deletion and the `react-refresh/only-export-components`
  rule caused by exporting `InventoryId` from the context module. The remaining findings are the
  existing ones in `TwellTown.tsx`, `useTwellDialogue.ts`, and `useBattle.ts`.
- No browser gameplay was exercised; `package.json` still has no test script.

### Known issues and manual checks

- The `TwellTown.tsx` lint error is a real ordering problem in the inn handler that calls
  `healParty`: `setInnMorningDialogueIndex` is used in a callback before its `useState` is
  declared. It does not block the build but should be fixed.
- Manually confirm: open the global party button on each route, win a battle, return to the world
  map, reopen the party screen, and verify that XP, level, skill points, and spent skill ranks
  persisted; lose a battle and verify that no XP was granted; sleep at the inn and verify the
  party is healed.

---

## 2026-05-24 (continued) — items, turn fairness, rewards, resolution modal, visuals

- **Turns:** `BattleState.actedThisCycleIds`, cycle-aware selection in `src/battle/engine/battleEngine.ts`, `endTurn` tracks acted/reset; Knight base speed restored to 10. Deterministic tests in `src/battle/test/turnSystem.test.ts` (included in `npm test`).
- **Items:** `ItemRegistry` combat metadata, `Action` item path, item target validation (`src/battle/engine/itemTargets.ts`), `resolveAction`/`resolveEffect` (+`removeStatus`, `status-removed`), `useBattle` removes inventory once on committed action. `BattleInventoryModal.tsx`, Items UI in `BattleView.tsx`.
- **Rewards:** enemy/scripted reward data + `src/battle/engine/rewards.ts` (`calculateBattleRewards`, injectable RNG). `GameContext.BattleResult` + `applyBattleResult` (progress via `commitBattleProgress`, gold/items, scripted completion on victory). `App.tsx` victory flow uses `BattleResolutionModal.tsx` then commit + navigate to World Map.
- **Visuals:** character glow/backlight in `BattleCharacter.tsx`, `BattleView.css`.

---

## 2026-11-24 — encounters, purchases, authoritative rewards, growth, HP bounds, exploration

### Scope completed

- **Exclusive solo encounters:** `RandomEncounterConfig.soloEncounters` and `ExclusiveSoloEncounterConfig` added in `encounterTypes.ts`. Nightmare removed from `enemyWeights` and configured as a 5% exclusive solo roll in `encounterRegistry.ts`. `encounterGenerator.ts` now checks solo encounters first and excludes solo ids from packs. Scripted encounters carry `conclusion` in `GeneratedEncounter`.
- **Relic purchasing:** `purchaseRules.ts` added; `GameContext.purchase` performs atomic gold/inventory transactions using synchronous refs. `LocationModal.tsx` now buys items and relics through `purchase`, shows gold/owned state, and reports outcome text. `PartyScreenModal.tsx` displays relics without treating them as normal items. `economy.test.ts` covers purchase rules. Relic uniqueness is currently enforced by the shop call with `{ unique: true }` and remains provisional because no separate ownership/unlock registry exists.
- **Authoritative rewards:** `resolveBattleOutcome.ts` produces per-hero reward rows and final battle units from `calculateBattleRewards`. `App.tsx` resolves once, shows `BattleResolutionModal` from that result, and commits once with `outcomeResolved`/`outcomeCommitted` guards. `checkVictory.ts` no longer calls `grantXp(unit, 50)`. `GameContext.BattleResult` now carries `heroProgress` and `finalUnits`; `applyBattleResult` takes only the result.
- **Growth:** `heroGrowth.ts` centralizes provisional per-level deltas for all nine classes. `grantXp` now changes only XP, level, and skill points. `commitBattleProgress` applies class growth exactly once per gained level from the authoritative result.
- **HP bounds:** `models/hp.ts` provides `clampUnitHp`, `applyDamage`, `applyHealing`, and `setUnitHp`. Damage, healing, status ticks, synergy max-HP changes, battle initialization, and progression commits use bounded HP writes. Growth preserves current HP instead of restoring it.
- **Environmental exploration:** data-driven registry plus `cover`/`contain` region math, `EnvironmentalLayer`, and `EnvironmentalExaminationModal`. Integrated into the Twell hub, inn, and weapon shop. `GameContext` tracks `examinedObjects` and `examineObject`. Regions and descriptions are provisional and documented in `Design/environmental-exploration.md`.
- **Type/lint cleanup:** `ItemRegistry` now has explicit `ItemId` typing, `BattleView` item state is typed, the Twell state-order and hook issues are fixed, `GameContext`'s existing `useGame` export is explicitly allowed in the ESLint config, and the React refresh lint rule is clean.

### Verification performed

- `npm test` — 33 tests pass, 0 fail. The script now bundles and runs `encounters.test.ts`, `turnSystem.test.ts`, `economy.test.ts`, `progression.test.ts`, and `environment.test.ts`.
- `testProgressionIntegration.ts` bundled with Rolldown and run under Node — all 14 checks pass with the authoritative reward flow.
- `npx tsc -p tsconfig.app.json --noEmit --incremental false` — passed with no errors. The earlier 24 baseline errors are resolved.
- `npm run lint` — passed with no problems. The earlier 5 baseline errors are resolved.
- `npm run build` (`tsc -b && vite build`) — passed; 143 modules transformed.

### Known provisional decisions

- Class growth values are conservative tuning values, not final balance.
- Relic uniqueness is local to the current shop purchase call; no ownership/unlock rules registry exists yet.
- Environmental hotspot regions were inferred from CSS positions, dialogue references, and image aspect ratios. Future tuning should edit only the registry.
- No browser gameplay was exercised in this pass. Manual checks should include: King Goblin reward showing the same XP that is committed, defeated heroes receiving no XP, one level-up applying class growth once, buying a relic twice being blocked, and examining the windmill/fountain/stone/hearth opening the correct modal.

