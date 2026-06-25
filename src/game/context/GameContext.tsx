import {
  createContext,
  useContext,
  useState
}
from "react"

import type { Unit }
from "../../battle/models/unit"


type GameContextType = {

  party: Unit[]

  setParty: (
    party: Unit[]
  ) => void


  itemShopUnlocked: boolean

  setItemShopUnlocked: (
    unlocked: boolean
  ) => void


  mayorUnlocked: boolean

  setMayorUnlocked: (
    unlocked: boolean
  ) => void


  weaponShopUnlocked: boolean

  setWeaponShopUnlocked: (
    unlocked: boolean
  ) => void


  questBoardUnlocked: boolean

  setQuestBoardUnlocked: (
    unlocked: boolean
  ) => void


  windmillRowUnlocked: boolean

  setWindmillRowUnlocked: (
    unlocked: boolean
  ) => void


  townOutskirtsUnlocked: boolean

  setTownOutskirtsUnlocked: (
    unlocked: boolean
  ) => void

}


const GameContext =
  createContext<
    GameContextType | undefined
  >(undefined)


export function GameProvider({
  children
}: {
  children: React.ReactNode
}) {

  const [party, setParty] =
    useState<Unit[]>([])

  const [
  itemShopUnlocked,
  setItemShopUnlocked
] = useState(false)

const [
  mayorUnlocked,
  setMayorUnlocked
] = useState(false)

const [
  weaponShopUnlocked,
  setWeaponShopUnlocked
] = useState(false)

const [
  questBoardUnlocked,
  setQuestBoardUnlocked
] = useState(false)

const [
  windmillRowUnlocked,
  setWindmillRowUnlocked
] = useState(false)

const [
  townOutskirtsUnlocked,
  setTownOutskirtsUnlocked
] = useState(false)


  return (

    <GameContext.Provider
      value={{
        party,
        setParty,
        itemShopUnlocked,
        setItemShopUnlocked,
        mayorUnlocked,
        setMayorUnlocked,
        weaponShopUnlocked,
        setWeaponShopUnlocked,
        questBoardUnlocked,
        setQuestBoardUnlocked,
        windmillRowUnlocked,
        setWindmillRowUnlocked,
        townOutskirtsUnlocked,
        setTownOutskirtsUnlocked
      }}
    >

      {children}

    </GameContext.Provider>

  )

}


export function useGame() {

  const context =
    useContext(GameContext)

  if (!context) {

    throw new Error(
      "useGame must be used inside GameProvider"
    )

  }

  return context

}