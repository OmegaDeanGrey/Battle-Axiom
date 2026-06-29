import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useGame } from "../../game/context/GameContext"

import DialogueBox
from "../../game/components/DialogueBox"

import {
  gateGuardDialogue
}
from "../../game/dialogue/twell/gateGuard"


import {
  innDialogue
}
from "../../game/dialogue/twell/innKeeper"

import {
  innPatron1Dialogue
}
from "../../game/dialogue/twell/innPatron1"

import {
  innPatron2Dialogue
}
from "../../game/dialogue/twell/innPatron2"

import {
  villagerDialogue
}
from "../../game/dialogue/twell/villager"

import "./Twell.css"


type Location =
  | "weaponShop"
  | "itemShop"
  | "windmillRow"
  | "questBoard"
  | "mayor"
  | "inn"
  | null



export default function TwellTown() {


const navigate = useNavigate()

const [
  gateDialogueIndex,
  setGateDialogueIndex
] = useState(0)

const [
  innPatron1DialogueIndex,
  setInnPatron1DialogueIndex
] = useState(-1)

const [
  innPatron2DialogueIndex,
  setInnPatron2DialogueIndex
] = useState(-1)

const [
  innDialogueIndex,
  setInnDialogueIndex
] = useState(-1)

const [
  villagerDialogueIndex,
  setVillagerDialogueIndex
] = useState(-1)

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
  if(audio.paused) {
    audio.play()
    setPlaying(true)
  }
  else {
    audio.pause()
    setPlaying(false)
  }
}

const [activeLocation, setActiveLocation] =
useState<Location>(null)

const locationData = {


weaponShop: {
title: "Weapon Shop",
background:
"/WeaponShopInterior.png"
},

itemShop: {
title: "Item Shop",
background:
"/ItemShopInterior.png"
},

windmillRow: {
title: "Windmill Row",
background:
"/WindmillRow.png"
},

questBoard: {
title: "Quest Board",
background:
"/QuestBoard.png"
},


mayor: {
title: "Mayor's Office",
background:
"/MayorOffice.png"
},

inn: {
title: "Inn",
background:
"/TwellInn.png"
}

}


const {
itemShopUnlocked,
mayorUnlocked,
questBoardUnlocked,
setItemShopUnlocked,
setMayorUnlocked,
sleepingQuartersUnlocked,
setSleepingQuartersUnlocked
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

</audio>
  <img
    src="/Birds.png"
    className="birds"
    alt=""
  />

  <div className="waterfall">

  <video
    autoPlay
    loop
    muted
    playsInline
  >

    <source
      src="/WaterFall.mp4"
      type="video/mp4"
    />

  </video>

</div>
  <div className="fountain">

  <video
    autoPlay
    loop
    muted
    playsInline
  >

    <source
      src="/WaterFall.mp4"
      type="video/mp4"
    />

  </video>

</div>
  <div className="fountain2">

  <video
    autoPlay
    loop
    muted
    playsInline
  >

    <source
      src="/WaterFall.mp4"
      type="video/mp4"
    />

  </video>

</div>
<div className="windmill1">
    <img
        src="/WindmillBlades.png"
        className="windmill-blades"
    />
</div>
<div className="windmill2">
    <img
        src="/WindmillBlades.png"
        className="windmill-blades"
    />
</div>

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
id="inn"
onClick={() =>
setActiveLocation(
"inn"
)
}
>
Inn
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
)
}


<button
  id="villager1"
  className="npc-marker"
  onClick={() => {
    setVillagerDialogueIndex(0)
  }}
>
▼
</button>

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
)
}


<button
className="twell-button"
id="exittwellbutton"
onClick={() =>
navigate("/world")
}
>
Exit Town
</button>
       <button

          onClick={toggleAudio}
          id="playbuttontwell"
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


{
activeLocation && (
<div className="modal-overlay">

<div
  className="town-modal"
  style={
    activeLocation === "inn"
      ? {}
      : {
          backgroundImage:
            `url(${
              locationData[
                activeLocation
              ].background
            })`
        }
  }
>



<h1>
{
locationData[
activeLocation
].title
}
</h1>


{
activeLocation === "inn" && (

<div

  id="twellinn"

  style={{
    backgroundImage: "url('/TwellInn.png')"
  }}

>
  <button
className="close-button"
onClick={() =>
setActiveLocation(null)
}
>
X
</button>
    <video
    className="fire-video"
    autoPlay
    loop
    muted
    playsInline
  >
    <source
      src="/fire.mp4"
      type="video/mp4"
    />
  </video>
  <div className="candle candle1">
    <div className="flame"></div>
    <div className="glow"></div>
</div>
<div className="candle candle2">
    <div className="flame"></div>
    <div className="glow"></div>
</div>
<div className="candle candle3">
    <div className="flame"></div>
    <div className="glow"></div>
</div>
<div className="candle candle4">
    <div className="flame"></div>
    <div className="glow"></div>
</div>
<div className="candle candle5">
    <div className="flame"></div>
    <div className="glow"></div>
</div>
<div className="candle candle6">
    <div className="flame"></div>
    <div className="glow"></div>
</div>
<button
  id="innpatron1"
  className="npc-marker"
  onClick={() => {
    setInnPatron1DialogueIndex(0)
  }}
>
▼
</button>
<button
  id="innpatron2"
  className="npc-marker"
  onClick={() => {
    setInnPatron2DialogueIndex(0)
  }}
>
▼
</button>

<button
className="speaktoinnkeeper"
onClick={() =>
setInnDialogueIndex(0)
}
>

Speak With InnKeeper

</button>
{
  sleepingQuartersUnlocked && (

    <button
      className="speaktoinnkeeper"
      id="sleepingquarters"

      onClick={() => {

        console.log("Sleeping Quarters")

      }}

    >

      Sleeping Quarters

    </button>

  )
}

</div>

)
}

{
activeLocation === "weaponShop" && (
<div>
Weapon inventory goes here
</div>
)
}

{
activeLocation === "itemShop" && (
<div>
Consumables go here
</div>
)
}

{
activeLocation === "windmillRow" && (
<div>
Town residents go here
</div>
)
}

{
activeLocation === "questBoard" && (
<div>
Available quests go here
</div>
)
}

{
activeLocation === "mayor" && (
<div>
Story dialogue goes here
</div>
)
}
</div>

</div>
)
}

{
gateDialogueIndex <
gateGuardDialogue.length && (
<DialogueBox
speaker={
gateGuardDialogue[
gateDialogueIndex
].speaker
}
portrait={
gateGuardDialogue[
gateDialogueIndex
].portrait
}
text={
gateGuardDialogue[
gateDialogueIndex
].text
}
onContinue={() => {
const next =
gateDialogueIndex + 1
if(
next >= gateGuardDialogue.length
){
setGateDialogueIndex(
gateGuardDialogue.length
)
}
else {
setGateDialogueIndex(next)
}
}}
/>
)
}

{
innPatron1DialogueIndex >= 0 &&
innPatron1DialogueIndex < innPatron1Dialogue.length && (
<DialogueBox
speaker={
innPatron1Dialogue[
innPatron1DialogueIndex
].speaker
}
portrait={
innPatron1Dialogue[
innPatron1DialogueIndex
].portrait
}
text={
innPatron1Dialogue[
innPatron1DialogueIndex
].text
}
onContinue={() => {
const next =
innPatron1DialogueIndex + 1
if(
next >= innPatron1Dialogue.length
){
setInnPatron1DialogueIndex(
innPatron1Dialogue.length
)
}
else {
setInnPatron1DialogueIndex(next)
}
}}
/>
)
}

{
innPatron2DialogueIndex >= 0 &&
innPatron2DialogueIndex < innPatron2Dialogue.length && (
<DialogueBox
speaker={
innPatron2Dialogue[
innPatron2DialogueIndex
].speaker
}
portrait={
innPatron2Dialogue[
innPatron2DialogueIndex
].portrait
}
text={
innPatron2Dialogue[
innPatron2DialogueIndex
].text
}
onContinue={() => {
const next =
innPatron2DialogueIndex + 1
if(
next >= innPatron2Dialogue.length
){
setInnPatron2DialogueIndex(
innPatron2Dialogue.length
)
}
else {
setInnPatron2DialogueIndex(next)
}
}}
/>
)
}



{

innDialogueIndex >= 0 &&

innDialogueIndex <

innDialogue.length && (


<DialogueBox


speaker={

innDialogue[

innDialogueIndex

].speaker

}



portrait={

innDialogue[

innDialogueIndex

].portrait

}



text={

innDialogue[

innDialogueIndex

].text

}



onContinue={() => {


const next =
innDialogueIndex + 1



if(

next >= innDialogue.length

){


// setMayorUnlocked(true)

// setItemShopUnlocked(true)

setSleepingQuartersUnlocked(true)

setInnDialogueIndex(-1)


}

else {


setInnDialogueIndex(next)


}



}}


/>

)

}
{
  villagerDialogueIndex >= 0 &&
  villagerDialogueIndex < villagerDialogue.length && (

    <DialogueBox

      speaker={
        villagerDialogue[
          villagerDialogueIndex
        ].speaker
      }

      portrait={
        villagerDialogue[
          villagerDialogueIndex
        ].portrait
      }

      text={
        villagerDialogue[
          villagerDialogueIndex
        ].text
      }

      onContinue={() => {

        const next =
          villagerDialogueIndex + 1

        if (
          next >= villagerDialogue.length
        ) {

          setVillagerDialogueIndex(-1)

        } else {

          setVillagerDialogueIndex(next)

        }

      }}

    />

  )
}


</div>


)


}