import type {
  EnvironmentalObjectDefinition
} from "../../game/data/EnvironmentalObjectRegistry"

import "./EnvironmentalExaminationModal.css"

type Props = {
  object: EnvironmentalObjectDefinition
  firstTime: boolean
  onClose: () => void
}

export default function EnvironmentalExaminationModal({
  object,
  firstTime,
  onClose
}: Props) {
  const description =
    firstTime && object.firstTimeDescription
      ? object.firstTimeDescription
      : object.description

  return (
    <div
      className="environmental-examination-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="environmental-examination-modal"
        role="dialog"
        aria-modal="true"
        aria-label={object.name}
        onClick={event =>
          event.stopPropagation()
        }
      >
        <button
          className="environmental-examination-close"
          onClick={onClose}
          aria-label="Close examination"
        >
          X
        </button>

        <div className="environmental-examination-ornament">
          ✦
        </div>

        <h2>{object.name}</h2>

        {firstTime && (
          <p className="environmental-examination-first">
            First observation
          </p>
        )}

        <p className="environmental-examination-text">
          {description}
        </p>

        <button
          className="environmental-examination-continue"
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
