import {
  useRef,
  useState
} from "react"

import "../pages/WorldMap.css"

import { useNavigate }
from "react-router-dom"

import { useGame }
from "../game/context/GameContext"

export default function WorldMap() {

  const navigate =
    useNavigate()

  const { townOutskirtsUnlocked } = useGame()

  const audioRef =
    useRef<HTMLAudioElement>(null)

  const [playing, setPlaying] =
    useState(false)


  function handleTwellOutskirtsEnter() {
    navigate("/battle/twell-outskirts")
  }

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


  return (

    <div id="worldmap">
      <div className="mist-overlay" />

      <audio
        ref={audioRef}
        loop
        autoPlay
   
      >

        <source
          src="/JourneyAlone.mp3"
          type="audio/mpeg"
        />

        Your browser does not support audio.

      </audio>



      <div className="player-container">

 

      </div>


{/* 
      <h1>
        World Map
      </h1> */}
      <button
        id="Secret"
        className="WMButtons"
        onClick={() =>
          navigate("/twell")
        }
      >
     
      </button>
      <button
        id="TwellButton"
        className="WMButtons"
        onClick={() =>
          navigate("/twell")
        }
      >
       Twell
      </button>

      {townOutskirtsUnlocked && (
        <button
          id="TwellOutskirtsButton"
          className="WMButtons"
          onClick={handleTwellOutskirtsEnter}
        >
          Twell Outskirts
        </button>
      )}

      {/*
      <button

        onClick={() =>
          navigate("/battle")
        }

      >

        Forest Battle

      </button>
      */}
       <button

          onClick={toggleAudio}
          id="playbutton"
          className={
            playing
              ? "play-btn playing"
              : "play-btn"
          }

        >

          {
            playing
              ? "| |"
              : "Play"
          }

        </button>
    </div>

  )

}
