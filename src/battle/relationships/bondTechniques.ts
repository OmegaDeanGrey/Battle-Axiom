import type { Relationship } from "../models/relationship"

export type BondTechnique = {
  id: string
  name: string
  description: string
  classPair: [string, string]
}

export const BondTechniqueRegistry: BondTechnique[] = [
  {
    id: "arcane_bulwark",
    name: "Arcane Bulwark",
    description:
      "The Knight shields the Mage while she channels a powerful spell, reducing incoming damage and empowering the spell.",
    classPair: ["Knight", "Mage"]
  },
  {
    id: "consecrated_guard",
    name: "Consecrated Guard",
    description:
      "The Knight anchors a ward of light while the Priest pours blessing into it, guarding both heroes.",
    classPair: ["Knight", "Priest"]
  },
  {
    id: "shadow_flourish",
    name: "Shadow Flourish",
    description:
      "The Rogue slips behind an enemy while the Fairy bends the light, turning a single strike into a dazzling ambush.",
    classPair: ["Rogue", "Fairy"]
  },
  {
    id: "wildfire_volley",
    name: "Wildfire Volley",
    description:
      "The Elven Ranger looses a burning arrow that the Mage detonates into a spreading wave of flame.",
    classPair: ["Elven Ranger", "Mage"]
  }
]

export function getBondTechnique(
  relationship: Relationship
): BondTechnique | null {
  const classes = relationship.members
    .map(member =>
      member.heroClass
    )
    .sort()

  return (
    BondTechniqueRegistry.find(
      technique => {
        const pair = [
          ...technique.classPair
        ].sort()

        return (
          pair[0] === classes[0] &&
          pair[1] === classes[1]
        )
      }
    ) ?? null
  )
}

export type BondTechniqueDisplay = {
  name: string
  description: string
}

export function getBondTechniqueDisplay(
  relationship: Relationship
): BondTechniqueDisplay {
  const technique =
    getBondTechnique(relationship)

  if (technique) {
    return {
      name: technique.name,
      description: technique.description
    }
  }

  return {
    name: "Untitled Bond Technique",
    description:
      "These heroes have forged a unique technique, but its form has not been recorded yet."
  }
}
