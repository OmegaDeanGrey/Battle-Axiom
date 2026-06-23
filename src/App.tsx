import { useState } from "react"

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import MainMenu from "./pages/MainMenu"

import PartySelection from "./game/components/PartySelection"

import { createGoblin } from "./battle/units/enemies/goblin"

import BattleView from "./battle/components/BattleView"

import type { Unit } from "./battle/models/unit"


export default function App() {

  const [party, setParty] =
    useState<Unit[] | null>(null)


  return (

    <BrowserRouter>

      <Routes>


        <Route

          path="/"

          element={
            <MainMenu />
          }

        />


        <Route

          path="/party"

          element={

            <PartySelection

              onStartBattle={(selectedParty) => {

                setParty(selectedParty)

              }}

            />

          }

        />


        <Route

          path="/battle"

          element={

            party && (

              <BattleScreen
                party={party}
              />

            )

          }

        />


      </Routes>

    </BrowserRouter>

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


