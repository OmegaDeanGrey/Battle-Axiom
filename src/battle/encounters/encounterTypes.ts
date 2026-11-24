import type { Unit } from "../models/unit"
import type { ItemId } from "../../game/data/ItemRegistry"

export type EnemyId =
  | "goblin"
  | "hobgoblin"
  | "orc"
  | "nightmare"
  | "king-goblin"

export type LocationId = string

export type EncounterId = string

export type RandomSource = () => number

export type IdSource = () => string

export type DialogueLine = {
  speaker: string
  text: string
  portrait?: string
}

export type LootEntry = {
  itemId: ItemId
  chance: number
  minQuantity: number
  maxQuantity: number
}

export type GuaranteedItemEntry = {
  itemId: ItemId
  quantity: number
}

export type EnemyReward = {
  xp: number
  gold: number
  loot?: readonly LootEntry[]
}

export type EnemyRewardOverride = Partial<EnemyReward>

export type ScriptedEncounterRewards = {
  bonusXp?: number
  bonusGold?: number
  guaranteedItems?: readonly GuaranteedItemEntry[]
  loot?: readonly LootEntry[]
  enemyRewardOverrides?: Partial<
    Record<EnemyId, EnemyRewardOverride>
  >
}

export type EnemyWeight = {
  enemyId: EnemyId
  weight: number
}

export type ExclusiveSoloEncounterConfig = {
  enemyId: EnemyId
  chance: number
}

export type RandomEncounterConfig = {
  minEnemies: number
  maxEnemies: number
  enemyWeights: readonly EnemyWeight[]
  soloEncounters?: readonly ExclusiveSoloEncounterConfig[]
}

export type ScriptedEnemy = {
  enemyId: EnemyId
  displayName?: string
}

export type EncounterCondition =
  | { type: "questComplete"; questId: string }
  | { type: "storyFlag"; flag: string }
  | { type: "bossDefeated"; bossId: string }
  | { type: "minPartyLevel"; level: number }

export type ScriptedEncounterConfig = {
  id: EncounterId
  name: string
  enemies: readonly ScriptedEnemy[]
  openingDialogue?: readonly DialogueLine[]
  conditions?: readonly EncounterCondition[]
  conclusion?: string
  rewards?: ScriptedEncounterRewards
}

export type LocationDifficulty = {
  levelOffset?: number
  statScale?: number
}

export type EncounterLocationConfig = {
  id: LocationId
  difficulty?: LocationDifficulty
  firstEncounterId?: EncounterId
  randomEncounters: RandomEncounterConfig
}

export type EncounterContext = {
  completedScriptedEncounters?: Readonly<
    Record<LocationId, readonly EncounterId[]>
  >
  completedQuestIds?: readonly string[]
  storyFlags?: readonly string[]
  defeatedBossIds?: readonly string[]
  partyLevel?: number
}

export type GeneratedEncounter = {
  locationId: LocationId
  encounterId: EncounterId
  name: string
  isScripted: boolean
  enemies: Unit[]
  openingDialogue: readonly DialogueLine[]
  conclusion?: string
}

export type DialogueGateState = {
  lines: readonly DialogueLine[]
  index: number
}
