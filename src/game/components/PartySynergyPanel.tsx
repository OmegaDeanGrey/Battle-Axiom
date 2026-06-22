import type { Unit } from "../../battle/models/unit"
import { ComboRegistry } from "../data/ComboRegistry"
import {
  RelationshipRegistry
}
from "../../battle/relationships/relationshipRegistry"


type Props = {
  party: Unit[]
}


export default function PartySynergyPanel({
  party
}: Props) {


  if (party.length < 2) {
    return null
  }

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

  const unlockedCombos =
  ComboRegistry.filter(
    combo =>

      combo.members.every(
        member =>
          partyClasses.includes(member)
      )
  )

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
        Party Synergies
      </h2>
<h3>
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
}

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