import { useEffect, useState } from "react"
import socketService from "./services/socketService"
import JoinRoom from "./components/JoinRoom"
import { GameContext, IGameContextProps } from "./contexts/GameContext"
import Game from "./components/Game"
import { ToastContainer, toast } from "react-toastify"

import "./App.css"

function App() {
   const [isInRoom, setIsInRoom] = useState(false)
   const [playerSymbol, setPlayerSymbol] = useState<"x" | "o">("o")
   const [isPlayerTurn, setIsPlayerTurn] = useState(false)
   const [isGameStarted, setIsGameStarted] = useState(false)

   const connectedSocket = async () => {
      try {
         await toast.promise(
            socketService.connect(
               import.meta.env.VITE_SERVER_URL || "http://localhost:9002"
            ),
            {
               pending: "Connecting to server...",
               success: "Socket connected successfully!",
               error: "Socket connection failed!",
            }
         )
      } catch (error: unknown) {
         console.info(error)
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
            position="top-center"
            newestOnTop={false}
            closeOnClick
            theme="light"
            autoClose={3000}
            limit={3}
            progressStyle={{ backgroundColor: "rgb(126 34 206 / 1)" }}
         />

         <div className="flex flex-col w-full h-screen items-center p-4">
            <div className="mt-8 text-purple-700 font-bold text-3xl underline">
               Lets Play Tic-Tac-Toe
            </div>

            <div className="self-center justify-self-center w-full h-fit my-auto">
               {isInRoom ? <Game /> : <JoinRoom />}
            </div>
         </div>
      </GameContext.Provider>
   )
}

export default App
