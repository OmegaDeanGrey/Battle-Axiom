import test from "node:test"
import assert from "node:assert/strict"

import type { Unit } from "../models/unit"

import { createBattle } from "../engine/battleEngine"
import { checkVictory } from "../engine/checkVictory"
import { commitBattleProgress } from "../progression/commitBattleProgress"
import {
  applyRewardProgressToUnits,
  resolveHeroRewardProgress
} from "../progression/resolveBattleOutcome"
import { createKnight } from "../units/heroes/knight"

import {
  ENCOUNTER_LOCATIONS
} from "../encounters/encounterRegistry"
import {
  advanceDialogue,
  canIssueCombatCommands,
  createDialogueGateState,
  currentDialogueLine,
  generateLocationEncounter,
  isDialogueActive,
  selectEnemyCount,
  selectExclusiveSoloEnemy,
  selectWeightedEnemy
} from "../encounters/encounterGenerator"
import {
  addCompletedScriptedEncounter,
  canResolveEncounterOutcome,
  hasCompletedScriptedEncounter,
  shouldCompleteScriptedEncounter,
  type CompletedScriptedEncounters
} from "../encounters/encounterProgress"
import {
  ENEMY_DEFINITIONS
} from "../enemies/enemyDefinitions"

const LOCATION = "twell-outskirts"
const SCRIPTED_ID = "king-goblin-ambush"

function createIdSource(): () => string {
  let next = 0

  return () => {
    next += 1
    return `test-enemy-${next}`
  }
}

function createSequenceRandom(
  values: number[]
): () => number {
  let index = 0

  return () => {
    const value = values[index]
    index += 1
    return value ?? 0
  }
}

function createLcg(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state =
      (1664525 * state + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function completedScriptedEncounter(): CompletedScriptedEncounters {
  return addCompletedScriptedEncounter(
    undefined,
    LOCATION,
    SCRIPTED_ID
  )
}

test("first Twell encounter has one King Goblin and three Goblin Henchmen", () => {
  const encounter = generateLocationEncounter(
    LOCATION,
    { createId: createIdSource() }
  )

  assert.equal(encounter.isScripted, true)
  assert.equal(encounter.encounterId, SCRIPTED_ID)
  assert.equal(encounter.enemies.length, 4)

  assert.equal(
    encounter.enemies.filter(
      enemy =>
        enemy.heroClass === "King Goblin"
    ).length,
    1
  )

  const henchmen = encounter.enemies.filter(
    enemy => enemy.name === "Goblin Henchman"
  )

  assert.equal(henchmen.length, 3)
  assert.ok(
    henchmen.every(
      enemy => enemy.heroClass === "Goblin"
    )
  )
  assert.ok(
    henchmen.every(enemy =>
      enemy.tags.includes("Goblin")
    )
  )
})

test("scripted encounter has the opening dialogue", () => {
  const encounter = generateLocationEncounter(
    LOCATION,
    { createId: createIdSource() }
  )

  assert.deepEqual(
    encounter.openingDialogue.map(
      line => line.speaker
    ),
    [
      "King Goblin",
      "Goblin Henchman",
      "King Goblin",
      "King Goblin",
      "King Goblin"
    ]
  )

  assert.deepEqual(
    encounter.openingDialogue.map(line => line.text),
    [
      "Look at them, lads. Soft little heroes, still pretending the world belongs to them.",
      "But, King... we were told not to come this close to their town!",
      "That was before the cracks. Before the old boundaries began to crumble.",
      "Something is breaking, you fools. The world itself! And when the walls between things fall, who's going to stop us?",
      "Now then... let's see what these little heroes are made of!"
    ]
  )
})

test("combat commands are locked until opening dialogue concludes", () => {
  const encounter = generateLocationEncounter(
    LOCATION,
    { createId: createIdSource() }
  )

  let gate = createDialogueGateState(
    encounter.openingDialogue
  )

  assert.equal(isDialogueActive(gate), true)
  assert.equal(canIssueCombatCommands(gate), false)

  while (isDialogueActive(gate)) {
    assert.ok(currentDialogueLine(gate))
    gate = advanceDialogue(gate)
  }

  assert.equal(isDialogueActive(gate), false)
  assert.equal(canIssueCombatCommands(gate), true)
  assert.equal(
    currentDialogueLine(gate),
    undefined
  )
  assert.equal(
    canIssueCombatCommands(
      createDialogueGateState([])
    ),
    true
  )
})

test("completed scripted encounter leads to random encounters", () => {
  const encounter = generateLocationEncounter(
    LOCATION,
    {
      encounterContext: {
        completedScriptedEncounters:
          completedScriptedEncounter()
      },
      random: () => 0,
      createId: createIdSource()
    }
  )

  assert.equal(encounter.isScripted, false)
  assert.equal(
    encounter.openingDialogue.length,
    0
  )
  assert.ok(
    encounter.enemies.every(
      enemy => enemy.heroClass !== "King Goblin"
    )
  )
})

test("losing the first encounter does not complete it", () => {
  const encounter = generateLocationEncounter(
    LOCATION,
    { createId: createIdSource() }
  )

  let completed: CompletedScriptedEncounters = {}

  assert.equal(
    shouldCompleteScriptedEncounter(
      "enemy",
      encounter
    ),
    false
  )
  assert.equal(
    shouldCompleteScriptedEncounter(
      undefined,
      encounter
    ),
    false
  )

  if (
    shouldCompleteScriptedEncounter(
      "enemy",
      encounter
    )
  ) {
    completed = addCompletedScriptedEncounter(
      completed,
      LOCATION,
      encounter.encounterId
    )
  }

  assert.equal(
    hasCompletedScriptedEncounter(
      completed,
      LOCATION,
      SCRIPTED_ID
    ),
    false
  )

  assert.equal(
    shouldCompleteScriptedEncounter(
      "player",
      encounter
    ),
    true
  )
})

test("random encounters contain one through four enemies", () => {
  const rolls = [0, 0.25, 0.5, 0.75, 0.999]

  assert.deepEqual(
    rolls.map(roll =>
      selectEnemyCount(1, 4, () => roll)
    ),
    [1, 2, 3, 4, 4]
  )

  const random = createSequenceRandom([
    0.5, ...rolls
  ])

  assert.equal(
    generateLocationEncounter(LOCATION, {
      encounterContext: {
        completedScriptedEncounters:
          completedScriptedEncounter()
      },
      random,
      createId: createIdSource()
    }).enemies.length,
    1
  )
})

test("random encounters only use configured Twell enemies", () => {
  const config = ENCOUNTER_LOCATIONS[LOCATION]

  const allowedEnemyIds = new Set([
    ...config.randomEncounters.enemyWeights.map(
      weight => weight.enemyId
    ),
    ...(config.randomEncounters.soloEncounters ?? []).map(
      encounter => encounter.enemyId
    )
  ])

  const allowedClasses = new Set(
    [...allowedEnemyIds].map(
      enemyId =>
        ENEMY_DEFINITIONS[enemyId].heroClass
    )
  )

  const random = createLcg(9137)

  for (let attempt = 0; attempt < 250; attempt += 1) {
    const encounter = generateLocationEncounter(
      LOCATION,
      {
        encounterContext: {
          completedScriptedEncounters:
            completedScriptedEncounter()
        },
        random,
        createId: createIdSource()
      }
    )

    assert.ok(encounter.enemies.length >= 1)
    assert.ok(encounter.enemies.length <= 4)

    for (const enemy of encounter.enemies) {
      assert.ok(allowedClasses.has(enemy.heroClass))
    }
  }
})

test("weighted selection respects deterministic roll boundaries", () => {
  const weights =
    ENCOUNTER_LOCATIONS[LOCATION].randomEncounters
      .enemyWeights

  assert.equal(
    selectWeightedEnemy(weights, () => 0),
    "goblin"
  )
  assert.equal(
    selectWeightedEnemy(weights, () => 0.699),
    "goblin"
  )
  assert.equal(
    selectWeightedEnemy(weights, () => 0.7),
    "goblin"
  )
  assert.equal(
    selectWeightedEnemy(weights, () => 0.737),
    "hobgoblin"
  )
  assert.equal(
    selectWeightedEnemy(weights, () => 0.895),
    "orc"
  )
  assert.equal(
    selectWeightedEnemy(weights, () => 0.999),
    "orc"
  )
})

test("exclusive solo encounters roll against their configured chance", () => {
  const soloEncounters =
    ENCOUNTER_LOCATIONS[LOCATION].randomEncounters
      .soloEncounters

  assert.deepEqual(soloEncounters, [
    { enemyId: "nightmare", chance: 0.05 }
  ])

  assert.equal(
    selectExclusiveSoloEnemy(soloEncounters, () => 0.049),
    "nightmare"
  )
  assert.equal(
    selectExclusiveSoloEnemy(soloEncounters, () => 0.05),
    undefined
  )
  assert.equal(
    selectExclusiveSoloEnemy(soloEncounters, () => 0.99),
    undefined
  )
})

test("a scheduled solo enemy appears alone and never alongside a pack", () => {
  const encounter = generateLocationEncounter(
    LOCATION,
    {
      encounterContext: {
        completedScriptedEncounters:
          completedScriptedEncounter()
      },
      random: createSequenceRandom([0.01, 0.99]),
      createId: createIdSource()
    }
  )

  assert.equal(encounter.enemies.length, 1)
  assert.equal(
    encounter.enemies[0].heroClass,
    "Nightmare"
  )
  assert.equal(
    encounter.enemies[0].definitionId,
    "nightmare"
  )
})

test("non-solo rolls always produce standard enemies only", () => {
  const random = createLcg(0x5eed)

  for (let sample = 0; sample < 5000; sample += 1) {
    let soloRoll: number | undefined

    const trackedRandom = () => {
      const value = random()
      if (soloRoll === undefined) {
        soloRoll = value
      }
      return value
    }

    const encounter = generateLocationEncounter(
      LOCATION,
      {
        encounterContext: {
          completedScriptedEncounters:
            completedScriptedEncounter()
        },
        random: trackedRandom,
        createId: createIdSource()
      }
    )

    const isSoloEncounter =
      (soloRoll ?? 1) < 0.05

    if (isSoloEncounter) {
      assert.equal(encounter.enemies.length, 1)
      assert.equal(
        encounter.enemies[0].definitionId,
        "nightmare"
      )
    } else {
      assert.ok(
        encounter.enemies.every(
          enemy =>
            enemy.definitionId !== "nightmare"
        ),
        "a pack contained a solo-only enemy"
      )
      assert.ok(
        encounter.enemies.length >= 1 &&
          encounter.enemies.length <= 4
      )
    }
  }
})

test("repeated enemy types have unique battle-instance ids", () => {
  const createId = createIdSource()

  const scripted = generateLocationEncounter(
    LOCATION,
    { createId }
  )
  const scriptedIds = scripted.enemies.map(
    enemy => enemy.id
  )

  assert.equal(
    new Set(scriptedIds).size,
    scriptedIds.length
  )

  const random = generateLocationEncounter(
    LOCATION,
    {
      encounterContext: {
        completedScriptedEncounters:
          completedScriptedEncounter()
      },
      random: createSequenceRandom([
        0.99, 0.75, 0, 0, 0
      ]),
      createId
    }
  )

  assert.equal(random.enemies.length, 4)
  assert.ok(
    random.enemies.every(
      enemy => enemy.heroClass === "Goblin"
    )
  )
  assert.equal(
    new Set(random.enemies.map(e => e.id)).size,
    4
  )
})

test("generated enemies are compatible with the battle engine", () => {
  const encounter = generateLocationEncounter(
    LOCATION,
    { createId: createIdSource() }
  )

  const battle = createBattle(
    [
      structuredClone(createKnight()),
      ...encounter.enemies
    ],
    []
  )

  assert.equal(battle.units.length, 5)
  assert.equal(battle.winner, undefined)
  assert.equal(battle.combatEvents.length, 0)

  for (const enemy of battle.units.filter(
    unit => unit.team === "enemy"
  )) {
    assert.ok(enemy.id)
    assert.ok(enemy.name)
    assert.ok(enemy.heroClass)
    assert.ok(enemy.maxHp > 0)
    assert.ok(enemy.hp > 0)
    assert.ok(enemy.attack >= 0)
    assert.ok(enemy.defense >= 0)
    assert.ok(enemy.speed >= 0)
    assert.ok(enemy.abilities.length > 0)
    assert.equal(enemy.timeline, 0)
    assert.deepEqual(enemy.statuses, [])
    assert.equal(enemy.team, "enemy")
  }
})

function winBattle(
  hero: Unit,
  enemies: Unit[],
  damageToHero: number,
  rewardXp = 50
): Unit {
  const units = [
    structuredClone(hero),
    ...enemies.map(enemy =>
      structuredClone(enemy)
    )
  ]

  const battle = createBattle(units, [])
  const battleHero = battle.units[0]

  battleHero.hp = Math.max(
    1,
    battleHero.hp - damageToHero
  )

  for (const enemy of battle.units.filter(
    unit => unit.team === "enemy"
  )) {
    enemy.hp = 0
  }

  checkVictory(battle)

  const progress =
    resolveHeroRewardProgress(
      [hero],
      battle.units,
      rewardXp
    )

  const finalUnits =
    applyRewardProgressToUnits(
      battle.units,
      progress
    )

  return commitBattleProgress(
    [hero],
    finalUnits
  )[0]
}

test("multiple encounters preserve hero HP and progression", () => {
  const startingHero = createKnight()
  startingHero.level = 2

  const firstEncounter = generateLocationEncounter(
    LOCATION,
    {
      encounterContext: {
        completedScriptedEncounters:
          completedScriptedEncounter()
      },
      random: () => 0,
      createId: createIdSource()
    }
  )

  const afterFirst = winBattle(
    startingHero,
    firstEncounter.enemies,
    30
  )

  assert.equal(afterFirst.hp, 90)
  assert.equal(afterFirst.xp, 50)

  const secondEncounter = generateLocationEncounter(
    LOCATION,
    {
      encounterContext: {
        completedScriptedEncounters:
          completedScriptedEncounter()
      },
      random: () => 0,
      createId: createIdSource()
    }
  )

  const afterSecond = winBattle(
    afterFirst,
    secondEncounter.enemies,
    20
  )

  assert.equal(afterSecond.hp, 70)
  assert.equal(afterSecond.xp, 100)
  assert.equal(afterSecond.level, 2)
})

test("victory rewards and encounter completion cannot be processed twice", () => {
  const encounter = generateLocationEncounter(
    LOCATION,
    { createId: createIdSource() }
  )

  const units = [
    structuredClone(createKnight()),
    ...encounter.enemies
  ]

  const battle = createBattle(units, [])

  for (const enemy of battle.units.filter(
    unit => unit.team === "enemy"
  )) {
    enemy.hp = 0
  }

  checkVictory(battle)

  const xpAfterFirstAward = battle.units[0].xp
  checkVictory(battle)

  assert.equal(battle.units[0].xp, xpAfterFirstAward)

  let resolved = false
  let completed: CompletedScriptedEncounters = {}

  function resolveOutcome(
    winner: "player" | "enemy" | undefined
  ) {
    if (
      !canResolveEncounterOutcome(
        winner,
        resolved
      )
    ) {
      return
    }

    resolved = true

    if (
      shouldCompleteScriptedEncounter(
        winner,
        encounter
      )
    ) {
      completed = addCompletedScriptedEncounter(
        completed,
        LOCATION,
        encounter.encounterId
      )
    }
  }

  resolveOutcome("player")
  resolveOutcome("player")

  assert.equal(resolved, true)
  assert.equal(
    hasCompletedScriptedEncounter(
      completed,
      LOCATION,
      SCRIPTED_ID
    ),
    true
  )
  assert.deepEqual(
    completed[LOCATION],
    [SCRIPTED_ID]
  )
})

test("large deterministic simulation approaches configured encounter probabilities", () => {
  const weights =
    ENCOUNTER_LOCATIONS[LOCATION].randomEncounters
      .enemyWeights
  const random = createLcg(0xc0ffee)
  const createId = createIdSource()

  const counts = new Map<string, number>(
    weights.map(weight => [weight.enemyId, 0])
  )
  counts.set("nightmare", 0)

  const enemyIdByClass = new Map(
    Object.values(ENEMY_DEFINITIONS).map(
      definition => [
        definition.heroClass,
        definition.id
      ]
    )
  )

  let totalEnemies = 0
  let soloEncounters = 0
  let standardEnemies = 0
  const samples = 20000

  for (let sample = 0; sample < samples; sample += 1) {
    let soloRoll: number | undefined

    const trackedRandom = () => {
      const value = random()
      if (soloRoll === undefined) {
        soloRoll = value
      }
      return value
    }

    const encounter = generateLocationEncounter(
      LOCATION,
      {
        encounterContext: {
          completedScriptedEncounters:
            completedScriptedEncounter()
        },
        random: trackedRandom,
        createId
      }
    )

    if ((soloRoll ?? 1) < 0.05) {
      soloEncounters += 1
      assert.equal(encounter.enemies.length, 1)
    }

    for (const enemy of encounter.enemies) {
      const enemyId =
        enemyIdByClass.get(enemy.heroClass)

      if (!enemyId) {
        assert.fail(
          `Unexpected enemy class: ${enemy.heroClass}`
        )
      }

      counts.set(
        enemyId,
        (counts.get(enemyId) ?? 0) + 1
      )
      totalEnemies += 1

      if (enemyId !== "nightmare") {
        standardEnemies += 1
      }
    }
  }

  const soloRate = soloEncounters / samples
  assert.ok(
    Math.abs(soloRate - 0.05) < 0.01,
    `nightmare encounter rate: expected 0.05, observed ${soloRate}`
  )
  assert.equal(counts.get("nightmare"), soloEncounters)

  const totalWeight = weights.reduce(
    (sum, weight) => sum + weight.weight,
    0
  )

  for (const weight of weights) {
    const observed =
      (counts.get(weight.enemyId) ?? 0) /
      standardEnemies
    const expected = weight.weight / totalWeight

    assert.ok(
      Math.abs(observed - expected) < 0.02,
      `${weight.enemyId}: expected ${expected}, observed ${observed}`
    )
  }

  assert.ok(totalEnemies > standardEnemies)
})
