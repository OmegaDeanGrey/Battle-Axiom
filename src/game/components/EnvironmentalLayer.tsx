import {
  useCallback,
  useEffect,
  useState
} from "react"

import {
  getEnvironmentalObjectsForBackground,
  type EnvironmentalObjectDefinition
} from "../../game/data/EnvironmentalObjectRegistry"
import { regionToStyle } from "../../game/data/environmentalRegion"
import { useGame } from "../../game/context/GameContext"

import EnvironmentalExaminationModal from "./EnvironmentalExaminationModal"

import "./EnvironmentalLayer.css"

type Props = {
  backgroundId: string
}

export default function EnvironmentalLayer({
  backgroundId
}: Props) {
  const { examinedObjects, examineObject } =
    useGame()

  const [node, setNode] =
    useState<HTMLDivElement | null>(null)

  const [size, setSize] = useState({
    width: 0,
    height: 0
  })

  const [selected, setSelected] = useState<{
    object: EnvironmentalObjectDefinition
    firstTime: boolean
  } | null>(null)

  const measure = useCallback(
    (next: HTMLDivElement | null) => {
      setNode(next)

      if (next) {
        setSize({
          width: next.clientWidth,
          height: next.clientHeight
        })
      }
    },
    []
  )

  useEffect(() => {
    if (!node) return
    if (typeof ResizeObserver === "undefined") {
      return
    }

    const observer = new ResizeObserver(
      entries => {
        const entry = entries[0]

        if (!entry) return

        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        })
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [node])

  const objects =
    getEnvironmentalObjectsForBackground(
      backgroundId
    )

  if (objects.length === 0) {
    return null
  }

  return (
    <div
      className="environmental-layer"
      ref={measure}
    >
      {objects.map(object => (
        <button
          key={object.id}
          type="button"
          className="environmental-hotspot"
          style={regionToStyle(
            object.region,
            object.imageWidth,
            object.imageHeight,
            size.width,
            size.height,
            object.fit
          )}
          onClick={() => {
            setSelected({
              object,
              firstTime:
                !examinedObjects.includes(
                  object.id
                )
            })
            examineObject(object.id)
          }}
          title={object.prompt}
          aria-label={object.prompt}
        >
          <span className="environmental-hotspot__mark">
            ✦
          </span>
          <span className="environmental-hotspot__label">
            {object.prompt}
          </span>
        </button>
      ))}

      {selected && (
        <EnvironmentalExaminationModal
          object={selected.object}
          firstTime={selected.firstTime}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
