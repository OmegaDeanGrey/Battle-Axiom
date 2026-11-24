import type { Unit } from "../models/unit"

import { createEnemyInstance } from "../enemies/enemyDefinitions"
import {
  getEncounterLocation
} from "./encounterRegistry"
import {
  getScriptedEncounter
} from "./scriptedEncounters"
import {
  hasCompletedScriptedEncounter
} from "./encounterProgress"

import type {
  DialogueGateState,
  DialogueLine,
  EncounterCondition,
  EncounterContext,
  ExclusiveSoloEncounterConfig,
  EnemyId,
  EnemyWeight,
  GeneratedEncounter,
  IdSource,
  LocationDifficulty,
  LocationId,
  RandomSource
} from "./encounterTypes"

export type GenerateEncounterOptions = {
  encounterContext?: EncounterContext
  random?: RandomSource
  createId?: IdSource
}

export function createDialogueGateState(
  lines: readonly DialogueLine[] = []
): DialogueGateState {
  return { lines, index: 0 }
}

export function isDialogueActive(
  gate: DialogueGateState
): boolean {
  return gate.index < gate.lines.length
}

export function canIssueCombatCommands(
  gate: DialogueGateState
): boolean {
  return !isDialogueActive(gate)
}

export function currentDialogueLine(
  gate: DialogueGateState
): DialogueLine | undefined {
  return isDialogueActive(gate)
    ? gate.lines[gate.index]
    : undefined
}

export function advanceDialogue(
  gate: DialogueGateState
): DialogueGateState {
  if (!isDialogueActive(gate)) return gate

  return {
    lines: gate.lines,
    index: gate.index + 1
  }
}

export function conditionsMet(
  conditions:
    | readonly EncounterCondition[]
    | undefined,
  context: EncounterContext = {}
): boolean {
  if (!conditions) return true

  return conditions.every(condition => {
    switch (condition.type) {
      case "questComplete":
        return (
          context.completedQuestIds?.includes(
            condition.questId
          ) ?? false
        )
      case "storyFlag":
        return (
          context.storyFlags?.includes(
            condition.flag
          ) ?? false
        )
      case "bossDefeated":
        return (
          context.defeatedBossIds?.includes(
            condition.bossId
          ) ?? false
        )
      case "minPartyLevel":
        return (
          context.partyLevel ?? 1
        ) >= condition.level
    }
  })
}

export function selectEnemyCount(
  min: number,
  max: number,
  random: RandomSource
): number {
  if (
    !Number.isInteger(min) ||
    !Number.isInteger(max) ||
    min < 1 ||
    max < min
  ) {
    throw new Error(
      `Invalid enemy count range: ${min}-${max}`
    )
  }

  const roll = Math.min(
    Math.max(random(), 0),
    0.999999999999
  )

  return min + Math.floor(roll * (max - min + 1))
}

export function selectWeightedEnemy(
  weights: readonly EnemyWeight[],
  random: RandomSource
): EnemyId {
  const validWeights =
    weights.filter(weight => weight.weight > 0)

  const total = validWeights.reduce(
    (sum, weight) => sum + weight.weight,
    0
  )

  if (total <= 0) {
    throw new Error(
      "Encounter has no positive enemy weights"
    )
  }

  let roll = random() * total

  for (const weight of validWeights) {
    roll -= weight.weight

    if (roll < 0) {
      return weight.enemyId
    }
  }

  return validWeights[validWeights.length - 1].enemyId
}

export function selectExclusiveSoloEnemy(
  encounters: readonly ExclusiveSoloEncounterConfig[] | undefined,
  random: RandomSource
): EnemyId | undefined {
  if (!encounters || encounters.length === 0) {
    return undefined
  }

  for (const encounter of encounters) {
    if (
      !Number.isFinite(encounter.chance) ||
      encounter.chance < 0 ||
      encounter.chance > 1
    ) {
      throw new Error(
        `Invalid solo encounter chance: ${encounter.chance}`
      )
    }
  }

  let roll = random()

  for (const encounter of encounters) {
    if (roll < encounter.chance) {
      return encounter.enemyId
    }

    roll -= encounter.chance
  }

  return undefined
}

function enemyWeightsForPack(
  weights: readonly EnemyWeight[],
  soloEncounters: readonly ExclusiveSoloEncounterConfig[] | undefined
): readonly EnemyWeight[] {
  if (!soloEncounters || soloEncounters.length === 0) {
    return weights
  }

  const soloIds = new Set(
    soloEncounters.map(encounter => encounter.enemyId)
  )

  return weights.filter(
    weight => !soloIds.has(weight.enemyId)
  )
}

function applyDifficulty(
  enemy: Unit,
  difficulty: LocationDifficulty | undefined
): Unit {
  const scale = difficulty?.statScale ?? 1
  const levelOffset =
    difficulty?.levelOffset ?? 0

  if (scale === 1 && levelOffset === 0) {
    return enemy
  }

  return {
    ...enemy,
    level: enemy.level + levelOffset,
    hp: Math.round(enemy.hp * scale),
    maxHp: Math.round(enemy.maxHp * scale),
    attack: Math.round(enemy.attack * scale),
    defense: Math.round(enemy.defense * scale),
    speed: Math.round(enemy.speed * scale)
  }
}

export function generateLocationEncounter(
  locationId: LocationId,
  options: GenerateEncounterOptions = {}
): GeneratedEncounter {
  const config = getEncounterLocation(locationId)

  if (!config) {
    throw new Error(
      `Unknown encounter location: ${locationId}`
    )
  }

  const random = options.random ?? Math.random
  const createId =
    options.createId ??
    (() => crypto.randomUUID())
  const context = options.encounterContext ?? {}

  if (config.firstEncounterId) {
    const scripted = getScriptedEncounter(
      config.firstEncounterId
    )

    if (!scripted) {
      throw new Error(
        `Unknown scripted encounter: ${config.firstEncounterId}`
      )
    }

    const completed =
      hasCompletedScriptedEncounter(
        context.completedScriptedEncounters,
        locationId,
        scripted.id
      )

    if (
      !completed &&
      conditionsMet(scripted.conditions, context)
    ) {
      return {
        locationId,
        encounterId: scripted.id,
        name: scripted.name,
        isScripted: true,
        openingDialogue:
          scripted.openingDialogue ?? [],
        conclusion: scripted.conclusion,
        enemies: scripted.enemies.map(enemy =>
          applyDifficulty(
            createEnemyInstance(enemy.enemyId, {
              displayName: enemy.displayName,
              createId
            }),
            config.difficulty
          )
        )
      }
    }
  }

  const soloEnemyId = selectExclusiveSoloEnemy(
    config.randomEncounters.soloEncounters,
    random
  )

  if (soloEnemyId) {
    return {
      locationId,
      encounterId: `random-${createId()}`,
      name: "Random Encounter",
      isScripted: false,
      openingDialogue: [],
      enemies: [
        applyDifficulty(
          createEnemyInstance(soloEnemyId, { createId }),
          config.difficulty
        )
      ]
    }
  }

  const count = selectEnemyCount(
    config.randomEncounters.minEnemies,
    config.randomEncounters.maxEnemies,
    random
  )

  const packWeights = enemyWeightsForPack(
    config.randomEncounters.enemyWeights,
    config.randomEncounters.soloEncounters
  )

  const enemies = Array.from(
    { length: count },
    () => {
      const enemyId = selectWeightedEnemy(
        packWeights,
        random
      )

      return applyDifficulty(
        createEnemyInstance(enemyId, { createId }),
        config.difficulty
      )
    }
  )

  return {
    locationId,
    encounterId: `random-${createId()}`,
    name: "Random Encounter",
    isScripted: false,
    openingDialogue: [],
    enemies
  }
}
