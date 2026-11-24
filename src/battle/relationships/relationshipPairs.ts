import type { Unit } from "../models/unit"
import type {
  Relationship,
  RelationshipMember
} from "../models/relationship"
import {
  clampRelationshipPoints
} from "./relationshipConfig"

export function makeRelationshipId(
  firstHeroId: string,
  secondHeroId: string
): string {
  const ids = [
    firstHeroId,
    secondHeroId
  ].sort()

  return `pair:${ids[0]}:${ids[1]}`
}

export function heroToRelationshipMember(
  hero: Unit
): RelationshipMember {
  return {
    heroId: hero.id,
    name: hero.name,
    heroClass: hero.heroClass,
    portrait: hero.portrait
  }
}

export function createRelationship(
  first: RelationshipMember,
  second: RelationshipMember,
  points = 0
): Relationship {
  const members = [
    first,
    second
  ].sort((a, b) =>
    a.heroId.localeCompare(b.heroId)
  )

  return {
    id: makeRelationshipId(
      first.heroId,
      second.heroId
    ),
    members,
    points:
      clampRelationshipPoints(points)
  }
}

export function addRelationshipPoints(
  relationship: Relationship,
  amount: number
): Relationship {
  return {
    ...relationship,
    points:
      clampRelationshipPoints(
        relationship.points + amount
      )
  }
}

export function getRelationshipForPair(
  relationships: Relationship[],
  firstHeroId: string,
  secondHeroId: string
): Relationship | undefined {
  const id = makeRelationshipId(
    firstHeroId,
    secondHeroId
  )

  return relationships.find(
    relationship =>
      relationship.id === id
  )
}

export function getRelationshipsForHero(
  relationships: Relationship[],
  heroId: string
): Relationship[] {
  return relationships.filter(
    relationship =>
      relationship.members.some(
        member =>
          member.heroId === heroId
      )
  )
}

export function getRelationshipPartner(
  relationship: Relationship,
  heroId: string
): RelationshipMember | undefined {
  return relationship.members.find(
    member =>
      member.heroId !== heroId
  )
}

export function upsertRelationship(
  relationships: Relationship[],
  next: Relationship
): Relationship[] {
  const index =
    relationships.findIndex(
      relationship =>
        relationship.id === next.id
    )

  if (index === -1) {
    return [
      ...relationships,
      next
    ]
  }

  return relationships.map(
    relationship =>
      relationship.id === next.id
        ? next
        : relationship
  )
}

export function registerRelationshipMembers(
  relationships: Relationship[],
  heroes: Unit[]
): Relationship[] {
  if (heroes.length === 0) {
    return relationships
  }

  const updated =
    new Map<string, RelationshipMember>()

  for (const hero of heroes) {
    updated.set(
      hero.id,
      heroToRelationshipMember(hero)
    )
  }

  return relationships.map(
    relationship => ({
      ...relationship,
      members: relationship.members.map(
        member =>
          updated.get(member.heroId) ??
          member
      )
    })
  )
}

export function addBattleRelationshipPoints(
  relationships: Relationship[],
  participantHeroIds: string[],
  amount: number,
  members: Map<string, RelationshipMember>
): Relationship[] {
  const heroIds = [
    ...new Set(participantHeroIds)
  ].sort()

  let next = [
    ...relationships
  ]

  for (
    let i = 0;
    i < heroIds.length;
    i += 1
  ) {
    const first =
      members.get(heroIds[i])

    if (!first) continue

    for (
      let j = i + 1;
      j < heroIds.length;
      j += 1
    ) {
      const second =
        members.get(heroIds[j])

      if (!second) continue

      const existing =
        getRelationshipForPair(
          next,
          first.heroId,
          second.heroId
        )

      const relationship =
        existing ??
        createRelationship(
          first,
          second
        )

      next = upsertRelationship(
        next,
        addRelationshipPoints(
          relationship,
          amount
        )
      )
    }
  }

  return next
}

type SanitizeOptions = {
  legacyScale?: number
}

function readMemberId(
  value: unknown
): string | null {
  if (typeof value === "string") {
    return value.length > 0
      ? value
      : null
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>

    if (
      typeof record.heroId ===
        "string" &&
      record.heroId.length > 0
    ) {
      return record.heroId
    }
  }

  return null
}

function readMember(
  value: unknown,
  heroId: string
): RelationshipMember {
  const fallback: RelationshipMember = {
    heroId,
    name: heroId,
    heroClass: "Unknown",
    portrait: ""
  }

  if (
    !value ||
    typeof value !== "object"
  ) {
    return fallback
  }

  const record =
    value as Record<string, unknown>

  return {
    heroId,
    name:
      typeof record.name === "string"
        ? record.name
        : fallback.name,
    heroClass:
      typeof record.heroClass ===
        "string"
        ? record.heroClass
        : fallback.heroClass,
    portrait:
      typeof record.portrait ===
        "string"
        ? record.portrait
        : fallback.portrait
  }
}

export function sanitizeRelationships(
  value: unknown,
  options: SanitizeOptions = {}
): Relationship[] {
  if (!Array.isArray(value)) {
    return []
  }

  const scale =
    options.legacyScale ?? 1

  const byId =
    new Map<string, Relationship>()

  for (const entry of value) {
    if (
      !entry ||
      typeof entry !== "object"
    ) {
      continue
    }

    const record =
      entry as Record<string, unknown>

    if (
      !Array.isArray(record.members) ||
      record.members.length !== 2
    ) {
      continue
    }

    const heroIds =
      record.members.map(
        readMemberId
      )

    if (
      heroIds.some(
        id => id === null
      )
    ) {
      continue
    }

    const ids =
      heroIds as [string, string]

    if (ids[0] === ids[1]) {
      continue
    }

    const rawPoints =
      typeof record.points === "number"
        ? record.points
        : typeof record.xp === "number"
          ? record.xp
          : 0

    const points =
      clampRelationshipPoints(
        rawPoints * scale
      )

    const relationship:
      Relationship = {
        id: makeRelationshipId(
          ids[0],
          ids[1]
        ),
        members: [
          readMember(
            record.members[0],
            ids[0]
          ),
          readMember(
            record.members[1],
            ids[1]
          )
        ].sort((a, b) =>
          a.heroId.localeCompare(
            b.heroId
          )
        ),
        points
      }

    const existing =
      byId.get(relationship.id)

    if (
      !existing ||
      relationship.points >
        existing.points
    ) {
      byId.set(
        relationship.id,
        relationship
      )
    }
  }

  return [...byId.values()].sort(
    (a, b) =>
      a.id.localeCompare(b.id)
  )
}
