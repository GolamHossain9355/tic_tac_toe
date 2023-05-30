import { useEffect, useState } from "react"
import socketService from "./services/socketService"
import JoinRoom from "./components/JoinRoom"
import { GameContext, IGameContextProps } from "./contexts/GameContext"
import Game from "./components/Game"
import { ToastContainer, toast, Slide } from "react-toastify"

import "./App.css"
import { defaultCloseLoadingAlertValues } from "./utils/alertFeatures"

function App() {
   const [isInRoom, setIsInRoom] = useState(false)
   const [playerSymbol, setPlayerSymbol] = useState<"x" | "o" | null>(null)
   const [isPlayerTurn, setIsPlayerTurn] = useState(false)
   const [isGameStarted, setIsGameStarted] = useState(false)

   const connectedSocket = async () => {
      let loadingToastId: any

      try {
         if (!toast.isActive(loadingToastId)) {
            loadingToastId = toast.loading("Connecting to server...")
         }

         await socketService.connect(
            import.meta.env.VITE_SERVER_URL || "http://localhost:9002"
         )

         toast.update(loadingToastId, {
            render: "Socket connected successfully!",
            type: toast.TYPE.SUCCESS,
            ...defaultCloseLoadingAlertValues,
            autoClose: 3000,
         })
      } catch (error) {
         console.error(error)
         toast.update(loadingToastId, {
            render:
               "Socket Could Not Connect. Please refresh the page and try again.",
            type: toast.TYPE.ERROR,
            ...defaultCloseLoadingAlertValues,
            autoClose: 3000,
         })
      }
   }

   useEffect(() => {
      connectedSocket()
   }, [])

   const gameContextValue: IGameContextProps = {
      isInRoom,
      setIsInRoom,
      playerSymbol,
      setPlayerSymbol,
      isPlayerTurn,
      setIsPlayerTurn,
      isGameStarted,
      setIsGameStarted,
   }

   return (
      <GameContext.Provider value={gameContextValue}>
         <ToastContainer
            position="top-right"
            newestOnTop={true}
            closeOnClick
            theme="light"
            autoClose={5000}
            progressStyle={{ backgroundColor: "rgb(126 34 206 / 1)" }}
            transition={Slide}
         />

         <div className="flex flex-col w-full h-screen items-center p-4">
            <div className="mt-8 text-purple-700 font-bold text-3xl underline">
               Lets Play Tic-Tac-Toe
            </div>

            <div className="justify-center items-center w-fit h-fit my-auto">
               {isInRoom ? <Game /> : <JoinRoom />}
            </div>
         </div>
      </GameContext.Provider>
   )
}

export default App
