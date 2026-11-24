import type { Unit, UnitStatKey } from "../models/unit"

export type GrowthStatKey = Exclude<
  UnitStatKey,
  "hp"
>

export type HeroGrowth =
  Partial<Record<GrowthStatKey, number>>

export const HERO_LEVEL_GROWTH: Readonly<
  Record<string, HeroGrowth>
> = {
  Knight: {
    maxHp: 14,
    attack: 3,
    defense: 3,
    speed: 1
  },
  Priest: {
    maxHp: 10,
    attack: 1,
    defense: 2,
    speed: 2
  },
  Rogue: {
    maxHp: 9,
    attack: 4,
    defense: 1,
    speed: 4
  },
  "Baby Dragon": {
    maxHp: 16,
    attack: 4,
    defense: 2,
    speed: 1
  },
  Fairy: {
    maxHp: 8,
    attack: 2,
    defense: 1,
    speed: 3
  },
  "Elven Ranger": {
    maxHp: 10,
    attack: 3,
    defense: 1,
    speed: 3
  },
  Mage: {
    maxHp: 7,
    attack: 5,
    defense: 1,
    speed: 2
  },
  Witch: {
    maxHp: 9,
    attack: 3,
    defense: 2,
    speed: 2
  },
  Summoner: {
    maxHp: 11,
    attack: 3,
    defense: 2,
    speed: 2
  }
}

const DEFAULT_GROWTH: HeroGrowth = {
  maxHp: 10,
  speed: 2
}

export function getHeroLevelGrowth(
  heroClass: string
): HeroGrowth {
  return (
    HERO_LEVEL_GROWTH[heroClass] ??
    DEFAULT_GROWTH
  )
}

export function applyHeroLevelGrowth(
  unit: Unit,
  levelsGained: number
): Unit {
  if (levelsGained <= 0) {
    return structuredClone(unit)
  }

  const growth = getHeroLevelGrowth(
    unit.heroClass
  )

  const grown: Unit = structuredClone(unit)

  for (const [stat, value] of Object.entries(
    growth
  )) {
    grown[stat as GrowthStatKey] +=
      value * levelsGained
  }

  grown.maxHp = Math.max(0, grown.maxHp)
  grown.hp = Math.min(
    Math.max(0, grown.hp),
    grown.maxHp
  )

  return grown
}
