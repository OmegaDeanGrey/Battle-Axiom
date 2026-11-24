import type { Unit } from "../models/unit"
import type { ActiveSynergy } from "../models/synergy"
import { SynergyRegistry } from "./synergyRegistry"

export function getActiveSynergies(
  party: Unit[]
): ActiveSynergy[] {

  const tagCounts:
    Record<string, number> = {}

  party.forEach(hero => {
    hero.tags.forEach(tag => {
      tagCounts[tag] =
        (tagCounts[tag] || 0) + 1
    })
  })

  return SynergyRegistry
    .filter(synergy =>
      synergy.tags.every(
        tag =>
          (tagCounts[tag] || 0) >=
          synergy.threshold
      )
    )
    .map(synergy => ({
      ...synergy,
      count: Math.min(
        ...synergy.tags.map(
          tag => tagCounts[tag] || 0
        )
      ),
      contributors: party
        .filter(hero =>
          hero.tags.some(tag =>
            synergy.tags.includes(tag)
          )
        )
        .map(hero => hero.name)
    }))
}
