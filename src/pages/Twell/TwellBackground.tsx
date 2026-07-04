export default function TwellBackground() {
  return (
    <>
      <img src="/Birds.png" className="birds" alt="" />

      <div className="waterfall">
        <video autoPlay loop muted playsInline>
          <source src="/WaterFall.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="fountain">
        <video autoPlay loop muted playsInline>
          <source src="/WaterFall.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="fountain2">
        <video autoPlay loop muted playsInline>
          <source src="/WaterFall.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="windmill1">
        <img src="/WindmillBlades.png" className="windmill-blades" />
      </div>

      <div className="windmill2">
        <img src="/WindmillBlades.png" className="windmill-blades" />
      </div>
    </>
  )
}
