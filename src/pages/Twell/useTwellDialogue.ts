import { useState, useEffect, useRef } from "react"
import { createSleepDialogue } from "../../game/dialogue/createSleepDialogue"
import type { Unit } from "../../battle/models/unit"

export type SleepSequence =
  | "idle"
  | "fadingOut"
  | "dialogue"
  | "sleeping"
  | "fadingIn"
  | "morning"

export function useTwellDialogue(party: Unit[], onWakeUp: () => void) {
  const onWakeUpRef = useRef(onWakeUp)

  useEffect(() => {
    onWakeUpRef.current = onWakeUp
  }, [onWakeUp])

  const [gateDialogueIndex, setGateDialogueIndex] = useState(0)
  const [innPatron1DialogueIndex, setInnPatron1DialogueIndex] = useState(-1)
  const [innPatron2DialogueIndex, setInnPatron2DialogueIndex] = useState(-1)
  const [innDialogueIndex, setInnDialogueIndex] = useState(-1)
  const [villagerDialogueIndex, setVillagerDialogueIndex] = useState(-1)
  const [twellSistersDialogueIndex, setTwellSistersDialogueIndex] = useState(-1)
  const [sebastianDialogueIndex, setSebastianDialogueIndex] = useState(-1)
  const [windmillMillerDialogueIndex, setWindmillMillerDialogueIndex] = useState(-1)
  const [windmillApprenticeDialogueIndex, setWindmillApprenticeDialogueIndex] = useState(-1)
  const [windmillTravelerDialogueIndex, setWindmillTravelerDialogueIndex] = useState(-1)
  const [shopMenuOpen, setShopMenuOpen] = useState(false)
  const [storyDialogue, setStoryDialogue] = useState<
    { speaker: string; portrait: string; text: string }[]
  >([])
  const [storyDialogueIndex, setStoryDialogueIndex] = useState(-1)

  const [sleepSequence, setSleepSequence] = useState<SleepSequence>("idle")
  const [fadingToBlack, setFadingToBlack] = useState(false)

  useEffect(() => {
    if (sleepSequence !== "dialogue") return
    if (storyDialogueIndex >= 0) return

    const timer = setTimeout(
      () => setSleepSequence("sleeping"),
      0
    )

    return () => clearTimeout(timer)
  }, [sleepSequence, storyDialogueIndex])

  useEffect(() => {
    if (sleepSequence !== "sleeping") return
    const timer = setTimeout(() => setSleepSequence("fadingIn"), 2000)
    return () => clearTimeout(timer)
  }, [sleepSequence])

  useEffect(() => {
    if (sleepSequence !== "fadingIn") return
    const timer = setTimeout(() => {
      setFadingToBlack(false)
      setSleepSequence("morning")
      onWakeUpRef.current()
    }, 1500)
    return () => clearTimeout(timer)
  }, [sleepSequence])

  function startSleepSequence(fadeOutMusic: () => void) {
    setSleepSequence("fadingOut")
    setFadingToBlack(true)
    fadeOutMusic()

    setTimeout(() => {
      setStoryDialogue([])
      setStoryDialogueIndex(-1)
      setStoryDialogue(createSleepDialogue(party))
      setStoryDialogueIndex(0)
      setSleepSequence("dialogue")
    }, 2000)
  }

  return {
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
    twellSistersDialogueIndex,
    setTwellSistersDialogueIndex,
    sebastianDialogueIndex,
    setSebastianDialogueIndex,
    windmillMillerDialogueIndex,
    setWindmillMillerDialogueIndex,
    windmillApprenticeDialogueIndex,
    setWindmillApprenticeDialogueIndex,
    windmillTravelerDialogueIndex,
    setWindmillTravelerDialogueIndex,
    shopMenuOpen,
    setShopMenuOpen,
    storyDialogue,
    storyDialogueIndex,
    setStoryDialogueIndex,
    sleepSequence,
    fadingToBlack,
    startSleepSequence,
  }
}
