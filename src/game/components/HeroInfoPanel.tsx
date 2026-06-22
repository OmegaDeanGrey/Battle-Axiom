import type { Unit } from "../../battle/models/unit"


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


  return (

    <div className="hero-info-panel">

      <h2>
        {hero.name}
      </h2>


      <img

        src={hero.portrait}
        width={160}
        height={170}
        id="heroportrait"
      />
    <div>
        Class: {hero.heroClass}
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