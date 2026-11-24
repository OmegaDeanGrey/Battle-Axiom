import type { Unit } from "../../models/unit"
import { createSkillTree } from "../../skills/createSkillTree"
import { BasicAttack } from "../../abilities/basicAttack"

export function createBabyDragon(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Baby Dragon",
          heroClass:"Baby Dragon",
          hp: 130,
          maxHp: 130,
          attack: 30,
          defense: 25,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 5,
          timeline: 0,
          level: 1,
          xp: 0,
          skillPoints: 0,
          abilities: [BasicAttack],
          passives: [],
          skillTree: createSkillTree("Baby Dragon"),
          team: "player",
          statuses: [],
          description: "A young creature born with immense potential and an ancient power waiting to awaken. Baby Dragons grow through experience, eventually discovering what kind of legendary being they are destined to become.",
          portrait: "/BabyDragonImage.png",
          tags: ["Nature", "Melee"]
        }
    }