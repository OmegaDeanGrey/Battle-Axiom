import { useState } from "react"
import PartyScreenModal from "./PartyScreenModal"
import "./GlobalPartyButton.css"

export default function GlobalPartyButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="global-party-button"
        onClick={() => setOpen(true)}
        aria-label="Open party screen"
      >
        <span className="global-party-button-icon">⚔</span>
        <span className="global-party-button-label">Party</span>
      </button>
      {open && <PartyScreenModal onClose={() => setOpen(false)} />}
    </>
  )
}
