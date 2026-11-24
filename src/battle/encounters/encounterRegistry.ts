import type { EncounterLocationConfig, LocationId } from "./encounterTypes"

export const ENCOUNTER_LOCATIONS: Record<
  LocationId,
  EncounterLocationConfig
> = {
  "twell-outskirts": {
    id: "twell-outskirts",
    difficulty: {
      levelOffset: 0,
      statScale: 1
    },
    firstEncounterId: "king-goblin-ambush",
    randomEncounters: {
      minEnemies: 1,
      maxEnemies: 4,
      enemyWeights: [
        { enemyId: "goblin", weight: 70 },
        { enemyId: "hobgoblin", weight: 15 },
        { enemyId: "orc", weight: 10 }
      ],
      soloEncounters: [
        { enemyId: "nightmare", chance: 0.05 }
      ]
    }
  }
}

export function getEncounterLocation(
  locationId: LocationId
): EncounterLocationConfig | undefined {
  return ENCOUNTER_LOCATIONS[locationId]
}
