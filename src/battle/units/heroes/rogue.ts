import type { Unit } from "../../models/unit"
import { createSkillTree } from "../../skills/createSkillTree"
import { BasicAttack } from "../../abilities/basicAttack"

export function createRogue(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Rogue",
          heroClass:"Rogue",
          hp: 75,
          maxHp: 75,
          attack: 20,
          defense: 15,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 30,
          timeline: 0,
          level: 1,
          xp: 0,
          skillPoints: 0,
          abilities: [BasicAttack],
          passives: [],
          skillTree: createSkillTree("Rogue"),
          team: "player",
          statuses: [],
          description: "A clever and adaptable fighter who relies on speed, precision, and opportunity. Rogues learn to exploit weaknesses and can develop into masters of stealth, deception, or deadly combat techniques.",
          portrait: "/RogueImage.png",
          tags: ["Human", "Ranged"]
        }
    }