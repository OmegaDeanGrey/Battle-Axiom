import type { Unit } from "../../models/unit"
import { createSkillTree } from "../../skills/createSkillTree"
import { BasicAttack } from "../../abilities/basicAttack"

export function createMage(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Mage",
          heroClass:"Mage",
          hp: 60,
          maxHp: 60,
          attack: 40,
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
          skillTree: createSkillTree("Mage"),
          team: "player",
          statuses: [],
          description: "A student of the arcane who seeks to understand and command the forces beyond the ordinary world. Every Mage follows a unique path of magical discovery, with countless possibilities waiting to be unlocked.",
          portrait: "/MageImage.png",
          tags: ["Arcane", "Ranged"]
        }
    }