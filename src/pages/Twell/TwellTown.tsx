import { useState, useRef } from "react"

import { useGame } from "../../game/context/GameContext"

import "./Twell.css"

type Location =
  | "weaponShop"
  | "itemShop"
  | "windmillRow"
  | "questBoard"
  | "mayor"
  | "homestead"
  | null


export default function TwellTown() {


    const audioRef =
      useRef<HTMLAudioElement>(null)
  
    const [playing, setPlaying] =
      useState(false)
  
  
    function toggleAudio() {
  
      const audio =
        audioRef.current
  
      if (!audio) {
        return
      }
  
  
      if (audio.paused) {
  
        audio.play()
  
        setPlaying(true)
  
      } else {
  
        audio.pause()
  
        setPlaying(false)
  
      }
  
    }
  const [activeLocation, setActiveLocation] =
    useState<Location>(null)


  const locationData = {

    weaponShop: {
      title: "Weapon Shop",
      background: "/WeaponShopInterior.png"
    },

    itemShop: {
      title: "Item Shop",
      background: "/ItemShopInterior.png"
    },

    windmillRow: {
      title: "Windmill Row",
      background: "/WindmillRow.png"
    },

    questBoard: {
      title: "Quest Board",
      background: "/QuestBoard.png"
    },

    mayor: {
      title: "Mayor's Office",
      background: "/MayorOffice.png"
    },

    homestead: {
      title: "Homestead",
      background: "/Homestead.png"
    }

  }
const {

  itemShopUnlocked,

  mayorUnlocked,

  setItemShopUnlocked,

  setMayorUnlocked,

  questBoardUnlocked,

} = useGame()

  return (

    <div id="Twell">

        <audio
        ref={audioRef}
        loop
        autoPlay
   
      >

        <source
          src="/Roukus.mp3"
          type="audio/mpeg"
        />

        Your browser does not support audio.

      </audio>
 
{
  questBoardUnlocked && (

    <button
      className="twell-button"
      id="windmill-row"
      onClick={() =>
        setActiveLocation(
          "windmillRow"
        )
      }
    >
      Windmill Row
    </button>

  )
}
      {
  mayorUnlocked && (
            <button
        className="twell-button"
        id="mayor"
        onClick={() =>
          setActiveLocation(
            "mayor"
          )
       
        }
      >
        Mayor
      </button>
      
      )
       }
{
  mayorUnlocked && (

    <button
      className="twell-button"
      id="quest-board"
      onClick={() =>
        setActiveLocation(
          "questBoard"
        )
      }
    >
      Quest Board
    </button>

  )
}
      <button
        className="twell-button"
        id="homestead"
        onClick={() =>
          setActiveLocation(
            "homestead"
          )
        }
      >
        Homestead
      </button>
      {
  itemShopUnlocked && (

            <button
        className="twell-button"
        id="item-shop"
        onClick={() =>
          setActiveLocation(
            "itemShop"
          )
        }
      >
        Item Shop
      </button>
  )}

{
  mayorUnlocked && (

           <button
        className="twell-button"
        id="weapon-shop"
        onClick={() =>
          setActiveLocation(
            "weaponShop"
          )
        }
      >
        Weapon Shop
      </button>
  )}
      {

        activeLocation && (

          <div
            className="modal-overlay"
          >

            <div

              className="town-modal"

              style={{

                backgroundImage:

                  `url(${
                    locationData[
                      activeLocation
                    ].background
                  })`

              }}

            >

              <button

                className="close-button"

                onClick={() =>
                  setActiveLocation(
                    null
                  )
                }

              >

                X

              </button>

              <h1>

                {
                  locationData[
                    activeLocation
                  ].title
                }

              </h1>


              {

                activeLocation ===
                "weaponShop" && (

                  <div>

                    Weapon inventory goes here

                  </div>

                )

              }


              {

                activeLocation ===
                "itemShop" && (

                  <div>

                    Consumables go here

                  </div>

                )

              }


              {

                activeLocation ===
                "windmillRow" && (

                  <div>

                    Town residents go here

                  </div>

                )

              }


              {

                activeLocation ===
                "questBoard" && (

                  <div>

                    Available quests go here

                  </div>

                )

              }


              {

                activeLocation ===
                "mayor" && (

                  <div>

                    Story dialogue goes here

                  </div>

                )

              }


              {

                activeLocation ===
                "homestead" && (

                  <div>

                       <p>
      Your family welcomes you home.
    </p>


    <button

      onClick={() => {

        setItemShopUnlocked(true)

        setMayorUnlocked(true)

      }}

    >

      Continue Story

    </button>

                  </div>

                )

              }

            </div>

          </div>

        )

      }

    </div>

  )

}