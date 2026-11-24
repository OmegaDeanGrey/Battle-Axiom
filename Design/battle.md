# Battle Axiom — Hero Skill Trees and Evolution System

## Overview

Battle Axiom will use a **permanent, branching hero evolution system** with persistent skill trees, progressive skill prerequisites, class combination moves, and a separate relationship system.

The goal is to give players meaningful choices about how their heroes develop without unnecessarily restricting which abilities they can learn.

## 1. Base Skill Trees

- Each of the nine starting hero classes has its own foundational skill tree.
- Skills become available through level requirements and prerequisite abilities.
- Advanced skills require earlier skills in the same progression.
- Heroes do not need to select a particular specialization to learn abilities available in their base class tree.
- There will be **no skill-slot restrictions**. Heroes retain access to all abilities they have learned.

**Example — Mage Ice Skills**

- Ice I — Basic ice spell.
- Ice II — Requires Ice I and a minimum level.
- Ice III — Requires Ice II and a higher minimum level.
- Advanced ice abilities continue this progression.

A Mage can develop ice, fire, lightning, and other foundational magical abilities regardless of their eventual evolution.

## 2. Permanent Branching Evolution

At designated progression milestones, heroes become eligible to evolve into one of two specialized classes.

Evolution is **permanent and mutually exclusive**. Choosing one evolutionary branch prevents access to the alternative branch's exclusive skills.

Evolution does not replace the original skill tree. Instead, it unlocks an additional tree.

A hero retains access to:

1. Their original class skill tree.
2. The skill tree unlocked by their first evolution.
3. The skill tree unlocked by their subsequent evolution.

### Example — Mage Evolution

```text
                    MAGE
                      |
             +--------+--------+
             |                 |
            LICH            SORCERER
             |                 |
        +----+----+       +----+----+
        |         |       |         |
  NECROMANCER  GHOST    SPELL-   ARCHMAGE
                MAGE    WEAVER
```

These evolution names are illustrative and subject to further design.

A Necromancer retains access to Mage, Lich, and Necromancer skills, but cannot learn skills exclusive to the Sorcerer or Ghost Mage branches.

Players wishing to explore alternative evolutions must develop another hero of the same starting class or replay the game.

## 3. Evolution Requirements

Evolution eligibility may depend on:

- Reaching a minimum character level.
- Completing a class-specific quest or challenge.
- Meeting foundational skill requirements.

Evolution should not require players to have anticipated a specific specialization many levels earlier.

For example, a Mage should not be prevented from becoming a Lich simply because they initially focused on ice magic.

**Still to determine:** Exact evolution levels, required skills, and whether every evolution requires a dedicated quest.

Tentative milestones discussed were levels 10 and 25–30.

## 4. Evolution and Hero Tags

Evolving can add, remove, or modify a hero's classification tags.

For example:

| Evolution | Possible Tags |
|---|---|
| Mage | Arcane, Ranged |
| Lich | Arcane, Ranged, Undead |
| Necromancer | Arcane, Ranged, Undead, Summoning |
| Ghost Mage | Arcane, Ranged, Undead, Ethereal |

These tags are illustrative.

Tags may affect:

- Combat strengths

## 5. Level Growth and Reward Resolution

Leveling uses `src/battle/progression/grantXp.ts` and `getXpToNextLevel(level) = level * 100`. XP and one skill point per gained level are resolved once after victory. `checkVictory` only sets the winner and records the combat event; it no longer grants XP directly.

`src/battle/progression/heroGrowth.ts` is the central class-specific growth config. Each gained level applies the hero class's deltas once:

| Class | Max HP | Attack | Defense | Speed |
|---|---:|---:|---:|---:|
| Knight | 14 | 3 | 3 | 1 |
| Priest | 10 | 1 | 2 | 2 |
| Rogue | 9 | 4 | 1 | 4 |
| Baby Dragon | 16 | 4 | 2 | 1 |
| Fairy | 8 | 2 | 1 | 3 |
| Elven Ranger | 10 | 3 | 1 | 3 |
| Mage | 7 | 5 | 1 | 2 |
| Witch | 9 | 3 | 2 | 2 |
| Summoner | 11 | 3 | 2 | 2 |

These values are provisional tuning values and are intentionally centralized so they can be changed without touching the engine or UI.

`resolveHeroRewardProgress` produces the per-hero rows shown in `BattleResolutionModal`: XP gained, resulting level/XP, levels gained, skill points gained, and final HP. Defeated heroes receive no XP, but their HP remains 0. `commitBattleProgress` applies growth to the permanent party from the authoritative result, so growth cannot be applied twice by previewing and reopening the modal.

HP writes are clamped through `src/battle/models/hp.ts`. Damage, healing, synergy max-HP changes, battle initialization, and progression commits keep `0 <= hp <= maxHp`. When max HP grows, current HP is preserved rather than fully restored; only explicit healing or sleeping at the inn restores HP.
