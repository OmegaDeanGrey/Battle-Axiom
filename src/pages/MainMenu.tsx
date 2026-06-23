import { useNavigate } from "react-router-dom"
import "../pages/MainMenu.css"

export default function MainMenu(){

 const navigate = useNavigate()


 return (

  <div id="mainmenu">

    <h1 id="MMTitle">
      Battle Axiom
    </h1>


    <button
      onClick={() =>
        navigate("/party")
      }
      id="MMButton"
    >

      New Game

    </button>


  </div>

 )

}