import type {
  EncounterId,
  ScriptedEncounterConfig
} from "./encounterTypes"

export const SCRIPTED_ENCOUNTERS: Record<
  EncounterId,
  ScriptedEncounterConfig
> = {
  "king-goblin-ambush": {
    id: "king-goblin-ambush",
    name: "King Goblin Ambush",
    conclusion:
      "The goblin raiders retreat into the broken outskirts, leaving their crowned leader's war chest behind.",
    rewards: {
      bonusXp: 40,
      bonusGold: 60,
      guaranteedItems: [
        {
          itemId: "potion",
          quantity: 2
        }
      ],
      loot: [
        {
          itemId: "hiPotion",
          chance: 0.35,
          minQuantity: 1,
          maxQuantity: 1
        }
      ]
    },
    enemies: [
      { enemyId: "king-goblin" },
      {
        enemyId: "goblin",
        displayName: "Goblin Henchman"
      },
      {
        enemyId: "goblin",
        displayName: "Goblin Henchman"
      },
      {
        enemyId: "goblin",
        displayName: "Goblin Henchman"
      }
    ],
    openingDialogue: [
      {
        speaker: "King Goblin",
        portrait:
          "/battle/characters/GoblinKing.png",
        text:
          "Look at them, lads. Soft little heroes, still pretending the world belongs to them."
      },
      {
        speaker: "Goblin Henchman",
        portrait:
          "/battle/characters/GoblinHenchman.png",
        text:
          "But, King... we were told not to come this close to their town!"
      },
      {
        speaker: "King Goblin",
        portrait:
          "/battle/characters/GoblinKing.png",
        text:
          "That was before the cracks. Before the old boundaries began to crumble."
      },
      {
        speaker: "King Goblin",
        portrait:
          "/battle/characters/GoblinKing.png",
        text:
          "Something is breaking, you fools. The world itself! And when the walls between things fall, who's going to stop us?"
      },
      {
        speaker: "King Goblin",
        portrait:
          "/battle/characters/GoblinKing.png",
        text:
          "Now then... let's see what these little heroes are made of!"
      }
    ]
  }
}

export function getScriptedEncounter(
  id: EncounterId
): ScriptedEncounterConfig | undefined {
  return SCRIPTED_ENCOUNTERS[id]
}
