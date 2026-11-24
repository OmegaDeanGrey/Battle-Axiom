import type { Unit } from "../../models/unit"
import { createSkillTree } from "../../skills/createSkillTree"
import { BasicAttack } from "../../abilities/basicAttack"

export function createElvenRanger(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Elven Ranger",
          heroClass:"Elven Ranger",
          hp: 70,
          maxHp: 70,
          attack: 15,
          defense: 15,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 20,
          timeline: 0,
          level: 1,
          xp: 0,
          skillPoints: 0,
          abilities: [BasicAttack],
          passives: [],
          skillTree: createSkillTree("Elven Ranger"),
          team: "player",
          statuses: [],
          description: "A master of the wilds who combines unmatched precision with a deep connection to nature. Elven Rangers strike enemies from afar while adapting to the flow of battle.",
          portrait: "/ElvenRangerImage.png",
          tags: ["Nature", "Ranged"]
        }
    }