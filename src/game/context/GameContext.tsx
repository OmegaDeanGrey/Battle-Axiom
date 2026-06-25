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


  return (

    <GameContext.Provider
      value={{
        party,
        setParty
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