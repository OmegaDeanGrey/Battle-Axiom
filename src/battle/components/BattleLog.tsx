type Props = {
  logs: string[]
}


export default function BattleLog({
  logs
}: Props) {

  return (

    <>

      <h2>
        Log
      </h2>


      <div
        style={{
          fontFamily: "monospace"
        }}
      >

        {
          logs.map(
            (log, index) => (

              <div key={index}>
                {log}
              </div>

            )
          )
        }

      </div>

    </>

  )

}