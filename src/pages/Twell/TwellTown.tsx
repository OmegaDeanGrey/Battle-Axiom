import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useGame } from "../../game/context/GameContext"

import DialogueBox
from "../../game/components/DialogueBox"

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


const navigate = useNavigate()



const [
  gateDialogueIndex,
  setGateDialogueIndex
] = useState(0)



const [
  homesteadDialogueIndex,
  setHomesteadDialogueIndex
] = useState(-1)

const [
  villagerDialogueIndex,
  setVillagerDialogueIndex
] = useState(-1)

const gateGuardDialogue = [

  {
    speaker: "Gate Guard",

    portrait:
      "/portraits/GateGuard.png",

    text:
      "Halt!... Ah, it's you. Welcome back to Twell."

  },

  {
    speaker: "Gate Guard",

    portrait:
      "/portraits/GateGuard.png",

    text:
      "Strange rumors have been spreading beyond the fields."

  },

  {
    speaker: "Gate Guard",

    portrait:
      "/portraits/GateGuard.png",

    text:
      "Your family will want to see you first."

  },

  {
    speaker: "Gate Guard",

    portrait:
      "/portraits/GateGuard.png",

    text:
      "Head to your homestead. The mayor can wait."

  }

]



const homesteadDialogue = [

  {
    speaker: "Grandmother",

    portrait:
      "/portraits/Grandmother.png",

    text:
      "Welcome home, travelers."

  },

  {
    speaker: "Grandmother",

    portrait:
      "/portraits/Grandmother.png",

    text:
      "Twell has been peaceful for many years."

  },

  {
    speaker: "Grandmother",

    portrait:
      "/portraits/Grandmother.png",

    text:
      "But strange events have begun to trouble the outskirts."

  },

  {
    speaker: "Grandmother",

    portrait:
      "/portraits/Grandmother.png",

    text:
      "The mayor wishes to meet your fellowship."

  }

]

const villagerDialogue = [

  {
    speaker: "Villager",

    portrait: "/portraits/Villager1.png",

    text:
      "Have you heard? Strange lights have been seen beyond the windmills."
  },

  {
    speaker: "Villager",

    portrait: "/portraits/Villager1.png",

    text:
      "Some say they're spirits. Others think they're soldiers."
  },

  {
    speaker: "Villager",

    portrait: "/portraits/Villager1.png",

    text:
      "Whatever they are... I don't think they're here by accident."
  }

]


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


homestead: {

title: "Homestead",

background:
"/Homestead.png"

}


}



const {

itemShopUnlocked,

mayorUnlocked,

questBoardUnlocked,

setItemShopUnlocked,

setMayorUnlocked


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
navigate(-1)
}

>

Exit Town

</button>







{

activeLocation && (

<div className="modal-overlay">


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
setActiveLocation(null)
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

activeLocation === "homestead" && (

<div>

<button

onClick={() =>
setHomesteadDialogueIndex(0)
}

>

Speak With Grandmother

</button>


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

homesteadDialogueIndex >= 0 &&

homesteadDialogueIndex <

homesteadDialogue.length && (


<DialogueBox


speaker={

homesteadDialogue[

homesteadDialogueIndex

].speaker

}



portrait={

homesteadDialogue[

homesteadDialogueIndex

].portrait

}



text={

homesteadDialogue[

homesteadDialogueIndex

].text

}



onContinue={() => {


const next =
homesteadDialogueIndex + 1



if(

next >= homesteadDialogue.length

){


setMayorUnlocked(true)

setItemShopUnlocked(true)

setHomesteadDialogueIndex(-1)


}

else {


setHomesteadDialogueIndex(next)


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