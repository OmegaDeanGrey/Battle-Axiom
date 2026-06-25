import {
  useGame
}
from "./game/context/GameContext"

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import MainMenu from "./pages/MainMenu"

import PartySelection from "./game/components/PartySelection"

import {
  createGoblin
}
from "./battle/units/enemies/goblin"

import BattleView from "./battle/components/BattleView"

import type { Unit }
from "./battle/models/unit"

import WorldMap from "./pages/WorldMap"
import TwellTown from "./pages/Twell/TwellTown"


export default function App() {


  const {
    party
  } = useGame()



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
            <PartySelection />
          }
        />


        <Route
          path="/world"
          element={
            <WorldMap />
          }
        />

                <Route
          path="/twell"
          element={
            <TwellTown />
          }
        />

        <Route
          path="/battle"
          element={

            party.length > 0 && (

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


  const units = [

    ...party,

    createGoblin()

  ]


  return (

    <BattleView
      units={units}
    />

  )

}