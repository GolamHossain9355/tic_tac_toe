import { useState, useEffect, useCallback } from "react"
import { useGameContext } from "../contexts/GameContext"
import socketService from "../services/socketService"
import gameService from "../services/gameService"
import { toast } from "react-toastify"
import {
   CloseLoadingAlert,
   defaultCloseLoadingAlertValues,
   dismissPrevToasts,
} from "../utils/alertFeatures"
import Cell from "./Cell"

export type StartGame = {
   symbol: "x" | "o"
   currentTurn: boolean
}

type MatrixValues = "x" | "o" | null
export type GameMatrix = Array<Array<MatrixValues>>

type OutcomeMessages = "You Won!" | "You Lost!" | "The game is is a TIE!" | null

const closeLoadingAlert: CloseLoadingAlert = {
   render: `Second player has joined the game`,
   type: toast.TYPE.SUCCESS,
   ...defaultCloseLoadingAlertValues,
}

function Game() {
   const [receivedLostWonOrTieMsg, setReceivedLostWonOrTieMsg] =
      useState<OutcomeMessages>(null)
   const [loadingToastIds, setLoadingToastIds] = useState<any>([])
   const [matrix, setMatrix] = useState<GameMatrix>([
      [null, null, null],
      [null, null, null],
      [null, null, null],
   ])
   const {
      playerSymbol,
      setPlayerSymbol,
      isPlayerTurn,
      setIsPlayerTurn,
      isGameStarted,
      setIsGameStarted,
   } = useGameContext()

   const checkGameState = (matrix: GameMatrix) => {
      for (let i = 0; i < matrix.length; i++) {
         const row = []
         for (let j = 0; j < matrix[i].length; j++) {
            row.push(matrix[i][j])
         }

         if (row.every((value) => value && value === playerSymbol)) {
            return [true, false]
         } else if (row.every((value) => value && value !== playerSymbol)) {
            return [false, true]
         }
      }

      for (let i = 0; i < matrix.length; i++) {
         const column = []
         for (let j = 0; j < matrix[i].length; j++) {
            column.push(matrix[j][i])
         }

         if (column.every((value) => value && value === playerSymbol)) {
            return [true, false]
         } else if (column.every((value) => value && value !== playerSymbol)) {
            return [false, true]
         }
      }

      if (matrix[1][1]) {
         if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
            if (matrix[1][1] === playerSymbol) return [true, false]
            else return [false, true]
         }

         if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
            if (matrix[1][1] === playerSymbol) return [true, false]
            else return [false, true]
         }
      }

      //Check for a tie
      if (matrix.every((m) => m.every((v) => v !== null))) {
         return [true, true]
      }

      return [false, false]
   }

   const updateGameMatrix = (
      row: number,
      col: number,
      symbol: MatrixValues
   ) => {
      if (matrix[row][col] !== null || !socketService.socket) return

      const newMatrix = [...matrix]
      newMatrix[row][col] = symbol
      setMatrix(newMatrix)

      try {
         gameService.updateGame(socketService.socket, newMatrix)
         setIsPlayerTurn(false)

         const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix)

         const youWonMessage = "You won!"
         const youLostMessage = "you lost!"
         const theGameIsATieMessage = "The game is is a TIE!"

         if (currentPlayerWon && otherPlayerWon) {
            gameService.gameWin(socketService.socket, theGameIsATieMessage)
            toast.info(theGameIsATieMessage)
            return
         }

         if (currentPlayerWon) {
            gameService.gameWin(socketService.socket, youLostMessage)
            toast.success(youWonMessage)
         }

         if (otherPlayerWon) {
            gameService.gameWin(socketService.socket, youWonMessage)
            toast.error(youLostMessage)
         }
      } catch (error) {
         console.error(error)
      }
   }

   const handleGameUpdate = useCallback(async () => {
      if (!socketService.socket) return

      try {
         await gameService.onGameUpdate(
            socketService.socket,
            ({ matrix: newMatrix }) => {
               setIsPlayerTurn(true)
               setMatrix(newMatrix)
            }
         )
      } catch (error) {
         console.error(error)
      }
   }, [setIsPlayerTurn])

   const handleGameStart = useCallback(async () => {
      if (!socketService.socket) return

      if (loadingToastIds.length === 0) {
         const id = toast.loading("Waiting for the second player to join")
         setLoadingToastIds((prev: [typeof id]) => {
            const newArray = [...prev]
            newArray.push(id)
            return newArray
         })
      }
      try {
         await gameService.onStartGame(
            socketService.socket,
            ({ symbol, currentTurn }) => {
               if (!playerSymbol) {
                  setPlayerSymbol(symbol)
               }
               setIsPlayerTurn(currentTurn)
               setIsGameStarted(true)
            }
         )
      } catch (error) {
         console.error(error)
      }
   }, [
      loadingToastIds.length,
      playerSymbol,
      setIsGameStarted,
      setIsPlayerTurn,
      setPlayerSymbol,
   ])

   useEffect(() => {
      if (isGameStarted) {
         loadingToastIds.forEach((id: any) => {
            toast.update(id, {
               ...closeLoadingAlert,
            })
            dismissPrevToasts(id)
         })
      }
   }, [isGameStarted, loadingToastIds])

   const handleGameWin = useCallback(() => {
      if (!socketService.socket) return

      try {
         gameService.onGameWin(socketService.socket, (message) => {
            setIsPlayerTurn(false)
            setReceivedLostWonOrTieMsg(message as OutcomeMessages)
         })
      } catch (error) {
         console.error(error)
      }
   }, [setIsPlayerTurn])

   useEffect(() => {
      if (!playerSymbol) return

      toast.info(`You are: ${playerSymbol.toUpperCase()}`)
   }, [playerSymbol])

   useEffect(() => {
      if (!receivedLostWonOrTieMsg) return

      if (receivedLostWonOrTieMsg.toLocaleLowerCase() === "you won!") {
         toast.success(receivedLostWonOrTieMsg)
         return
      }
      if (receivedLostWonOrTieMsg.toLocaleLowerCase() === "you lost!") {
         toast.error(receivedLostWonOrTieMsg)
         return
      }
      toast.info(receivedLostWonOrTieMsg)
   }, [receivedLostWonOrTieMsg])

   useEffect(() => {
      handleGameUpdate()
      handleGameStart()
      handleGameWin()
   }, [handleGameStart, handleGameUpdate, handleGameWin])

   return (
      <div className="flex flex-col relative">
         {!isGameStarted || !isPlayerTurn ? (
            // this is basically to disable the board when its not the players turn or when the game has not started yet.
            <span className="w-full h-full absolute bottom-0 left-0 z-[99] cursor-default" />
         ) : null}

         {playerSymbol && (
            <div className="text-4xl">
               You are: {playerSymbol.toUpperCase()}
            </div>
         )}

         {matrix.map((row, rowIndex) => {
            return (
               <div
                  className="w-full flex"
                  key={`row-index-${row} ${rowIndex}`}
               >
                  {row.map((colValue: MatrixValues, colIndex) => (
                     <Cell
                        className="font-cursive"
                        key={`cell index: ${
                           colValue === null
                              ? "null" + colIndex
                              : colValue + colIndex
                        }`}
                        borderTop={rowIndex > 0}
                        borderRight={colIndex < 2}
                        borderBottom={rowIndex < 2}
                        borderLeft={colIndex > 0}
                        onClick={() =>
                           updateGameMatrix(rowIndex, colIndex, playerSymbol)
                        }
                     >
                        {colValue ? (
                           colValue.toLowerCase() === "X".toLowerCase() ? (
                              <span className="text-8xl text-purple-600 after:content-[X]">
                                 X
                              </span>
                           ) : (
                              <span className="text-8xl text-purple-600 after:content-[O]">
                                 O
                              </span>
                           )
                        ) : null}
                     </Cell>
                  ))}
               </div>
            )
         })}
      </div>
   )
}

export default Game
