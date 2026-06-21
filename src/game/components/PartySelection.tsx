import { useState } from "react"
import type { Unit } from "../../battle/models/unit"

import { HeroRoster } from "../roster/heroRoster"

import "./PartySelection.css"

type Props = {
  onStartBattle: (
    party: Unit[]
  ) => void
}

export default function PartySelection({
  onStartBattle
}: Props) {

  const [selectedHeroes, setSelectedHeroes] =
    useState<Unit[]>([])

  function toggleHero(
    createHero: () => Unit
  ) {

    const preview = createHero()

    // const alreadySelected =
    //   selectedHeroes.some(
    //     hero =>
    //       hero.name === preview.name
    //   )

    // if (alreadySelected) {

    //   setSelectedHeroes(
    //     selectedHeroes.filter(
    //       hero =>
    //         hero.name !== preview.name
    //     )
    //   )

    //   return
    // }

    if (selectedHeroes.length >= 3) {
      return
    }

    setSelectedHeroes([
      ...selectedHeroes,
      preview
    ])
  }

  function removeHero(
  heroId: string
) {

  setSelectedHeroes(
    selectedHeroes.filter(
      hero => hero.id !== heroId
    )
  )

}

  return (

    <div
      style={{ padding: 20 }}
      id="partyselectscreen"
    >

      <h1>
        Choose Your Party
      </h1>

      <h2>
        Available Heroes
      </h2>

      <div>

        {
          HeroRoster.map(
            createHero => {

              const preview =
                createHero()

              const selected =
                selectedHeroes.some(
                  hero =>
                    hero.name === preview.name
                )

              return (

                <button

                  key={preview.name}

                  onClick={() =>
                    toggleHero(createHero)
                  }

                  className="partybuttons"

                  style={{

                    backgroundImage:
                      `url(${preview.portrait})`,

                    backgroundSize:
                      "cover",

                    backgroundPosition:
                      "center",

                    backgroundRepeat:
                      "no-repeat",

                    border:
                      selected
                        ? "4px solid blue"
                        : "2px solid darkblue"

                  }}

                >

                  <div className="hero-name">

                    {preview.name}

                  </div>

                </button>

              )

            }
          )
        }

      </div>

      <h2>
        Selected Party
      </h2>

{
  selectedHeroes.map(
    hero => (

      <div

        key={hero.id}

        onClick={() =>
          removeHero(hero.id)
        }

        style={{
          cursor: "pointer",
          marginBottom: 5
        }}

      >

        {hero.name}

        {" - "}

        {hero.tags.join(", ")}

      </div>

    )
  )
}

      <button

        disabled={
          selectedHeroes.length !== 3
        }

        onClick={() =>
          onStartBattle(
            selectedHeroes
          )
        }

        style={{
          marginTop: 20,
          padding: 12
        }}

      >

        Start Battle

      </button>

    </div>

  )
}