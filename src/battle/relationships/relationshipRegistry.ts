import type { Relationship }
from "../models/relationship"

export const RelationshipRegistry: Relationship[] = [
  {
    id: "holy_alliance",
    name: "Holy Alliance",
    members: ["Knight", "Priest"],

    level: 1,
    xp: 0,
    xpToNextLevel: 10,

    bonuses: [
      {
        type: "stat",
        stat: "defense",
        baseValue: 10,
        perLevel: 2
      }
    ]
  },

  {
    id: "pack_tactics",
    name: "Pack Tactics",
    members: ["Wolf", "Wolf"],

    level: 1,
    xp: 0,
    xpToNextLevel: 10,

    bonuses: [
      {
        type: "stat",
        stat: "speed",
        baseValue: 15,
        perLevel: 3
      }
    ]
  }
]