import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Unit } from "../../battle/models/unit"

import HeroInfoPanel
from "./HeroInfoPanel"

import PartySynergyPanel
from "./PartySynergyPanel"

import HeroNamingModal
from "./HeroNamingModal"

import { HeroRoster } from "../roster/heroRoster"

import { useGame } 
from "../context/GameContext"

import "./PartySelection.css"



export default function PartySelection() {


  const navigate = useNavigate()


  const {
    setParty
  } = useGame()



  const [heroNameInput, setHeroNameInput] =
    useState("")


  const [pendingHero, setPendingHero] =
    useState<Unit | null>(null)


  const [heroToRemove, setHeroToRemove] =
    useState<Unit | null>(null)


  const [showNameModal, setShowNameModal] =
    useState(false)


  const [selectedHeroes, setSelectedHeroes] =
    useState<Unit[]>([])


  const [previewHero, setPreviewHero] =
    useState<Unit | null>(null)



  function removeHero(heroId: string) {


    setSelectedHeroes(
      selectedHeroes.filter(
        hero =>
          hero.id !== heroId
      )
    )


    if (
      previewHero?.id === heroId
    ) {

      setPreviewHero(null)

    }

  }




  return (

    <div

      style={{
        padding: 30
      }}

      id="partyselectscreen"

    >


      <h1>
        Choose 3 Heroes
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


            const selectedCount =
              selectedHeroes.filter(
                hero =>
                  hero.heroClass === preview.heroClass
              ).length



            return (

              <button


                key={preview.name}


                onClick={() => {

                  const hero =
                    createHero()

                  setPreviewHero(hero)

                }}


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

                    selectedCount === 3

                      ? "8px solid gold"

                    : selectedCount === 2

                      ? "6px solid yellow"

                    : selectedCount === 1

                      ? "4px solid white"

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



      <div id="selectedheroes">


      {
        selectedHeroes.map(

          hero => (

            <div


              key={hero.id}


              onClick={() =>
                setHeroToRemove(hero)
              }


              className="partybuttons"


              style={{


                backgroundImage:
                  `url(${hero.portrait})`,


                backgroundSize:
                  "cover",


                backgroundPosition:
                  "center",


                backgroundRepeat:
                  "no-repeat",


                border:
                  "2px solid darkblue",


                color:
                  "white"


              }}


            >

              {hero.name}


            </div>

          )

        )

      }


      </div>





      <button


        disabled={
          selectedHeroes.length !== 3
        }


        onClick={() => {


          setParty(
            selectedHeroes
          )


          navigate("/world")


        }}


        className="buttons"


        style={{


          fontSize:
            "40px",


          marginTop:
            20,


          padding:
            22,


          borderRadius:
            20,


          color:

            selectedHeroes.length === 3

              ? "yellow"

              : "white"


        }}


      >

        Begin


      </button>





      <HeroInfoPanel


        hero={previewHero}


        partyFull={
          selectedHeroes.length >= 3
        }


        onAddToParty={() => {


          if (!previewHero) {
            return
          }


          if (
            selectedHeroes.length >= 3
          ) {

            return

          }



          setPendingHero(
            previewHero
          )


          setHeroNameInput(
            previewHero.heroClass
          )


          setShowNameModal(true)


        }}


      />





      <PartySynergyPanel

        party={
          selectedHeroes
        }

      />






      {
        showNameModal &&
        pendingHero && (


          <HeroNamingModal


            heroClass={
              pendingHero.heroClass
            }


            heroNameInput={
              heroNameInput
            }


            onNameChange={
              setHeroNameInput
            }



            onConfirm={() => {


              if (!pendingHero) {
                return
              }



              const namedHero = {


                ...pendingHero,


                name:

                  heroNameInput.trim()

                    ||

                  pendingHero.heroClass


              }



              setSelectedHeroes([

                ...selectedHeroes,


                {

                  ...namedHero,

                  id:
                    crypto.randomUUID()

                }


              ])



              setShowNameModal(false)

              setPendingHero(null)

              setHeroNameInput("")


            }}



            onCancel={() => {


              setShowNameModal(false)


              setPendingHero(null)


            }}


          />


        )

      }






      {

        heroToRemove && (


          <div className="modal-overlay">


            <div className="hero-naming-modal">


              <h2>

                Remove {heroToRemove.name}?

              </h2>



              <button

                onClick={() => {


                  removeHero(
                    heroToRemove.id
                  )


                  setHeroToRemove(null)


                }}

              >

                Remove

              </button>




              <button

                onClick={() =>
                  setHeroToRemove(null)
                }

              >

                Cancel

              </button>



            </div>


          </div>


        )

      }




    </div>

  )

}