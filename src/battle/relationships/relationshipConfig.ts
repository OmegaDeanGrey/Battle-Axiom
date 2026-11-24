export const RELATIONSHIP_MAX_POINTS = 500

export const RELATIONSHIP_BATTLE_POINTS = 5

export const RELATIONSHIP_REACTIONS_PER_PAIR_PER_ROUND = 1

export type RelationshipTier = {
  id: string
  name: string
  minPoints: number
  maxPoints: number
  description: string
  effectId: string
}

export const RELATIONSHIP_TIERS: RelationshipTier[] = [
  {
    id: "strangers",
    name: "Strangers",
    minPoints: 0,
    maxPoints: 49,
    description:
      "These heroes have yet to learn how to fight side by side.",
    effectId: ""
  },
  {
    id: "acquaintances",
    name: "Acquaintances",
    minPoints: 50,
    maxPoints: 124,
    description:
      "A growing trust lets these heroes encourage one another in battle.",
    effectId: "encouragement"
  },
  {
    id: "companions",
    name: "Companions",
    minPoints: 125,
    maxPoints: 249,
    description:
      "These heroes know each other's rhythms well enough to follow up an opening.",
    effectId: "follow_up_attack"
  },
  {
    id: "trusted_allies",
    name: "Trusted Allies",
    minPoints: 250,
    maxPoints: 399,
    description:
      "Each hero will instinctively shield the other from harm.",
    effectId: "protective_instinct"
  },
  {
    id: "bonded",
    name: "Bonded",
    minPoints: 400,
    maxPoints: RELATIONSHIP_MAX_POINTS,
    description:
      "Shared trials have forged a technique that belongs to this pair alone.",
    effectId: "bond_technique"
  }
]

export function clampRelationshipPoints(
  points: number
): number {
  if (!Number.isFinite(points)) return 0

  return Math.max(
    0,
    Math.min(
      RELATIONSHIP_MAX_POINTS,
      Math.round(points)
    )
  )
}

export function getRelationshipTier(
  points: number
): RelationshipTier {
  const value =
    clampRelationshipPoints(points)

  return (
    [...RELATIONSHIP_TIERS]
      .reverse()
      .find(
        tier =>
          value >= tier.minPoints
      ) ?? RELATIONSHIP_TIERS[0]
  )
}

export function getNextRelationshipTier(
  points: number
): RelationshipTier | null {
  const tier =
    getRelationshipTier(points)

  return (
    RELATIONSHIP_TIERS.find(
      candidate =>
        candidate.minPoints >
        tier.minPoints
    ) ?? null
  )
}

export type RelationshipTierProgress = {
  tier: RelationshipTier
  nextTier: RelationshipTier | null
  floor: number
  ceiling: number
  progress: number
  pointsToNext: number
}

export function getRelationshipTierProgress(
  points: number
): RelationshipTierProgress {
  const value =
    clampRelationshipPoints(points)

  const tier =
    getRelationshipTier(value)

  const nextTier =
    getNextRelationshipTier(value)

  if (!nextTier) {
    return {
      tier,
      nextTier: null,
      floor: tier.minPoints,
      ceiling: RELATIONSHIP_MAX_POINTS,
      progress: 1,
      pointsToNext: 0
    }
  }

  const span =
    nextTier.minPoints - tier.minPoints

  return {
    tier,
    nextTier,
    floor: tier.minPoints,
    ceiling: nextTier.minPoints,
    progress:
      span > 0
        ? Math.max(
            0,
            Math.min(
              1,
              (value - tier.minPoints) /
                span
            )
          )
        : 1,
    pointsToNext:
      nextTier.minPoints - value
  }
}
