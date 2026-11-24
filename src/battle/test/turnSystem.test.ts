import test from "node:test"
import assert from "node:assert/strict"

import type { Unit } from "../models/unit"
import { BasicAttack } from "../abilities/basicAttack"
import {
  createBattle,
  endTurn,
  tickBattle
} from "../engine/battleEngine"
import { performAction } from "../engine/performAction"
import { createKnight } from "../units/heroes/knight"

function createTestUnit(
  id: string,
  name: string,
  team: Unit["team"],
  speed: number
): Unit {
  return {
    id,
    name,
    heroClass: name,
    team,
    hp: 100000,
    maxHp: 100000,
    attack: 0,
    defense: 0,
    critChance: 0,
    critMultiplier: 1,
    damageVariance: 0,
    speed,
    timeline: 0,
    level: 1,
    xp: 0,
    skillPoints: 0,
    skillTree: [],
    abilities: [BasicAttack],
    statuses: [],
    passives: [],
    description: "",
    portrait: "",
    tags: []
  }
}

function countTurnStarts(
  events: { type: string; unitId?: string }[],
  unitId: string
) {
  return events.filter(
    event =>
      event.type === "turn-start" &&
      event.unitId === unitId
  ).length
}

test("Knight and all eligible heroes receive turns in a long battle", () => {
  const knight = createKnight()
  knight.id = "test-knight"
  knight.speed = 10
  knight.hp = 100000
  knight.maxHp = 100000

  const rogue = createTestUnit(
    "test-rogue",
    "Rogue",
    "player",
    30
  )

  const priest = createTestUnit(
    "test-priest",
    "Priest",
    "player",
    15
  )

  const enemy = createTestUnit(
    "test-enemy",
    "Training Dummy",
    "enemy",
    20
  )

  const battle = createBattle([
    knight,
    rogue,
    priest,
    enemy
  ])

  for (let tick = 0; tick < 120; tick++) {
    tickBattle(battle)

    if (
      battle.turnPhase === "player" &&
      battle.currentActorId
    ) {
      performAction(battle, { type: "wait" })
    }
  }

  assert.ok(
    countTurnStarts(
      battle.combatEvents,
      knight.id
    ) > 0
  )

  assert.ok(
    countTurnStarts(
      battle.combatEvents,
      rogue.id
    ) > 0
  )

  assert.ok(
    countTurnStarts(
      battle.combatEvents,
      priest.id
    ) > 0
  )

  assert.ok(
    countTurnStarts(
      battle.combatEvents,
      enemy.id
    ) > 0
  )
})

test("a very fast combatant cannot permanently starve a slow one", () => {
  const slow = createTestUnit(
    "slow-hero",
    "Slow Hero",
    "player",
    10
  )

  const fast = createTestUnit(
    "fast-enemy",
    "Fast Enemy",
    "enemy",
    100
  )

  const battle = createBattle([slow, fast])

  for (let tick = 0; tick < 20; tick++) {
    tickBattle(battle)

    if (
      battle.turnPhase === "player" &&
      battle.currentActorId
    ) {
      performAction(battle, { type: "wait" })
    }
  }

  assert.ok(
    countTurnStarts(
      battle.combatEvents,
      slow.id
    ) > 0
  )

  assert.ok(
    countTurnStarts(
      battle.combatEvents,
      fast.id
    ) > 0
  )
})

test("initiative ties resolve by stable unit order", () => {
  const first = createTestUnit(
    "first",
    "First",
    "player",
    10
  )

  const second = createTestUnit(
    "second",
    "Second",
    "player",
    10
  )

  const battle = createBattle([first, second])

  first.timeline = 100
  second.timeline = 100

  tickBattle(battle)

  assert.equal(battle.currentActorId, first.id)

  endTurn(battle)
  tickBattle(battle)

  assert.equal(battle.currentActorId, second.id)
})
