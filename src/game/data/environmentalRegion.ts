import type {
  BackgroundFit,
  EnvironmentalRegion
} from "./EnvironmentalObjectRegistry"

export type RegionStyle = {
  left: string
  top: string
  width: string
  height: string
}

export function regionToStyle(
  region: EnvironmentalRegion,
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
  fit: BackgroundFit
): RegionStyle {
  if (
    containerWidth <= 0 ||
    containerHeight <= 0 ||
    imageWidth <= 0 ||
    imageHeight <= 0
  ) {
    return {
      left: `${region.left * 100}%`,
      top: `${region.top * 100}%`,
      width: `${region.width * 100}%`,
      height: `${region.height * 100}%`
    }
  }

  const widthScale =
    containerWidth / imageWidth
  const heightScale =
    containerHeight / imageHeight

  const scale =
    fit === "cover"
      ? Math.max(widthScale, heightScale)
      : Math.min(widthScale, heightScale)

  const renderedWidth =
    imageWidth * scale
  const renderedHeight =
    imageHeight * scale

  const offsetX =
    (containerWidth - renderedWidth) / 2
  const offsetY =
    (containerHeight - renderedHeight) / 2

  const left =
    offsetX + region.left * renderedWidth
  const top =
    offsetY + region.top * renderedHeight

  return {
    left: `${(left / containerWidth) * 100}%`,
    top: `${(top / containerHeight) * 100}%`,
    width: `${
      (region.width * renderedWidth /
        containerWidth) *
      100
    }%`,
    height: `${
      (region.height * renderedHeight /
        containerHeight) *
      100
    }%`
  }
}
