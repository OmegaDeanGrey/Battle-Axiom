import type { Unit } from "../../battle/models/unit"

export function createSleepDialogue(
  party: Unit[]
) {

  const dialogue = [

    {
      type: "whisper",
      speaker: "???",
      portrait: "/DreamVoice.png",
      text: "Pssst...you awake?"
    }

  ]

  party.forEach(hero => {

    let text = ""

    switch (hero.heroClass) {

      case "Knight":
        text = "…Doesn’t matter how tired I am. I can still fight."
        break

      case "Mage":
        text = "The Axiom… it’s louder tonight than usual."
        break

      case "Rogue":
        text = "This inn feels wrong. Too quiet."
        break

      case "Priest":
        text = "Rest now. We’ll need our strength tomorrow."
        break

      default:
        text = "I can’t shake this feeling…"
        break

    }

    dialogue.push({

      type: "hero",

      speaker: hero.name,

      portrait: hero.portrait,

      text

    })

  })

  dialogue.push({

    type: "fade_silence",
    speaker: "",
    portrait: "",
    text: ""

  })

  return dialogue

}