import type { Unit } from "../../battle/models/unit"

import {
  getTagEffects
}
from "../../battle/tagEffects/getTagEffects"


type Props = {
  hero: Unit | null

  onAddToParty: () => void

  partyFull: boolean
}


export default function HeroInfoPanel({
  hero,
  onAddToParty,
  partyFull
}: Props){


  if (!hero) {
    return null
  }

  const tagEffects =
  getTagEffects(hero)

  return (

    <div className="hero-info-panel">

      <h2>
        {hero.name}
      </h2>


      {/* <img

        src={hero.portrait}
        width={60}
        height={70}
        id="heroportrait"
      /> */}
    {/* <div>
        Class: {hero.heroClass}
    </div> */}
    <div className="hero-description">

  {hero.description}

    </div>
     <div>
        HP: {hero.hp}
   </div>
    <div>
        Attack: {hero.attack}
    </div>
     <div>
        Defense: {hero.defense}
    </div>
     <div>
        Speed: {hero.speed}
    </div>
        Tags:
        {" "}
        {hero.tags.join(", ")}
      <h3>
  Traits
</h3>


{
  tagEffects.length === 0 && (

    <p>
      No special traits
    </p>

  )
}



{
  tagEffects.map(effect => (

    <div
      key={effect.tag}
    >

      <strong>
        {effect.name}
      </strong>

      <p>
        {effect.description}
      </p>

    </div>

  ))
}

{
  !partyFull && (

    <button
      onClick={onAddToParty}
      id="ATPheropanel"
    >
      Add To Party
    </button>

  )
}
    </div>

  )

}