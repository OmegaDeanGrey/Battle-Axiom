import type {
  EncounterId,
  GeneratedEncounter,
  LocationId
} from "./encounterTypes"

export type CompletedScriptedEncounters = Readonly<
  Record<LocationId, readonly EncounterId[]>
>

export function hasCompletedScriptedEncounter(
  completed:
    | Readonly<CompletedScriptedEncounters>
    | undefined,
  locationId: LocationId,
  encounterId: EncounterId
): boolean {
  return (
    completed?.[locationId]?.includes(
      encounterId
    ) ?? false
  )
}

export function addCompletedScriptedEncounter(
  completed:
    | Readonly<CompletedScriptedEncounters>
    | undefined,
  locationId: LocationId,
  encounterId: EncounterId
): CompletedScriptedEncounters {
  if (
    hasCompletedScriptedEncounter(
      completed,
      locationId,
      encounterId
    )
  ) {
    return Object.fromEntries(
      Object.entries(completed ?? {}).map(
        ([key, ids]) => [key, [...ids]]
      )
    )
  }

  return {
    ...Object.fromEntries(
      Object.entries(completed ?? {}).map(
        ([key, ids]) => [key, [...ids]]
      )
    ),
    [locationId]: [
      ...(completed?.[locationId] ?? []),
      encounterId
    ]
  }
}

export function canResolveEncounterOutcome(
  winner: "player" | "enemy" | undefined,
  alreadyResolved: boolean
): boolean {
  return !alreadyResolved && winner === "player"
}

export function shouldCompleteScriptedEncounter(
  winner: "player" | "enemy" | undefined,
  encounter: GeneratedEncounter
): boolean {
  return (
    winner === "player" && encounter.isScripted
  )
}
