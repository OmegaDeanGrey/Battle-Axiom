import type { Unit } from "../models/unit"


type Props = {
  unit: Unit

  onTarget?: () => void

  children?: React.ReactNode
}


export default function UnitCard({
  unit,
  onTarget,
  children
}: Props) {


  return (

    <div

      onClick={onTarget}

      style={{

        marginBottom: 10,

        border:
          unit.team === "enemy"
            ? "1px solid red"
            : "1px solid white",

        padding: 10,

        cursor:
          onTarget
            ? "pointer"
            : "default"

      }}

    >

      <strong>
        {unit.name}
      </strong>

        <div>
        {unit.heroClass}
      </div>
      <div>
        HP: {unit.hp}/{unit.maxHp}
      </div>


      <div>
        Level: {unit.level}
      </div>


      <div>
        Attack: {unit.attack}
      </div>


      <div>
        Defense: {unit.defense}
      </div>


      <div>
        Speed: {unit.speed}
      </div>


      <div>
        Crit Chance:
        {" "}
        {Math.round(
          unit.critChance * 100
        )}%

      </div>


      <div>
        Timeline: {unit.timeline}
      </div>


      {children}


    </div>

  )

}