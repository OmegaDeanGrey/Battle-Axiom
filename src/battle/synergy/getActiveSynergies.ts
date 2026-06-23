import type { Unit }
from "../models/unit"

import {
  SynergyRegistry
}
from "./synergyRegistry"


export function getActiveSynergies(
  party: Unit[]
) {


  const tagCounts:
    Record<string, number> = {}


  party.forEach(hero => {

    hero.tags.forEach(tag => {

      tagCounts[tag] =
        (tagCounts[tag] || 0) + 1

    })

  })


  return SynergyRegistry.filter(
    synergy => {

      return synergy.tags.every(
        tag =>
          tagCounts[tag] >= synergy.threshold
      )

    }
  )

}