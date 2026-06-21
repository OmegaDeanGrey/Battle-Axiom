import type { Unit } from "../models/unit"


type Props = {
  actor: Unit

  selectedAbilityId: string | null

  onSelectAbility: (
    abilityId: string
  ) => void

  disabled?: boolean
}


export default function AbilityBar({
  actor,
  selectedAbilityId,
  onSelectAbility,
  disabled
}: Props) {


  return (

    <div style={{ marginTop: 20 }}>


      <h2>
        {actor.name}'s Turn
      </h2>


      {
        actor.abilities.map(
          ability => (

            <button

              key={ability.id}

              onClick={() =>
                onSelectAbility(
                  ability.id
                )
              }

              disabled={disabled}

              style={{

                marginRight: 10,

                padding: "8px 12px",

                border:
                  selectedAbilityId === ability.id
                    ? "2px solid yellow"
                    : undefined

              }}

            >

              {ability.name}

            </button>

          )
        )

      }


      {
        selectedAbilityId && (

          <div style={{ marginTop: 10 }}>

            Select an enemy target

          </div>

        )

      }


    </div>

  )
}