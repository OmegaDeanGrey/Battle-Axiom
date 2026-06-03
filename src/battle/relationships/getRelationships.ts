import type { Unit }
from "../models/unit"

import type { Relationship } from "../models/relationship"

import { RelationshipRegistry }
from "./relationshipRegistry"

export function getRelationships(
  units: Unit[]
): Relationship[] {

  return RelationshipRegistry
    .filter(rel => {

      const remaining =
        units.map(u => u.name)

      for (const member of rel.members) {

        const index =
          remaining.indexOf(member)

        if (index === -1) {
          return false
        }

        remaining.splice(index, 1)
      }

      return true
    })
    .map(rel => ({
      ...rel,

      level: 1,

      xp: 0,

      xpToNextLevel: 10
    }))
}