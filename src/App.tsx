import { useState } from "react"

import PartySelection from "./game/components/PartySelection"

import { useBattle } from "./battle/hooks/useBattle"

import { createGoblin } from "./battle/units/enemies/goblin"

import BattleView from "./battle/components/BattleView"

import type { Unit } from "./battle/models/unit"


export default function App() {

  const [party, setParty] =
    useState<Unit[] | null>(null)


  if (!party) {

    return (

      <PartySelection

        onStartBattle={(selectedParty) => {

          setParty(selectedParty)

        }}

      />

    )

  }


  return (

    <BattleScreen

      party={party}

    />

  )

}


function BattleScreen({
  party
}: {
  party: Unit[]
}) {

  console.log("PARTY RECEIVED:", party)


  const units = [
    ...party,
    createGoblin()
  ]


  console.log("UNITS SENT TO BATTLE:", units)


  return (

    <BattleView
      units={units}
    />

  )
}


