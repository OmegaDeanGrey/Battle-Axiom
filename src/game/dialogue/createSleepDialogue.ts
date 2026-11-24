
import type { Unit } from "../../battle/models/unit"

const classDialogue: Record<string, string[]> = {

  Knight: [
    "Whatever the Axiom is... steel alone won't be enough.",
    "I've fought monsters before. This feels different somehow.",
    "The old soldiers used to speak of a silence before great wars. Tonight reminds me of that.",
    "Sleep lightly. Tomorrow may ask more of us than we expect.",
    "Every road has led us here... and I don't think it was chance.",
    "I keep thinking someone is watching us, though I see no one.",
    "If the Axiom truly exists... then perhaps it has been watching us all along."
  ],

  Priest: [
    "I prayed tonight... but something answered that was not the Light.",
    "Faith tells me not to fear the unknown, yet my heart still trembles.",
    "The Axiom feels older than any scripture I have ever studied.",
    "Perhaps destiny is simply another name for the Axiom.",
    "Sleep peacefully. Tomorrow may reveal truths we are not ready to hear.",
    "I sense purpose around each of us, though I cannot explain why.",
    "Whatever the Axiom is... I do not believe it wishes us harm."
  ],

  Rogue: [
    "Every town has secrets. This one feels like it's hiding the world.",
    "I've stolen from kings. I've never stolen from fate.",
    "Too many coincidences. I don't believe in coincidences.",
    "Someone knows more than they're telling us.",
    "I've learned to trust my instincts. They're screaming tonight.",
    "The shadows feel... crowded.",
    "If the Axiom wanted us dead, we'd already be dead. So why are we still here?"
  ],

  Mage: [
    "The Axiom... I can almost hear it beneath everything.",
    "Magic bends around something I cannot see.",
    "Every spell I know feels incomplete now.",
    "The old texts hinted at a force beyond mana. I laughed when I read them.",
    "Sometimes knowledge is more frightening than ignorance.",
    "I wonder if the Axiom has always been speaking... and we've only just begun listening.",
    "If I survive this journey, nothing I believed about magic will remain the same."
  ],

  ElvenRanger: [
    "Even the forest winds carried whispers about the Axiom.",
    "Animals fled this region long before we arrived.",
    "The stars have shifted from the paths my ancestors recorded.",
    "Nature remembers things people choose to forget.",
    "The trees grow quieter the closer we come to our destiny.",
    "Every trail eventually points toward the same mystery.",
    "Something ancient is waking."
  ],

  Fairy: [
    "The flowers stopped singing when we entered this valley.",
    "Even dreams seem afraid tonight.",
    "I've never seen moonlight sparkle quite like this.",
    "The old fairies used to warn children never to follow the voice beyond the stars.",
    "The Axiom sounds lonely.",
    "Maybe it just wants someone to understand it.",
    "Do you think mysteries get scared too?"
  ],

  Witch: [
    "Every omen I've read has ended at the same place.",
    "The cauldron showed only darkness... and three silhouettes.",
    "Old magic refuses to name the Axiom.",
    "Some names have power. Perhaps that's why no one speaks its true one.",
    "I've studied curses all my life. This feels nothing like one.",
    "Tonight smells like prophecy.",
    "Be careful what answers when you begin asking questions."
  ],

  Summoner: [
    "The spirits are unusually quiet tonight.",
    "Something greater than spirits walks these lands.",
    "Even my companions hesitate when I speak the word 'Axiom.'",
    "The veil between worlds feels thinner here.",
    "I wonder what answers if someone calls the Axiom's name.",
    "There are presences watching... but they do not seem hostile.",
    "Whatever the Axiom is... it knows we're coming."
  ],

  BabyDragon: [
    "*grrrr...*",
    "*mrrr...?*",
    "*snort!*",
    "*grrr-rawr!*",
    "*huff...*",
    "*chirrrp!*",
    "*rawr!*"
  ]

}

export function createSleepDialogue(
  party: Unit[]
) {

  const dialogue = [

    {
      type: "whisper",
      speaker: "???",
      portrait: "/DreamVoice.png",
      text: "Pssst... you awake?"
    }

  ]

  party.forEach(hero => {

    const options =
      classDialogue[hero.heroClass] ??
      [
        "I can't shake this feeling..."
      ]

    const text =
      options[
        Math.floor(
          Math.random() * options.length
        )
      ]

    dialogue.push({

      type: "hero",

      speaker: hero.name,

      portrait: hero.portrait,

      text

    })

  })

  dialogue.push({

    type: "whisper",

    speaker: "???",

    portrait: "/DreamVoice.png",

    text: "Goodnight, fellows."

  })

  return dialogue

}

