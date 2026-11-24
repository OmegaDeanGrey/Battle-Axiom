import type { Unit } from "../../models/unit"
import { createSkillTree } from "../../skills/createSkillTree"
import { BasicAttack } from "../../abilities/basicAttack"

export function createPriest(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Priest",
          heroClass:"Priest",
          hp: 90,
          maxHp: 90,
          attack: -10,
          defense: 20,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 15,
          timeline: 0,
          level: 1,
          xp: 0,
          skillPoints: 0,
          abilities: [BasicAttack],
          passives: [],
          skillTree: createSkillTree("Priest"),
          team: "player",
          statuses: [],
          description: "A guardian of sacred power who protects allies through healing, restoration, and divine energy. Priests follow paths shaped by how they choose to serve and influence the world around them.",
          portrait: "/PriestImage.png",
          tags: ["Human", "Buff"]
        }
    }