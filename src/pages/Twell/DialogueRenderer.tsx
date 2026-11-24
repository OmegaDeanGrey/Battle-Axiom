import DialogueBox from "../../game/components/DialogueBox"

interface DialogueConfig {
  index: number
  lines: { speaker: string; portrait: string; text: string }[]
  onContinue: () => void
}

interface Props {
  gateGuard: DialogueConfig
  innPatron1: DialogueConfig
  innPatron2: DialogueConfig
  innKeeper: DialogueConfig
  innMorning: DialogueConfig
  villager: DialogueConfig
  twellSisters: DialogueConfig
  sebastian: DialogueConfig
  cleo: DialogueConfig
  mayor: DialogueConfig
  windmillMiller: DialogueConfig
  windmillApprentice: DialogueConfig
  windmillTraveler: DialogueConfig
  story: DialogueConfig
}

function renderDialogue(config: DialogueConfig) {
  if (config.index < 0 || config.index >= config.lines.length) return null
  const line = config.lines[config.index]
  return (
    <DialogueBox
      speaker={line.speaker}
      portrait={line.portrait}
      text={line.text}
      onContinue={config.onContinue}
    />
  )
}

export default function DialogueRenderer(props: Props) {
  return (
    <>
      {renderDialogue(props.gateGuard)}
      {renderDialogue(props.innPatron1)}
      {renderDialogue(props.innPatron2)}
      {renderDialogue(props.innKeeper)}
      {renderDialogue(props.innMorning)}
      {renderDialogue(props.villager)}
      {renderDialogue(props.twellSisters)}
      {renderDialogue(props.sebastian)}
      {renderDialogue(props.cleo)}
      {renderDialogue(props.mayor)}
      {renderDialogue(props.windmillMiller)}
      {renderDialogue(props.windmillApprentice)}
      {renderDialogue(props.windmillTraveler)}
      {renderDialogue(props.story)}
    </>
  )
}
