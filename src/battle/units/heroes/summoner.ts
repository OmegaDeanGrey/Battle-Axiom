import type { Unit } from "../../models/unit"
import { createSkillTree } from "../../skills/createSkillTree"
import { BasicAttack } from "../../abilities/basicAttack"

export function createSummoner(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Summoner",
          heroClass:"Summoner",
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
          skillTree: createSkillTree("Summoner"),
          team: "player",
          statuses: [],
          description: "A wielder of ancient knowledge who calls upon creatures and forces beyond themselves. Summoners grow by discovering new entities to command and new ways to shape the battlefield.",
          portrait: "/SummonerImage.png",
          tags: ["Arcane", "Melee"]
        }
    }