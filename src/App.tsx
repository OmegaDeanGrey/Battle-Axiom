import {
  useGame,
  type BattleResult
}
from "./game/context/GameContext"
import "./App.css"
import type { Relationship }
from "./battle/models/relationship"

import {
  useRef,
  useState
} from "react"

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams
} from "react-router-dom"

import type { BattleState }
  from "./battle/engine/battleEngine"
import { isEnemyId } from "./battle/enemies/enemyDefinitions"
import type { EnemyId } from "./battle/encounters/encounterTypes"
import { calculateBattleRewards } from "./battle/engine/rewards"
import {
  applyRewardProgressToUnits,
  resolveHeroRewardProgress
} from "./battle/progression/resolveBattleOutcome"

import MainMenu from "./pages/MainMenu"

import PartySelection from "./game/components/PartySelection"

import {
  generateLocationEncounter
} from "./battle/encounters/encounterGenerator"

import {
  canResolveEncounterOutcome,
  type CompletedScriptedEncounters
} from "./battle/encounters/encounterProgress"
import BattleResolutionModal from "./battle/components/BattleResolutionModal"

import BattleView from "./battle/components/BattleView"

import type { Unit }
from "./battle/models/unit"

import WorldMap from "./pages/WorldMap"
import TwellTown from "./pages/Twell/TwellTown"
import GlobalPartyButton from "./game/components/GlobalPartyButton"


const DEFAULT_BATTLE_LOCATION = "twell-outskirts"


export default function App() {


  const {
    party,
    relationships,
    completedScriptedEncounters,
    applyBattleResult
  } = useGame()



  return (

    <BrowserRouter>

      <GlobalPartyButton />

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
            <BattleScreen
              locationId={DEFAULT_BATTLE_LOCATION}
              party={party}
              relationships={relationships}
              completedScriptedEncounters={
                completedScriptedEncounters
              }
              applyBattleResult={applyBattleResult}
            />
          }
        />

        <Route
          path="/battle/:locationId"
          element={
            <BattleRoute
              party={party}
              relationships={relationships}
              completedScriptedEncounters={
                completedScriptedEncounters
              }
              applyBattleResult={applyBattleResult}
            />
          }
        />


      </Routes>

    </BrowserRouter>

  )

}



type BattleScreenProps = {
  locationId: string
  party: Unit[]
  relationships: Relationship[]
  completedScriptedEncounters: CompletedScriptedEncounters
  applyBattleResult: (
    result: BattleResult
  ) => void
}

function BattleRoute(
  props: Omit<BattleScreenProps, "locationId">
) {

  const { locationId } = useParams()

  return (
    <BattleScreen
      key={locationId ?? DEFAULT_BATTLE_LOCATION}
      {...props}
      locationId={
        locationId ?? DEFAULT_BATTLE_LOCATION
      }
    />
  )
}

function BattleScreen({
  locationId,
  party,
  relationships,
  completedScriptedEncounters,
  applyBattleResult
}: {
  locationId: string
  party: Unit[]
  relationships: Relationship[]
  completedScriptedEncounters: CompletedScriptedEncounters
  applyBattleResult: (
    result: BattleResult
  ) => void
}) {

  const navigate = useNavigate()

  const outcomeResolved = useRef(false)
  const outcomeCommitted = useRef(false)

  const [resolutionPreview, setResolutionPreview] =
    useState<BattleResult | null>(null)

  const [battleSetup] = useState(() => {

    const encounter = generateLocationEncounter(
      locationId,
      {
        encounterContext: {
          completedScriptedEncounters
        }
      }
    )

    return {
      encounter,
      units: [
        ...party.map(hero =>
          structuredClone(hero)
        ),
        ...encounter.enemies.map(enemy =>
          structuredClone(enemy)
        )
      ]
    }
  })

  function buildBattleResult(
    battle: BattleState
  ): BattleResult {
    const outcome =
      battle.winner === "player"
        ? "victory"
        : "defeat"

    const defeatedEnemyIds =
      battle.units
        .filter(
          unit =>
            unit.team === "enemy" &&
            unit.definitionId &&
            isEnemyId(unit.definitionId)
        )
        .map(
          unit => unit.definitionId as EnemyId
        )

    const reward =
      outcome === "victory"
        ? calculateBattleRewards(
            defeatedEnemyIds,
            battleSetup.encounter.isScripted
              ? battleSetup.encounter.encounterId
              : undefined
          )
        : undefined

    const heroProgress =
      resolveHeroRewardProgress(
        party,
        battle.units,
        reward?.xp ?? 0
      )

    const finalUnits =
      applyRewardProgressToUnits(
        battle.units,
        heroProgress
      )

    return {
      battleInstanceId: battle.id,
      locationId,
      encounterId: battleSetup.encounter.encounterId,
      encounterName: battleSetup.encounter.name,
      isScripted: battleSetup.encounter.isScripted,
      outcome,
      reward,
      heroProgress,
      finalUnits,
      conclusion:
        battleSetup.encounter.conclusion
    }
  }

  function handleBattleEnd(
    battle: BattleState
  ) {

    if (
      !canResolveEncounterOutcome(
        battle.winner,
        outcomeResolved.current
      )
    ) {
      return
    }

    outcomeResolved.current = true

    const result =
      buildBattleResult(battle)

    if (result.outcome !== "victory") {
      outcomeCommitted.current = true
      applyBattleResult(result)
      return
    }

    setResolutionPreview(result)
  }

  function handleResolutionContinue() {
    if (!resolutionPreview) return
    if (outcomeCommitted.current) return

    outcomeCommitted.current = true

    applyBattleResult(
      resolutionPreview
    )
    setResolutionPreview(null)
    navigate("/world")
  }

  return (

    <div className="battle-screen">

      <button
        className="RTWMButton"
        onClick={() => navigate("/world")}
      >
        Return to World Map
      </button>

      <BattleView
        units={battleSetup.units}
        relationships={relationships}
        backgroundId={locationId}
        openingDialogue={
          battleSetup.encounter.openingDialogue
        }
        inputLocked={Boolean(resolutionPreview)}
        onBattleEnd={handleBattleEnd}
      />

      {resolutionPreview && (
        <BattleResolutionModal
          result={resolutionPreview}
          onContinue={handleResolutionContinue}
        />
      )}

    </div>

  )

}