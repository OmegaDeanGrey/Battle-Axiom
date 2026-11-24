import type { Unit, UnitStatKey } from "../models/unit"
import { applyHeroLevelGrowth } from "./heroGrowth"

export function commitBattleProgress(
  party: Unit[],
  battleUnits: Unit[]
): Unit[] {

  return party.map(hero => {

    const result =
      battleUnits.find(
        unit => unit.id === hero.id
      )

    if (!result) return hero

    const levelsGained =
      Math.max(
        0,
        result.level - hero.level
      )

    const grownHero =
      applyHeroLevelGrowth(
        hero,
        levelsGained
      )

    const gains:
      Partial<Record<UnitStatKey, number>> = {}

    for (const node of result.skillTree) {

      const previous =
        hero.skillTree.find(
          n => n.id === node.id
        )

      const previousRank =
        previous?.rank ?? 0

      if (
        node.rank <= previousRank ||
        node.effect.type !== "stat"
      ) {
        continue
      }

      for (
        let rank = previousRank + 1;
        rank <= node.rank;
        rank++
      ) {
        const value =
          node.effect.value +
          (rank - 1) *
            (node.effect.perRank ?? 0)

        gains[node.effect.stat] =
          (gains[node.effect.stat] || 0) +
          value
      }
    }

    const maxHp =
      grownHero.maxHp + (gains.maxHp || 0)

    const hp =
      Math.min(
        Math.max(0, result.hp),
        maxHp
      )

    return {
      ...grownHero,

      level: result.level,
      xp: result.xp,
      skillPoints: result.skillPoints,

      skillTree: result.skillTree.map(
        node => ({
          ...node,
          effect: { ...node.effect },
          requires: node.requires
            ? [...node.requires]
            : undefined
        })
      ),

      abilities: result.abilities.map(
        ability => ({ ...ability })
      ),

      maxHp,
      hp,

      attack:
        grownHero.attack + (gains.attack || 0),

      defense:
        grownHero.defense + (gains.defense || 0),

      speed:
        grownHero.speed + (gains.speed || 0)
    }
  })
}
