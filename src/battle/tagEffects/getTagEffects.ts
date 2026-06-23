import type { Unit }
from "../models/unit"

import {
  TagEffectRegistry
}
from "./tagEffectRegistry"


export function getTagEffects(
  unit: Unit
) {


  return TagEffectRegistry.filter(
    effect =>

      unit.tags.includes(
        effect.tag
      )

  )


}