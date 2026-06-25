import type { Unit } from "../../battle/models/unit"
// import { ComboRegistry } from "../data/ComboRegistry"
import {
  RelationshipRegistry
}
from "../../battle/relationships/relationshipRegistry"
import {
 getActiveSynergies
}
from "../../battle/synergy/getActiveSynergies"
import {
  getTagEffects
}
from "../../battle/tagEffects/getTagEffects"


type Props = {
  party: Unit[]
}


export default function PartySynergyPanel({
  party
}: Props) {


  if (party.length < 2) {
    return null
  }

  const activeSynergies =
  getActiveSynergies(party)

  const partyEffects =
  party.flatMap(hero =>
    getTagEffects(hero)
  )

  const partyClasses =
  party.map(
    hero => hero.heroClass
  )

  const activeRelationships =
  RelationshipRegistry.filter(
    rel =>

      rel.members.every(
        member =>
          partyClasses.includes(member)
      )
  )

  // const unlockedCombos =
  // ComboRegistry.filter(
  //   combo =>

  //     combo.members.every(
  //       member =>
  //         partyClasses.includes(member)
  //     )
  // )

  const tagCounts: Record<string, number> = {}


  party.forEach(hero => {

    hero.tags.forEach(tag => {

      tagCounts[tag] =
        (tagCounts[tag] || 0) + 1

    })

  })


  return (

    <div className="party-synergy-panel">

     <h2>
  Active Synergies
</h2>


{
 activeSynergies.length === 0 && (

   <p>
     No active synergies
   </p>

 )
}



{
 activeSynergies.map(
  synergy => (

    <div
      key={synergy.id}
    >

      <h3>
        {synergy.name}
      </h3>


      <p>
        {synergy.description}
      </p>


    </div>

  )
 )
}
{/* 
<h2>
  Party Traits
</h2>


{
  partyEffects.length === 0 && (

    <p>
      No special traits
    </p>

  )
}

*/}

{
 partyEffects.map(effect => (

  <div
    key={effect.tag}
  >

    <h3>
      {effect.name}
    </h3>


    <p>
      {effect.description}
    </p>


  </div>

 ))
} 
{/* <h3>
  Combo Attacks
</h3>

{
  unlockedCombos.map(
    combo => (

      <div
        key={combo.id}
      >

        <strong>
          {combo.name}
        </strong>

      </div>

    )
  )
} */}

<h3>
  Relationships
</h3>

{
  activeRelationships.map(
    rel => (

      <div
        key={rel.id}
      >

        <strong>
          {rel.name}
        </strong>

      </div>

    )
  )
}
      {
        Object.entries(tagCounts)
          .map(([tag, count]) => (

            <div key={tag}>

              {tag}
              {" x"}
              {count}

            </div>

          ))
      }


    </div>

  )

}