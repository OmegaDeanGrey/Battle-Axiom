import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGame } from "../../game/context/GameContext"

import { gateGuardDialogue } from "../../game/dialogue/twell/gateGuard"
import { innDialogue } from "../../game/dialogue/twell/innKeeper"
import { innPatron1Dialogue } from "../../game/dialogue/twell/innPatron1"
import { innPatron2Dialogue } from "../../game/dialogue/twell/innPatron2"
import { villagerDialogue } from "../../game/dialogue/twell/villager"

import { useTwellAudio } from "./useTwellAudio"
import { useTwellDialogue } from "./useTwellDialogue"
import TwellBackground from "./TwellBackground"
import TownLocationButtons from "./TownLocationButtons"
import LocationModal, { type Location } from "./LocationModal"
import DialogueRenderer from "./DialogueRenderer"

import "./Twell.css"

export default function TwellTown() {
  const navigate = useNavigate()
  const {
    party,
    windmillRowUnlocked,
    mayorUnlocked,
    questBoardUnlocked,
    itemShopUnlocked,
    weaponShopUnlocked,
    sleepingQuartersUnlocked,
    setSleepingQuartersUnlocked,
    setMayorUnlocked,
    setItemShopUnlocked,
  } = useGame()

  const { audioRef, playing, toggleAudio, fadeOutMusic } = useTwellAudio()
  const [activeLocation, setActiveLocation] = useState<Location>(null)

  const {
    gateDialogueIndex,
    setGateDialogueIndex,
    innPatron1DialogueIndex,
    setInnPatron1DialogueIndex,
    innPatron2DialogueIndex,
    setInnPatron2DialogueIndex,
    innDialogueIndex,
    setInnDialogueIndex,
    villagerDialogueIndex,
    setVillagerDialogueIndex,
    storyDialogue,
    storyDialogueIndex,
    setStoryDialogueIndex,
    fadingToBlack,
    startSleepSequence,
  } = useTwellDialogue(party, () => {
    setMayorUnlocked(true)
    setItemShopUnlocked(true)
  })

  function handleSleep() {
    setActiveLocation(null)
    startSleepSequence(fadeOutMusic)
  }

  function nextDialogueIndex(
    current: number,
    length: number,
  ): number {
    const next = current + 1
    return next >= length ? length : next
  }

  return (
    <div id="Twell">
      <audio ref={audioRef} loop autoPlay>
        <source src="/Roukus.mp3" type="audio/mpeg" />
      </audio>

      <TwellBackground />

      <TownLocationButtons
        onLocationClick={setActiveLocation}
        onExit={() => navigate("/world")}
        onVillagerClick={() => setVillagerDialogueIndex(0)}
        windmillRowUnlocked={windmillRowUnlocked}
        mayorUnlocked={mayorUnlocked}
        questBoardUnlocked={questBoardUnlocked}
        itemShopUnlocked={itemShopUnlocked}
        weaponShopUnlocked={weaponShopUnlocked}
        playing={playing}
        onToggleAudio={toggleAudio}
      />

      <LocationModal
        activeLocation={activeLocation}
        onClose={() => setActiveLocation(null)}
        onInnPatron1Click={() => setInnPatron1DialogueIndex(0)}
        onInnPatron2Click={() => setInnPatron2DialogueIndex(0)}
        onInnKeeperClick={() => setInnDialogueIndex(0)}
        onSleep={handleSleep}
        sleepingQuartersUnlocked={sleepingQuartersUnlocked}
      />

      <DialogueRenderer
        gateGuard={{
          index: gateDialogueIndex,
          lines: gateGuardDialogue,
          onContinue: () =>
            setGateDialogueIndex(
              nextDialogueIndex(gateDialogueIndex, gateGuardDialogue.length),
            ),
        }}
        innPatron1={{
          index: innPatron1DialogueIndex,
          lines: innPatron1Dialogue,
          onContinue: () =>
            setInnPatron1DialogueIndex(
              nextDialogueIndex(
                innPatron1DialogueIndex,
                innPatron1Dialogue.length,
              ),
            ),
        }}
        innPatron2={{
          index: innPatron2DialogueIndex,
          lines: innPatron2Dialogue,
          onContinue: () =>
            setInnPatron2DialogueIndex(
              nextDialogueIndex(
                innPatron2DialogueIndex,
                innPatron2Dialogue.length,
              ),
            ),
        }}
        innKeeper={{
          index: innDialogueIndex,
          lines: innDialogue,
          onContinue: () => {
            const next = innDialogueIndex + 1
            if (next >= innDialogue.length) {
              setSleepingQuartersUnlocked(true)
              setInnDialogueIndex(-1)
            } else {
              setInnDialogueIndex(next)
            }
          },
        }}
        villager={{
          index: villagerDialogueIndex,
          lines: villagerDialogue,
          onContinue: () => {
            const next = villagerDialogueIndex + 1
            if (next >= villagerDialogue.length) {
              setVillagerDialogueIndex(-1)
            } else {
              setVillagerDialogueIndex(next)
            }
          },
        }}
        story={{
          index: storyDialogueIndex,
          lines: storyDialogue,
          onContinue: () => {
            const next = storyDialogueIndex + 1
            if (next >= storyDialogue.length) {
              setStoryDialogueIndex(-1)
            } else {
              setStoryDialogueIndex(next)
            }
          },
        }}
      />

      {fadingToBlack && (
        <div className="fade-to-black fade-out" />
      )}
    </div>
  )
}
