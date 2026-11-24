import type { Unit } from "../models/unit"
import {
  getXpToNextLevel,
  grantXp
} from "./grantXp"
import {
  applyHeroLevelGrowth
} from "./heroGrowth"
import {
  clampUnitHp
} from "../models/hp"

export type HeroRewardProgress = {
  id: string
  name: string
  heroClass: string
  portrait: string
  xpGained: number
  level: number
  xp: number
  xpToNext: number
  levelsGained: number
  skillPointsGained: number
  hp: number
  maxHp: number
  participated: boolean
  survived: boolean
}

export function resolveHeroRewardProgress(
  party: readonly Unit[],
  battleUnits: readonly Unit[],
  rewardXp: number
): HeroRewardProgress[] {
  const battleById = new Map(
    battleUnits.map(unit => [unit.id, unit])
  )

  const xpAward =
    Number.isFinite(rewardXp) && rewardXp > 0
      ? Math.floor(rewardXp)
      : 0

  return party.map(hero => {
    const battleUnit =
      battleById.get(hero.id) ?? hero

    const survived = battleUnit.hp > 0

    const projected = structuredClone(hero)

    const levelsGained = survived
      ? grantXp(projected, xpAward)
      : 0

    const grown = applyHeroLevelGrowth(
      projected,
      levelsGained
    )

    const hp = Math.min(
      Math.max(0, battleUnit.hp),
      grown.maxHp
    )

    return {
      id: hero.id,
      name: hero.name,
      heroClass: hero.heroClass,
      portrait: hero.portrait,
      xpGained: survived ? xpAward : 0,
      level: grown.level,
      xp: grown.xp,
      xpToNext: getXpToNextLevel(
        grown.level
      ),
      levelsGained,
      skillPointsGained: levelsGained,
      hp,
      maxHp: grown.maxHp,
      participated: true,
      survived
    }
  })
}

export function applyRewardProgressToUnits(
  battleUnits: readonly Unit[],
  progress: readonly HeroRewardProgress[]
): Unit[] {
  const progressById = new Map(
    progress.map(row => [row.id, row])
  )

  return battleUnits.map(unit => {
    const resolved =
      structuredClone(unit)

    clampUnitHp(resolved)

    const row = progressById.get(unit.id)

    if (!row) return resolved

    resolved.level = row.level
    resolved.xp = row.xp
    resolved.skillPoints +=
      row.skillPointsGained
    resolved.hp = row.hp

    clampUnitHp(resolved)

    return resolved
  })
}
