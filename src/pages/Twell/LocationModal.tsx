export type Location =
  | "weaponShop"
  | "itemShop"
  | "windmillRow"
  | "questBoard"
  | "mayor"
  | "inn"
  | null

interface Props {
  activeLocation: Location
  onClose: () => void
  onInnPatron1Click: () => void
  onInnPatron2Click: () => void
  onInnKeeperClick: () => void
  onSleep: () => void
  sleepingQuartersUnlocked: boolean
}

const locationData: Record<
  Exclude<Location, null>,
  { title: string; background: string }
> = {
  weaponShop: {
    title: "Weapon Shop",
    background: "/WeaponShopInterior.png",
  },
  itemShop: {
    title: "Item Shop",
    background: "/ItemShopInterior.png",
  },
  windmillRow: {
    title: "Windmill Row",
    background: "/WindmillRow.png",
  },
  questBoard: {
    title: "Quest Board",
    background: "/QuestBoard.png",
  },
  mayor: {
    title: "Mayor's Office",
    background: "/MayorOffice.png",
  },
  inn: {
    title: "Inn",
    background: "/TwellInn.png",
  },
}

export default function LocationModal({
  activeLocation,
  onClose,
  onInnPatron1Click,
  onInnPatron2Click,
  onInnKeeperClick,
  onSleep,
  sleepingQuartersUnlocked,
}: Props) {
  if (!activeLocation) return null

  const data = locationData[activeLocation]

  return (
    <div className="modal-overlay">
      <div
        className="town-modal"
        style={
          activeLocation === "inn"
            ? {}
            : { backgroundImage: `url(${data.background})` }
        }
      >
        <h1>{data.title}</h1>

        {activeLocation === "inn" && (
          <div
            id="twellinn"
            style={{
              backgroundImage: "url('/TwellInn.png')",
            }}
          >
            <button className="close-button" onClick={onClose}>
              X
            </button>

            <video className="fire-video" autoPlay loop muted playsInline>
              <source src="/fire.mp4" type="video/mp4" />
            </video>

            <div className="candle candle1">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>
            <div className="candle candle2">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>
            <div className="candle candle3">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>
            <div className="candle candle4">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>
            <div className="candle candle5">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>
            <div className="candle candle6">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>

            <button
              id="innpatron1"
              className="npc-marker"
              onClick={onInnPatron1Click}
            >
              ▼
            </button>

            <button
              id="innpatron2"
              className="npc-marker"
              onClick={onInnPatron2Click}
            >
              ▼
            </button>

            <button
              className="speaktoinnkeeper"
              onClick={onInnKeeperClick}
            >
              Speak With InnKeeper
            </button>

            {sleepingQuartersUnlocked && (
              <button
                className="speaktoinnkeeper"
                id="sleepingquarters"
                onClick={onSleep}
              >
                Sleeping Quarters
              </button>
            )}
          </div>
        )}

        {activeLocation === "weaponShop" && (
          <div>Weapon inventory goes here</div>
        )}

        {activeLocation === "itemShop" && (
          <div>Consumables go here</div>
        )}

        {activeLocation === "windmillRow" && (
          <div>Town residents go here</div>
        )}

        {activeLocation === "questBoard" && (
          <div>Available quests go here</div>
        )}

        {activeLocation === "mayor" && (
          <div>Story dialogue goes here</div>
        )}
      </div>
    </div>
  )
}
