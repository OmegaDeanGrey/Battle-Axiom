import type { Unit } from "../../models/unit"
import { createSkillTree } from "../../skills/createSkillTree"
import { PoisonStrike }
from "../../abilities/poisonStrike"

import { Claw }
from "../../abilities/claw"

export function createKnight(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Knight",
          heroClass:"Knight",
          hp: 120,
          maxHp: 120,
          attack: 25,
          defense: 25,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 10,
          timeline: 0,
          level: 1,
          xp: 0,
          skillPoints: 0,
          abilities: [PoisonStrike, Claw],
          passives: [],
          skillTree: createSkillTree("Knight"),
          team: "player",
          statuses: [],
          description:
            "A disciplined warrior trained in defense, leadership, and battlefield control. Knights form the foundation of many great heroes, with paths that can lead toward greater protection, power, or mastery of combat.",
          portrait: "/KnightImage.png",
          tags: ["Human", "Melee"]
        }
    }