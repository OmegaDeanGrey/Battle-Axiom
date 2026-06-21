import { useState } from "react"

import { useBattle } from "../hooks/useBattle"

import type { Unit } from "../models/unit"

import UnitCard from "./UnitCard"
import AbilityBar from "./AbilityBar"
import BattleLog from "./BattleLog"

import { unlockSkill } from "../progression/unlockSkill"


type Props = {
  units: Unit[]
}


export default function BattleView({
  units
}: Props) {


  const { battle, tick, act } =
    useBattle(units)


  const [
    selectedAbilityId,
    setSelectedAbilityId
  ] = useState<string | null>(null)


  const currentActor =
    battle.units.find(
      u =>
        u.id === battle.currentActorId
    )


  const playerUnits =
    battle.units.filter(
      u =>
        u.team === "player"
    )


  const enemyUnits =
    battle.units.filter(
      u =>
        u.team === "enemy"
    )


  return (

    <div style={{ padding: 20 }}>


      <h1>
        Battle System
      </h1>


      {battle.winner && (

        <h2>

          {
            battle.winner === "player"
              ? "Victory!"
              : "Defeat!"
          }

        </h2>

      )}



      <button

        onClick={tick}

        disabled={
          !!battle.winner
        }

      >

        Next Tick

      </button>



      <div style={{ marginTop: 10 }}>

        Current Actor:{" "}

        {
          currentActor?.name ||
          "None"
        }

      </div>



      <h2>
        Relationships
      </h2>


      {
        battle.relationships.map(rel => (

          <div

            key={rel.id}

            style={{
              marginBottom: 10
            }}

          >

            {rel.name}

            {" - Level "}

            {rel.level}

          </div>

        ))

      }




      {
        currentActor?.team === "player" && (

          <AbilityBar

            actor={currentActor}

            selectedAbilityId={
              selectedAbilityId
            }

            onSelectAbility={
              setSelectedAbilityId
            }

            disabled={
              !!battle.winner
            }

          />

        )
      }





      <h2>
        Your Party
      </h2>


      {
        playerUnits.map(u => (

          <UnitCard

            key={u.id}

            unit={u}

          >

            {
              u.skillTree.map(node => (

                <button

                  key={node.id}

                  onClick={() =>
                    unlockSkill(
                      u,
                      node.id
                    )
                  }

                  disabled={
                    u.skillPoints < node.cost ||
                    node.unlocked
                  }

                >

                  {node.name}

                </button>

              ))

            }


          </UnitCard>

        ))

      }





      <h2>
        Enemies
      </h2>


      {
        enemyUnits.map(u => (

          <UnitCard

            key={u.id}

            unit={u}

            onTarget={() => {

              if (
                !selectedAbilityId ||
                !currentActor
              ) {
                return
              }


              act(
                selectedAbilityId,
                u.id
              )


              setSelectedAbilityId(null)

            }}

          />

        ))

      }





      <BattleLog

        logs={battle.log}

      />


    </div>

  )
}