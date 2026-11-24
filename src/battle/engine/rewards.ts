import { ItemRegistry } from "../../game/data/ItemRegistry"
import { ENEMY_DEFINITIONS } from "../enemies/enemyDefinitions"
import { getScriptedEncounter } from "../encounters/scriptedEncounters"
import type {
  EncounterId,
  EnemyId,
  LootEntry,
  ScriptedEncounterRewards
} from "../encounters/encounterTypes"

export type RandomSource = () => number

export type RewardItemDrop = {
  itemId: keyof typeof ItemRegistry
  quantity: number
}

export type BattleRewardResult = {
  xp: number
  gold: number
  items: RewardItemDrop[]
}

function clampChance(
  chance: number
) {
  if (
    !Number.isFinite(chance) ||
    chance <= 0
  ) {
    return 0
  }

  if (chance >= 1) return 1

  return chance
}

function rollInteger(
  min: number,
  max: number,
  random: RandomSource
) {
  if (max <= min) return min

  const roll = Math.min(
    Math.max(random(), 0),
    0.999999999999
  )

  return min + Math.floor(
    roll * (max - min + 1)
  )
}

function addItemDrop(
  items: Map<string, number>,
  itemId: string,
  quantity: number
) {
  if (quantity <= 0) return

  if (!ItemRegistry[itemId as keyof typeof ItemRegistry]) {
    throw new Error(
      `Unknown item id in reward table: ${itemId}`
    )
  }

  items.set(
    itemId,
    (items.get(itemId) ?? 0) + quantity
  )
}

function rollLootEntries(
  entries: readonly LootEntry[] | undefined,
  items: Map<string, number>,
  random: RandomSource
) {
  if (!entries) return

  for (const entry of entries) {
    if (
      random() >=
      clampChance(entry.chance)
    ) {
      continue
    }

    const quantity = rollInteger(
      entry.minQuantity,
      entry.maxQuantity,
      random
    )

    addItemDrop(
      items,
      entry.itemId,
      quantity
    )
  }
}

export function generateEnemyRewards(
  defeatedEnemyIds: readonly EnemyId[],
  random: RandomSource = Math.random
): BattleRewardResult {
  const items = new Map<string, number>()

  let xp = 0
  let gold = 0

  for (const enemyId of defeatedEnemyIds) {
    const definition =
      ENEMY_DEFINITIONS[enemyId]

    if (!definition) {
      throw new Error(
        `Unknown enemy reward definition: ${enemyId}`
      )
    }

    xp += definition.reward.xp
    gold += definition.reward.gold

    rollLootEntries(
      definition.reward.loot,
      items,
      random
    )
  }

  return {
    xp,
    gold,
    items: [...items.entries()].map(
      ([itemId, quantity]) => ({
        itemId: itemId as keyof typeof ItemRegistry,
        quantity
      })
    )
  }
}

export function applyScriptedRewards(
  rewards: BattleRewardResult,
  encounterId: EncounterId | undefined,
  defeatedEnemyIds: readonly EnemyId[],
  random: RandomSource = Math.random
): BattleRewardResult {
  if (!encounterId) return rewards

  const encounter =
    getScriptedEncounter(encounterId)

  if (!encounter?.rewards) {
    return rewards
  }

  const scripted: ScriptedEncounterRewards =
    encounter.rewards

  const items = new Map(
    rewards.items.map(drop => [
      drop.itemId,
      drop.quantity
    ])
  )

  let xp = rewards.xp
  let gold = rewards.gold

  xp += scripted.bonusXp ?? 0
  gold += scripted.bonusGold ?? 0

  for (const entry of
    scripted.guaranteedItems ?? []) {
    addItemDrop(
      items,
      entry.itemId,
      entry.quantity
    )
  }

  rollLootEntries(
    scripted.loot,
    items,
    random
  )

  for (const enemyId of defeatedEnemyIds) {
    const override =
      scripted.enemyRewardOverrides?.[enemyId]

    if (!override) continue

    if (override.xp !== undefined) {
      const currentBase =
        ENEMY_DEFINITIONS[enemyId]?.reward.xp ?? 0
      xp +=
        override.xp - currentBase
    }

    if (override.gold !== undefined) {
      const currentBase =
        ENEMY_DEFINITIONS[enemyId]?.reward.gold ?? 0
      gold +=
        override.gold - currentBase
    }

    rollLootEntries(
      override.loot,
      items,
      random
    )
  }

  return {
    xp,
    gold,
    items: [...items.entries()].map(
      ([itemId, quantity]) => ({
        itemId: itemId as keyof typeof ItemRegistry,
        quantity
      })
    )
  }
}

export function calculateBattleRewards(
  defeatedEnemyIds: readonly EnemyId[],
  encounterId?: EncounterId,
  random: RandomSource = Math.random
): BattleRewardResult {
  const base = generateEnemyRewards(
    defeatedEnemyIds,
    random
  )

  return applyScriptedRewards(
    base,
    encounterId,
    defeatedEnemyIds,
    random
  )
}
