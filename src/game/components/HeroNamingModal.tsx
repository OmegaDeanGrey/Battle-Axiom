type Props = {
  heroClass: string

  heroNameInput: string

  onNameChange: (
    value: string
  ) => void

  onConfirm: () => void

  onCancel: () => void
}


export default function HeroNamingModal({

  heroClass,

  heroNameInput,

  onNameChange,

  onConfirm,

  onCancel

}: Props) {

  return (

    <div className="modal-overlay">

      <div className="hero-naming-modal">

        <h2>
          Name Your {heroClass}
        </h2>

        <input

          type="text"

          value={heroNameInput}

          onChange={e =>
            onNameChange(
              e.target.value
            )
          }

        />

        <div
          style={{
            marginTop: 15
          }}
        >

          <button
            className="HNMButtons"
            onClick={onConfirm}
          >
            Confirm
          </button>

          <button
           className="HNMButtons"
            onClick={onCancel}
            style={{
              marginLeft: 10
            }}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  )

}