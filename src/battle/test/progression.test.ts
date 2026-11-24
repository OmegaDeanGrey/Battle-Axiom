import test from "node:test"
import assert from "node:assert/strict"

import { createBattle } from "../engine/battleEngine"
import { checkVictory } from "../engine/checkVictory"
import {
  getXpToNextLevel,
  grantXp
} from "../progression/grantXp"
import {
  applyHeroLevelGrowth
} from "../progression/heroGrowth"
import {
  applyRewardProgressToUnits,
  resolveHeroRewardProgress
} from "../progression/resolveBattleOutcome"
import {
  commitBattleProgress
} from "../progression/commitBattleProgress"
import {
  applyDamage,
  applyHealing,
  clampUnitHp,
  setUnitHp
} from "../models/hp"
import { createKnight } from "../units/heroes/knight"
import { createPriest } from "../units/heroes/priest"
import { createGoblin } from "../units/enemies/goblin"

test("grantXp handles multiple levels without changing combat stats", () => {
  const hero = createKnight()

  const before = {
    maxHp: hero.maxHp,
    attack: hero.attack,
    defense: hero.defense,
    speed: hero.speed
  }

  const levelsGained = grantXp(hero, 350)

  assert.equal(levelsGained, 2)
  assert.equal(hero.level, 3)
  assert.equal(hero.xp, 50)
  assert.equal(
    getXpToNextLevel(hero.level),
    300
  )
  assert.equal(hero.skillPoints, 2)
  assert.equal(hero.maxHp, before.maxHp)
  assert.equal(hero.attack, before.attack)
  assert.equal(hero.defense, before.defense)
  assert.equal(hero.speed, before.speed)
})

test("level growth is class specific and applied once per gained level", () => {
  const knight = createKnight()
  const grown =
    applyHeroLevelGrowth(knight, 2)

  assert.equal(
    grown.maxHp,
    knight.maxHp + 28
  )
  assert.equal(
    grown.attack,
    knight.attack + 6
  )
  assert.equal(
    grown.defense,
    knight.defense + 6
  )
  assert.equal(
    grown.speed,
    knight.speed + 2
  )
  assert.equal(grown.hp, knight.hp)
  assert.equal(knight.maxHp, 120)
})

test("authoritative reward data matches committed party progression", () => {
  const knight = createKnight()
  const priest = createPriest()
  const party = [knight, priest]

  const battle = createBattle([
    ...party.map(hero =>
      structuredClone(hero)
    ),
    createGoblin()
  ])

  const battleKnight =
    battle.units.find(
      unit => unit.id === knight.id
    )!

  const battlePriest =
    battle.units.find(
      unit => unit.id === priest.id
    )!

  battlePriest.hp = 0

  for (const unit of battle.units) {
    if (unit.team === "enemy") {
      unit.hp = 0
    }
  }

  checkVictory(battle)

  const progress =
    resolveHeroRewardProgress(
      party,
      battle.units,
      220
    )

  const knightProgress =
    progress.find(
      row => row.id === knight.id
    )!

  const priestProgress =
    progress.find(
      row => row.id === priest.id
    )!

  assert.equal(
    knightProgress.xpGained,
    220
  )
  assert.equal(
    knightProgress.level,
    2
  )
  assert.equal(
    knightProgress.xp,
    120
  )
  assert.equal(
    knightProgress.levelsGained,
    1
  )
  assert.equal(
    knightProgress.skillPointsGained,
    1
  )
  assert.equal(
    priestProgress.xpGained,
    0
  )
  assert.equal(
    priestProgress.level,
    1
  )

  const finalUnits =
    applyRewardProgressToUnits(
      battle.units,
      progress
    )

  const committed =
    commitBattleProgress(
      party,
      finalUnits
    )

  const committedKnight =
    committed.find(
      hero => hero.id === knight.id
    )!

  const committedPriest =
    committed.find(
      hero => hero.id === priest.id
    )!

  assert.equal(
    committedKnight.level,
    knightProgress.level
  )
  assert.equal(
    committedKnight.xp,
    knightProgress.xp
  )
  assert.equal(
    committedKnight.maxHp,
    knightProgress.maxHp
  )
  assert.equal(
    committedKnight.hp,
    knightProgress.hp
  )
  assert.equal(
    committedPriest.xp,
    0
  )
  assert.equal(
    committedPriest.level,
    1
  )
  assert.equal(
    battleKnight.xp,
    0
  )
})

test("HP helpers keep unit HP between zero and max HP", () => {
  const hero = createKnight()

  hero.hp = 999
  clampUnitHp(hero)
  assert.equal(hero.hp, hero.maxHp)

  setUnitHp(hero, -20)
  assert.equal(hero.hp, 0)

  setUnitHp(hero, 50)
  applyDamage(hero, 80)
  assert.equal(hero.hp, 0)

  applyHealing(hero, 9999)
  assert.equal(hero.hp, hero.maxHp)
})
