import "./DialogueBox.css"

type Props = {

  speaker: string

  text: string

  portrait?: string

  onContinue: () => void

}


export default function DialogueBox({

  speaker,

  text,

  portrait,

  onContinue

}: Props) {

  return (

   <div className="dialogue-box">

  <div className="dialogue-portrait">

    {

      portrait && (

        <img

          src={portrait}

          alt={speaker}

        />

      )

    }

  </div>


  <div className="dialogue-content">

    <div className="dialogue-speaker">

      {speaker}

    </div>

    <div className="dialogue-text">

      {text}

    </div>

    <button

      className="dialogue-button"

      onClick={onContinue}

    >

      Continue

    </button>

  </div>

</div>

  )

}