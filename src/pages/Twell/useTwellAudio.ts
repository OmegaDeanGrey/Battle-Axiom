import { useRef, useState } from "react"

export function useTwellAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  function toggleAudio() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
      setPlaying(true)
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  function fadeOutMusic() {
    const audio = audioRef.current
    if (!audio) return
    const fade = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05
      } else {
        audio.volume = 0
        audio.pause()
        clearInterval(fade)
      }
    }, 100)
  }

  return { audioRef, playing, toggleAudio, fadeOutMusic }
}
