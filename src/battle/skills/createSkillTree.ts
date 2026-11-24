import type { SkillNode } from "../models/skillNode"
import { SkillTreeRegistry } from "./SkillTreeRegistry"

export function createSkillTree(
  heroClass: string
): SkillNode[] {

  const templates =
    SkillTreeRegistry[heroClass] || []

  return templates.map(template => ({
    ...template,
    rank: 0,
    unlocked: false,
    effect: { ...template.effect },
    requires: template.requires
      ? [...template.requires]
      : undefined
  }))
}
