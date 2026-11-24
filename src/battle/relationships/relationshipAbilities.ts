import type { Relationship } from "../models/relationship"
import {
  RELATIONSHIP_REACTIONS_PER_PAIR_PER_ROUND
} from "./relationshipConfig"

export type RelationshipEffectId =
  | "encouragement"
  | "follow_up_attack"
  | "protective_instinct"
  | "bond_technique"

export type RelationshipEffect = {
  id: RelationshipEffectId
  name: string
  description: string
  requiredPoints: number
  reaction: boolean
  chance?: number
  limitPerBattle?: number
}

export const RELATIONSHIP_EFFECTS: RelationshipEffect[] = [
  {
    id: "encouragement",
    name: "Encouragement",
    description:
      "5% chance to grant an ally a small bonus to their next attack.",
    requiredPoints: 50,
    reaction: true,
    chance: 0.05
  },
  {
    id: "follow_up_attack",
    name: "Follow-Up Attack",
    description:
      "10% chance to perform a reduced-damage follow-up when the partner attacks.",
    requiredPoints: 125,
    reaction: true,
    chance: 0.1
  },
  {
    id: "protective_instinct",
    name: "Protective Instinct",
    description:
      "Once per battle, a chance to intercept an attack against the partner.",
    requiredPoints: 250,
    reaction: true,
    limitPerBattle: 1
  },
  {
    id: "bond_technique",
    name: "Bond Technique",
    description:
      "Unlocks a special cooperative ability unique to this pair's classes.",
    requiredPoints: 400,
    reaction: false
  }
]

export function getRelationshipEffect(
  id: RelationshipEffectId
): RelationshipEffect | undefined {
  return RELATIONSHIP_EFFECTS.find(
    effect =>
      effect.id === id
  )
}

export function getUnlockedRelationshipEffects(
  relationship: Relationship
): RelationshipEffect[] {
  return RELATIONSHIP_EFFECTS.filter(
    effect =>
      relationship.points >=
      effect.requiredPoints
  )
}

export function getLockedRelationshipEffects(
  relationship: Relationship
): RelationshipEffect[] {
  return RELATIONSHIP_EFFECTS.filter(
    effect =>
      relationship.points <
      effect.requiredPoints
  )
}

export function makeRelationshipReactionKey(
  relationship: Relationship,
  effectId: RelationshipEffectId
): string {
  return `${relationship.id}:${effectId}`
}

export function canUseRelationshipEffect(
  relationship: Relationship,
  effectId: RelationshipEffectId,
  usedReactionKeys: Iterable<string> = []
): boolean {
  const effect =
    getRelationshipEffect(effectId)

  if (
    !effect ||
    relationship.points <
      effect.requiredPoints
  ) {
    return false
  }

  if (!effect.reaction) {
    return true
  }

  const used =
    new Set(usedReactionKeys)

  const usedForPair = [
    ...used
  ].filter(key =>
    key.startsWith(
      `${relationship.id}:`
    )
  ).length

  const limit =
    effect.limitPerBattle ??
    RELATIONSHIP_REACTIONS_PER_PAIR_PER_ROUND

  return usedForPair < limit
}
