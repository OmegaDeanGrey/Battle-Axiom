import type { Relationship } from "../../battle/models/relationship"
import {
  sanitizeRelationships
} from "../../battle/relationships/relationshipPairs"

export const RELATIONSHIP_STORAGE_KEY =
  "battle-axiom.relationships"

const LEGACY_STORAGE_KEY =
  "battle-axiom.relationships.v1"

const LEGACY_POINT_SCALE = 5

export type RelationshipSaveData = {
  relationships: Relationship[]
  awardedBattleIds: string[]
}

type SavedState = {
  version: number
  relationships: unknown
  awardedBattleIds: unknown
}

function readAwardedBattleIds(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return [
    ...new Set(
      value.filter(
        (id): id is string =>
          typeof id === "string" &&
          id.length > 0
      )
    )
  ]
}

function parseState(
  raw: string | null,
  legacy: boolean
): RelationshipSaveData | null {
  if (!raw) return null

  try {
    const parsed =
      JSON.parse(raw) as
        | SavedState
        | unknown[]

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return null
    }

    const state =
      parsed as SavedState

    const useLegacyScale =
      legacy || state.version === 1

    return {
      relationships:
        sanitizeRelationships(
          state.relationships,
          useLegacyScale
            ? {
                legacyScale:
                  LEGACY_POINT_SCALE
              }
            : {}
        ),
      awardedBattleIds:
        readAwardedBattleIds(
          state.awardedBattleIds
        )
    }
  } catch {
    return null
  }
}

export function loadRelationshipState(): RelationshipSaveData {
  const current =
    parseState(
      safeRead(RELATIONSHIP_STORAGE_KEY),
      false
    )

  if (current) {
    return current
  }

  const legacy =
    parseState(
      safeRead(LEGACY_STORAGE_KEY),
      true
    )

  return (
    legacy ?? {
      relationships: [],
      awardedBattleIds: []
    }
  )
}

export function saveRelationshipState(
  data: RelationshipSaveData
): void {
  try {
    window.localStorage.setItem(
      RELATIONSHIP_STORAGE_KEY,
      JSON.stringify({
        version: 2,
        relationships: data.relationships,
        awardedBattleIds:
          data.awardedBattleIds
      })
    )
  } catch {
    return
  }
}

function safeRead(
  key: string
): string | null {
  try {
    return window.localStorage.getItem(
      key
    )
  } catch {
    return null
  }
}
