import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGame } from "../../game/context/GameContext"

import { gateGuardDialogue } from "../../game/dialogue/twell/gateGuard"
import { innDialogue, innMorningGreeting } from "../../game/dialogue/twell/innKeeper"
import { innPatron1Dialogue } from "../../game/dialogue/twell/innPatron1"
import { innPatron2Dialogue } from "../../game/dialogue/twell/innPatron2"
import { villagerDialogue } from "../../game/dialogue/twell/villager"
import { twellSistersDialogue } from "../../game/dialogue/twell/twellSisters"
import { sebastianDialogue } from "../../game/dialogue/twell/sebastian"
import { mayorDialogue } from "../../game/dialogue/twell/mayor"
import { cleoDialogue } from "../../game/dialogue/twell/cleo"
import { windmillMillerDialogue } from "../../game/dialogue/twell/windmillMiller"
import { windmillApprenticeDialogue } from "../../game/dialogue/twell/windmillApprentice"
import { windmillTravelerDialogue } from "../../game/dialogue/twell/windmillTraveler"

import { useTwellAudio } from "./useTwellAudio"
import { useTwellDialogue } from "./useTwellDialogue"
import TwellBackground from "./TwellBackground"
import EnvironmentalLayer from "../../game/components/EnvironmentalLayer"
import TownLocationButtons from "./TownLocationButtons"
import LocationModal, { type Location } from "./LocationModal"
import DialogueRenderer from "./DialogueRenderer"

import "./TwellTown.css"

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
    mayorRewardClaimed,
    setMayorRewardClaimed,
    setItemShopUnlocked,
    healParty,
    gold,
    setGold,
    setWeaponShopUnlocked,
    setWindmillRowUnlocked,
    setTownOutskirtsUnlocked,
  } = useGame()

  const { audioRef, playing, toggleAudio, fadeOutMusic, fadeInMusic } = useTwellAudio()
  const [activeLocation, setActiveLocation] = useState<Location>(null)
  const [innMorningDialogueIndex, setInnMorningDialogueIndex] = useState(-1)

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
    sebastianDialogueIndex,
    setSebastianDialogueIndex,
    twellSistersDialogueIndex,
    setTwellSistersDialogueIndex,
    storyDialogue,
    storyDialogueIndex,
    setStoryDialogueIndex,
    startSleepSequence,
    sleepSequence,
    shopMenuOpen,
setShopMenuOpen,
    windmillMillerDialogueIndex,
    setWindmillMillerDialogueIndex,
    windmillApprenticeDialogueIndex,
    setWindmillApprenticeDialogueIndex,
    windmillTravelerDialogueIndex,
    setWindmillTravelerDialogueIndex,
  } = useTwellDialogue(party, () => {
    setMayorUnlocked(true)
    setItemShopUnlocked(true)
    
    setActiveLocation("inn")
    fadeInMusic()
    setInnMorningDialogueIndex(0)
    healParty()
  })

  const [mayorDialogueIndex, setMayorDialogueIndex] = useState(-1)
  const [cleoDialogueIndex, setCleoDialogueIndex] = useState(-1)
  const [weaponShopMenuOpen, setWeaponShopMenuOpen] = useState(false)

  function handleSleep() {
    setActiveLocation(null)
    startSleepSequence(fadeOutMusic)
  }

  function handleExitTwell() {
    setTownOutskirtsUnlocked(true)
    setActiveLocation(null)
    navigate("/world")
  }

  function nextDialogueIndex(
    current: number,
    length: number,
  ): number {
    const next = current + 1
    return next >= length ? -1 : next
  }

  return (
    <div id="Twell">
      <audio ref={audioRef} loop autoPlay>
        <source src="/Roukus.mp3" type="audio/mpeg" />
      </audio>

      <TwellBackground />

      <EnvironmentalLayer backgroundId="twell" />

      <TownLocationButtons
        onLocationClick={setActiveLocation}
        onExit={() => navigate("/world")}
        onVillagerClick={() => setVillagerDialogueIndex(0)}
        onTwellSistersClick={() => setTwellSistersDialogueIndex(0)}
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
        onSebastianClick={() => setSebastianDialogueIndex(0)}
        onMayorClick={() => setMayorDialogueIndex(0)}
        onWindmillMillerClick={() => setWindmillMillerDialogueIndex(0)}
        onWindmillApprenticeClick={() => setWindmillApprenticeDialogueIndex(0)}
        onWindmillTravelerClick={() => setWindmillTravelerDialogueIndex(0)}
        onExitTwell={handleExitTwell}
        onSleep={handleSleep}
        sleepingQuartersUnlocked={sleepingQuartersUnlocked}
        shopMenuOpen={shopMenuOpen}
        setShopMenuOpen={setShopMenuOpen}
        onCleoClick={() => setCleoDialogueIndex(0)}
        weaponShopMenuOpen={weaponShopMenuOpen}
        setWeaponShopMenuOpen={setWeaponShopMenuOpen}
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
        innMorning={{
          index: innMorningDialogueIndex,
          lines: innMorningGreeting,
          onContinue: () => setInnMorningDialogueIndex(-1),
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
          twellSisters={{
          index: twellSistersDialogueIndex,
          lines: twellSistersDialogue,
          onContinue: () => {
            const next = twellSistersDialogueIndex + 1
            if (next >= twellSistersDialogue.length) {
              setTwellSistersDialogueIndex(-1)
            } else {
              setTwellSistersDialogueIndex(next)
            }
          },
        }}
          sebastian={{
          index: sebastianDialogueIndex,
          lines: sebastianDialogue,
          onContinue: () => {
            const next = sebastianDialogueIndex + 1
            if (next >= sebastianDialogue.length) {
              setSebastianDialogueIndex(-1)
              setShopMenuOpen(true)
            } else {
              setSebastianDialogueIndex(next)
            }
          },
        }}
        cleo={{
          index: cleoDialogueIndex,
          lines: cleoDialogue,
          onContinue: () => {
            const next = cleoDialogueIndex + 1

            if (next >= cleoDialogue.length) {
              setCleoDialogueIndex(-1)
              setWeaponShopMenuOpen(true)
            } else {
              setCleoDialogueIndex(next)
            }
          },
        }}
        mayor={{
          index: mayorDialogueIndex,
          lines: mayorDialogue,
          onContinue: () => {
            const next = mayorDialogueIndex + 1

            if (next >= mayorDialogue.length) {
              setMayorDialogueIndex(-1)

              if (!mayorRewardClaimed) {
                setGold(gold + 500)
                setWeaponShopUnlocked(true)
                setWindmillRowUnlocked(true)
                setMayorRewardClaimed(true)
              }
            } else {
              setMayorDialogueIndex(next)
            }
          },
        }}
        windmillMiller={{
          index: windmillMillerDialogueIndex,
          lines: windmillMillerDialogue,
          onContinue: () =>
            setWindmillMillerDialogueIndex(
              nextDialogueIndex(
                windmillMillerDialogueIndex,
                windmillMillerDialogue.length,
              ),
            ),
        }}
        windmillApprentice={{
          index: windmillApprenticeDialogueIndex,
          lines: windmillApprenticeDialogue,
          onContinue: () =>
            setWindmillApprenticeDialogueIndex(
              nextDialogueIndex(
                windmillApprenticeDialogueIndex,
                windmillApprenticeDialogue.length,
              ),
            ),
        }}
        windmillTraveler={{
          index: windmillTravelerDialogueIndex,
          lines: windmillTravelerDialogue,
          onContinue: () =>
            setWindmillTravelerDialogueIndex(
              nextDialogueIndex(
                windmillTravelerDialogueIndex,
                windmillTravelerDialogue.length,
              ),
            ),
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

      {(sleepSequence === "fadingOut" || sleepSequence === "dialogue" || sleepSequence === "sleeping") && (
        <div key="fade-out" className="fade-to-black" />
      )}
      {sleepSequence === "fadingIn" && (
        <div key="fade-in" className="fade-to-black fade-in" />
      )}
    </div>
  )
}
