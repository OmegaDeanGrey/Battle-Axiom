import type { Unit } from "../models/unit"
import type { Ability } from "../models/ability"
import type { HeroTag } from "../data/TagRegistry"

import { BasicAttack } from "../abilities/basicAttack"
import { Claw } from "../abilities/claw"
import { ClassAbilities } from "../abilities/classAbilities"
import { createGoblin } from "../units/enemies/goblin"

import type {
  EnemyId,
  EnemyReward,
  IdSource
} from "../encounters/encounterTypes"

export type EnemyInstanceOptions = {
  displayName?: string
  createId?: IdSource
}

export type EnemyDefinition = {
  id: EnemyId
  name: string
  heroClass: string
  reward: EnemyReward
  create: (
    options?: EnemyInstanceOptions
  ) => Unit
}

type EnemyUnitConfig = {
  definitionId: EnemyId
  name: string
  heroClass: string
  maxHp: number
  attack: number
  defense: number
  critChance: number
  critMultiplier: number
  damageVariance: number
  speed: number
  abilities: Ability[]
  description: string
  portrait: string
  tags: HeroTag[]
}

function createEnemyUnit(
  config: EnemyUnitConfig,
  options: EnemyInstanceOptions = {}
): Unit {
  const createId =
    options.createId ??
    (() => crypto.randomUUID())

  return {
    id: createId(),
    name: options.displayName ?? config.name,
    heroClass: config.heroClass,
    hp: config.maxHp,
    maxHp: config.maxHp,
    attack: config.attack,
    defense: config.defense,
    critChance: config.critChance,
    critMultiplier: config.critMultiplier,
    damageVariance: config.damageVariance,
    speed: config.speed,
    timeline: 0,
    level: 1,
    xp: 0,
    skillPoints: 0,
    skillTree: [],
    abilities: config.abilities.map(
      ability => ({ ...ability })
    ),
    definitionId: config.definitionId,
    statuses: [],
    passives: [],
    team: "enemy",
    description: config.description,
    portrait: config.portrait,
    tags: [...config.tags]
  }
}

export const ENEMY_DEFINITIONS: Record<
  EnemyId,
  EnemyDefinition
> = {
  goblin: {
    id: "goblin",
    name: "Goblin",
    heroClass: "Goblin",
    reward: {
      xp: 20,
      gold: 8,
      loot: [
        {
          itemId: "potion",
          chance: 0.15,
          minQuantity: 1,
          maxQuantity: 1
        }
      ]
    },
    create: (options = {}) => {
      const enemy = createGoblin()

      enemy.definitionId = "goblin"

      if (options.createId) {
        enemy.id = options.createId()
      }

      if (options.displayName) {
        enemy.name = options.displayName
      }

      return enemy
    }
  },
  hobgoblin: {
    id: "hobgoblin",
    name: "Hobgoblin",
    heroClass: "Hobgoblin",
    reward: {
      xp: 35,
      gold: 15,
      loot: [
        {
          itemId: "potion",
          chance: 0.25,
          minQuantity: 1,
          maxQuantity: 1
        },
        {
          itemId: "hiPotion",
          chance: 0.08,
          minQuantity: 1,
          maxQuantity: 1
        }
      ]
    },
    create: options =>
      createEnemyUnit(
        {
          definitionId: "hobgoblin",
          name: "Hobgoblin",
          heroClass: "Hobgoblin",
          maxHp: 70,
          attack: 12,
          defense: 12,
          critChance: 0.12,
          critMultiplier: 2,
          damageVariance: 0.12,
          speed: 12,
          abilities: [Claw, BasicAttack],
          description:
            "A hardened goblin veteran with heavier gear and a meaner temper.",
          portrait:
            "/battle/characters/Hobgoblin.png",
          tags: ["Goblin", "Elite", "Melee"]
        },
        options
      )
  },
  orc: {
    id: "orc",
    name: "Orc",
    heroClass: "Orc",
    reward: {
      xp: 60,
      gold: 30,
      loot: [
        {
          itemId: "potion",
          chance: 0.3,
          minQuantity: 1,
          maxQuantity: 2
        },
        {
          itemId: "hiPotion",
          chance: 0.2,
          minQuantity: 1,
          maxQuantity: 1
        }
      ]
    },
    create: options =>
      createEnemyUnit(
        {
          definitionId: "orc",
          name: "Orc",
          heroClass: "Orc",
          maxHp: 260,
          attack: 30,
          defense: 30,
          critChance: 0.1,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 16,
          abilities: [
            ClassAbilities.sword_strike_ii,
            BasicAttack
          ],
          description:
            "A heavily built raider who trades speed for crushing strength.",
          portrait:
            "/battle/characters/Orc.png",
          tags: ["Orc", "Melee", "Large"]
        },
        options
      )
  },
  nightmare: {
    id: "nightmare",
    name: "Nightmare",
    heroClass: "Nightmare",
    reward: {
      xp: 85,
      gold: 45,
      loot: [
        {
          itemId: "antidote",
          chance: 0.25,
          minQuantity: 1,
          maxQuantity: 2
        },
        {
          itemId: "hiPotion",
          chance: 0.35,
          minQuantity: 1,
          maxQuantity: 1
        }
      ]
    },
    create: options =>
      createEnemyUnit(
        {
          definitionId: "nightmare",
          name: "Nightmare",
          heroClass: "Nightmare",
          maxHp: 340,
          attack: 36,
          defense: 26,
          critChance: 0.18,
          critMultiplier: 2,
          damageVariance: 0.2,
          speed: 30,
          abilities: [
            ClassAbilities.hex_ii,
            ClassAbilities.frost_bolt
          ],
          description:
            "A restless apparition whose presence curdles courage and warps the air.",
          portrait:
            "/battle/characters/Nightmare.png",
          tags: [
            "Arcane",
            "Spirit",
            "Dark",
            "Spellcaster"
          ]
        },
        options
      )
  },
  "king-goblin": {
    id: "king-goblin",
    name: "King Goblin",
    heroClass: "King Goblin",
    reward: {
      xp: 120,
      gold: 75,
      loot: [
        {
          itemId: "potion",
          chance: 0.5,
          minQuantity: 1,
          maxQuantity: 2
        },
        {
          itemId: "hiPotion",
          chance: 0.5,
          minQuantity: 1,
          maxQuantity: 2
        }
      ]
    },
    create: options =>
      createEnemyUnit(
        {
          definitionId: "king-goblin",
          name: "King Goblin",
          heroClass: "King Goblin",
          maxHp: 120,
          attack: 20,
          defense: 18,
          critChance: 0.2,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 14,
          abilities: [
            ClassAbilities.sword_strike_iii,
            ClassAbilities.shadow_stab_ii
          ],
          description:
            "The crowned leader of the outskirts raiders, vastly tougher than a common goblin.",
          portrait:
            "/battle/characters/GoblinKing.png",
          tags: ["Goblin", "Elite", "Boss", "Fighter"]
        },
        options
      )
  }
}

export function isEnemyId(
  value: string
): value is EnemyId {
  return Object.prototype.hasOwnProperty.call(
    ENEMY_DEFINITIONS,
    value
  )
}

export function createEnemyInstance(
  enemyId: EnemyId,
  options?: EnemyInstanceOptions
): Unit {
  const definition = ENEMY_DEFINITIONS[enemyId]

  if (!definition) {
    throw new Error(`Unknown enemy id: ${enemyId}`)
  }

  return definition.create(options)
}
