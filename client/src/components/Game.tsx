/* eslint-disable @typescript-eslint/no-explicit-any */
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
import GameBoardHeader from "./GameBoardHeader"
import Button from "./Button"

export type StartGame = {
   symbol: "x" | "o"
   currentTurn: boolean
}

type MatrixValues = "x" | "o" | null
export type GameMatrix = Array<Array<MatrixValues>>

type OutcomeMessages = "You Won!" | "You Lost!" | "The game is is a TIE!" | null

export type NumberOrNull = number | null
type StringOrNull = string | null

export type WiningCells = {
   firstCell: [NumberOrNull, NumberOrNull]
   secondCell: [NumberOrNull, NumberOrNull]
   thirdCell: [NumberOrNull, NumberOrNull]
}

export type GameResult = {
   currentPlayerWon: boolean | null
   otherPlayerWon: boolean | null
   gameIsATie: boolean | null
}

export type InitialMatrix = [
   [null, null, null],
   [null, null, null],
   [null, null, null]
]

const closeLoadingAlert: CloseLoadingAlert = {
   render: `Second player has joined the game`,
   type: toast.TYPE.SUCCESS,
   ...defaultCloseLoadingAlertValues,
}

const valueIsX = (value: string): boolean => {
   return value.toLowerCase() === "x"
}

const cellHasCurrentPlayerSymbol = (
   colValue: StringOrNull,
   playerSymbol: StringOrNull
): boolean | null => {
   if (colValue === null || playerSymbol === null) return null
   return colValue.toLowerCase() === playerSymbol.toLowerCase()
}

const cellHasOtherPlayersSymbol = (
   colValue: StringOrNull,
   playerSymbol: StringOrNull
): boolean | null => {
   if (colValue === null || playerSymbol === null) return null
   return colValue.toLowerCase() !== playerSymbol.toLowerCase()
}

const initialGameResultValues = {
   currentPlayerWon: null,
   otherPlayerWon: null,
   gameIsATie: null,
}

const initialWiningCellValues: WiningCells = {
   firstCell: [null, null],
   secondCell: [null, null],
   thirdCell: [null, null],
}

export type GameInfo = {
   totalGames: number
   currentPlayerWon: number
   otherPlayerWon: number
   gameIsATie: number
   currentGameNumber: number
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
   const [gameResult, setGameResult] = useState<GameResult>(
      initialGameResultValues
   )

   const [winingCells, setWiningCells] = useState<WiningCells>(
      initialWiningCellValues
   )
   const [gameInfo, setGameInfo] = useState<GameInfo>({
      totalGames: 0,
      currentPlayerWon: 0,
      otherPlayerWon: 0,
      gameIsATie: 0,
      currentGameNumber: 1,
   })

   const {
      playerSymbol,
      setPlayerSymbol,
      isPlayerTurn,
      setIsPlayerTurn,
      isGameStarted,
      setIsGameStarted,
   } = useGameContext()

   const checkGameState = (
      matrix: GameMatrix
   ): [boolean, boolean, WiningCells | null] => {
      let winningCellsToSet: WiningCells

      for (let i = 0; i < matrix.length; i++) {
         const row = []
         for (let j = 0; j < matrix[i].length; j++) {
            row.push(matrix[i][j])
         }

         if (row.every((value) => value && value === playerSymbol)) {
            winningCellsToSet = {
               firstCell: [0, i],
               secondCell: [1, i],
               thirdCell: [2, i],
            }
            return [true, false, winningCellsToSet]
         } else if (row.every((value) => value && value !== playerSymbol)) {
            winningCellsToSet = {
               firstCell: [0, i],
               secondCell: [1, i],
               thirdCell: [2, i],
            }
            return [false, true, winningCellsToSet]
         }
      }

      for (let i = 0; i < matrix.length; i++) {
         const column = []
         for (let j = 0; j < matrix[i].length; j++) {
            column.push(matrix[j][i])
         }

         if (column.every((value) => value && value === playerSymbol)) {
            winningCellsToSet = {
               firstCell: [i, 0],
               secondCell: [i, 1],
               thirdCell: [i, 2],
            }
            return [true, false, winningCellsToSet]
         } else if (column.every((value) => value && value !== playerSymbol)) {
            winningCellsToSet = {
               firstCell: [i, 0],
               secondCell: [i, 1],
               thirdCell: [i, 2],
            }
            return [false, true, winningCellsToSet]
         }
      }

      if (matrix[1][1]) {
         if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
            winningCellsToSet = {
               firstCell: [0, 0],
               secondCell: [1, 1],
               thirdCell: [2, 2],
            }
            if (matrix[1][1] === playerSymbol) {
               return [true, false, winningCellsToSet]
            } else {
               return [false, true, winningCellsToSet]
            }
         }

         if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
            winningCellsToSet = {
               firstCell: [2, 0],
               secondCell: [1, 1],
               thirdCell: [0, 2],
            }
            if (matrix[1][1] === playerSymbol) {
               return [true, false, winningCellsToSet]
            } else {
               return [false, true, winningCellsToSet]
            }
         }
      }

      // Check for a tie
      if (matrix.every((m) => m.every((v) => v !== null))) {
         return [true, true, null]
      }

      return [false, false, null]
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

         const [currentPlayerWon, otherPlayerWon, winingCellsToSet] =
            checkGameState(newMatrix)

         const youWonMessage = "You won!"
         const youLostMessage = "you lost!"
         const theGameIsATieMessage = "The game is is a TIE!"

         if (currentPlayerWon && otherPlayerWon) {
            setGameResult((prev) => ({
               ...prev,
               currentPlayerWon: false,
               otherPlayerWon: false,
               gameIsATie: true,
            }))

            setGameInfo((prev) => ({
               ...prev,
               totalGames: prev.currentGameNumber,
               gameIsATie: prev.gameIsATie + 1,
            }))

            setWiningCells((prev) => ({
               ...prev,
               ...winingCellsToSet,
            }))

            setIsPlayerTurn(!isPlayerTurn)
            setIsGameStarted(false)
            gameService.gameWin(
               socketService.socket,
               theGameIsATieMessage,
               winingCellsToSet,
               isPlayerTurn,
               gameInfo
            )
            toast.info(theGameIsATieMessage)
            return
         }

         if (otherPlayerWon) {
            setGameResult((prev) => ({
               ...prev,
               currentPlayerWon: false,
               otherPlayerWon: true,
               gameIsATie: false,
            }))

            setWiningCells((prev) => ({
               ...prev,
               ...winingCellsToSet,
            }))

            setGameInfo((prev) => ({
               ...prev,
               totalGames: prev.currentGameNumber,
               otherPlayerWon: prev.otherPlayerWon + 1,
            }))

            setIsPlayerTurn(!isPlayerTurn)
            setIsGameStarted(false)
            gameService.gameWin(
               socketService.socket,
               youWonMessage,
               winingCellsToSet,
               isPlayerTurn,
               gameInfo
            )
            toast.error(youLostMessage)
         }

         if (currentPlayerWon) {
            setGameResult((prev) => ({
               ...prev,
               currentPlayerWon: true,
               otherPlayerWon: false,
               gameIsATie: false,
            }))

            setWiningCells((prev) => ({
               ...prev,
               ...winingCellsToSet,
            }))

            setGameInfo((prev) => ({
               ...prev,
               totalGames: prev.currentGameNumber,
               currentPlayerWon: prev.currentPlayerWon + 1,
            }))

            setIsPlayerTurn(!isPlayerTurn)
            setIsGameStarted(false)
            gameService.gameWin(
               socketService.socket,
               youLostMessage,
               winingCellsToSet,
               isPlayerTurn,
               gameInfo
            )
            toast.success(youWonMessage)
         }
      } catch (error) {
         console.error(error)
      }
   }

   const resetGame = async () => {
      if (!socketService.socket) return
      const matrixValuesReset: InitialMatrix = [
         [null, null, null],
         [null, null, null],
         [null, null, null],
      ]
      try {
         await gameService.gameReset(socketService.socket, {
            gameInfo,
            gameResultReset: initialGameResultValues,
            isGameStartedReset: true,
            matrixReset: matrixValuesReset,
            receivedLostWonOrTieMsgReset: null,
            winingCellsReset: initialWiningCellValues,
         })
      } catch (error) {
         console.error(error)
      }
   }

   const handleGameUpdate = useCallback(async () => {
      if (!socketService.socket) return

      try {
         await gameService.onGameUpdate(
            socketService.socket,
            ({ matrix: newMatrix, resettingGame }) => {
               setIsPlayerTurn(true)
               if (!resettingGame) {
                  setMatrix(newMatrix)
               }
            }
         )
      } catch (error) {
         console.error(error)
      }
   }, [setIsPlayerTurn])

   const handleGameStart = useCallback(async () => {
      if (!socketService.socket) return
      let id: any
      if (loadingToastIds.length === 0) {
         id = toast.loading("Waiting for the second player to join")
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

   const handleGameWin = useCallback(async () => {
      if (!socketService.socket) return

      try {
         await gameService.onGameWin(
            socketService.socket,
            ({ message, winingCells, isPlayerTurnReset, newGameInfo }) => {
               setIsPlayerTurn(!isPlayerTurn)
               setIsGameStarted(false)
               setReceivedLostWonOrTieMsg(message as OutcomeMessages)
               setWiningCells((prev) => ({
                  ...prev,
                  ...winingCells,
               }))
               setIsPlayerTurn(isPlayerTurnReset)
               setGameInfo((prev) => ({
                  ...prev,
                  ...newGameInfo,
                  currentPlayerWon: newGameInfo.otherPlayerWon,
                  otherPlayerWon: newGameInfo.currentPlayerWon,
               }))
            }
         )
      } catch (error) {
         console.error(error)
      }
   }, [isPlayerTurn, setIsGameStarted, setIsPlayerTurn])

   useEffect(() => {
      if (!playerSymbol) return

      toast.info(`You are: ${playerSymbol.toUpperCase()}`)
   }, [playerSymbol])

   useEffect(() => {
      if (!receivedLostWonOrTieMsg) return

      if (receivedLostWonOrTieMsg.toLocaleLowerCase() === "you won!") {
         toast.success(receivedLostWonOrTieMsg)
         setGameResult((prev) => ({
            ...prev,
            currentPlayerWon: true,
            otherPlayerWon: false,
            gameIsATie: false,
         }))
         setGameInfo((prev) => ({
            ...prev,
            totalGames: prev.currentGameNumber,
            currentPlayerWon: prev.currentPlayerWon + 1,
         }))
         return
      }
      if (receivedLostWonOrTieMsg.toLocaleLowerCase() === "you lost!") {
         toast.error(receivedLostWonOrTieMsg)
         setGameResult((prev) => ({
            ...prev,
            currentPlayerWon: false,
            otherPlayerWon: true,
            gameIsATie: false,
         }))
         setGameInfo((prev) => ({
            ...prev,
            totalGames: prev.currentGameNumber,
            otherPlayerWon: prev.otherPlayerWon + 1,
         }))
         return
      }
      toast.info(receivedLostWonOrTieMsg)
      setGameResult((prev) => ({
         ...prev,
         currentPlayerWon: false,
         otherPlayerWon: false,
         gameIsATie: true,
      }))
      setGameInfo((prev) => ({
         ...prev,
         totalGames: prev.currentGameNumber,
         gameIsATie: prev.gameIsATie + 1,
      }))
   }, [receivedLostWonOrTieMsg])

   useEffect(() => {
      // prettier-ignore
      (async () => {
      if (!socketService.socket) return

      try {
            await gameService.onGameReset(socketService.socket, ({
               gameInfo, 
               gameResultReset,
               isGameStartedReset,
               matrixReset,
               receivedLostWonOrTieMsgReset,
               winingCellsReset
            }) => {
            setGameInfo((prev) => ({
               ...prev,
               totalGames: gameInfo.currentGameNumber,
               currentGameNumber: gameInfo.currentGameNumber + 1,
            }))
            setGameResult(gameResultReset)
            setMatrix(matrixReset)
            setWiningCells(winingCellsReset)
            setReceivedLostWonOrTieMsg(receivedLostWonOrTieMsgReset)
            setIsGameStarted(isGameStartedReset)
            setIsGameStarted(true)
        })
      } catch (error) {
         console.error(error)
      } 
    })()
   }, [isPlayerTurn, setIsGameStarted, setIsPlayerTurn])

   useEffect(() => {
      handleGameUpdate()
      handleGameStart()
      handleGameWin()
   }, [handleGameStart, handleGameUpdate, handleGameWin])

   const gameHasResult = Object.values(gameResult).includes(true)

   return (
      <div className="flex flex-col relative">
         {!isGameStarted || !isPlayerTurn ? (
            // this is basically to disable the board when its not the players turn or when the game has not started yet.
            <span className="w-full h-full absolute bottom-0 left-0 z-[99] cursor-default" />
         ) : null}

         <div className="text-4xl">
            <GameBoardHeader
               playerSymbol={playerSymbol || "..."}
               isPlayerTurn={isPlayerTurn}
               gameResult={gameResult}
               gameInfo={gameInfo}
            />
         </div>

         {matrix.map((row, rowIndex) => {
            return (
               <div
                  className="w-full flex justify-center items-center"
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
                        isPlayerTurn={isPlayerTurn}
                        colValueIsNull={colValue === null}
                        cellPosition={{ colIndex, rowIndex }}
                        cellHasCurrentPlayerSymbol={cellHasCurrentPlayerSymbol(
                           colValue,
                           playerSymbol
                        )}
                        cellHasOtherPlayersSymbol={cellHasOtherPlayersSymbol(
                           colValue,
                           playerSymbol
                        )}
                        gameResult={gameResult}
                        winingCells={winingCells}
                        cellIndex={colIndex + rowIndex}
                        gameInfo={gameInfo}
                        onClick={() =>
                           updateGameMatrix(rowIndex, colIndex, playerSymbol)
                        }
                     >
                        {colValue ? (
                           valueIsX(colValue) ? (
                              <span className="text-6xl md:text-8xl text-purple-600 after:content-[X]">
                                 X
                              </span>
                           ) : (
                              <span className="text-6xl md:text-8xl text-purple-600 after:content-[O]">
                                 O
                              </span>
                           )
                        ) : null}
                     </Cell>
                  ))}
               </div>
            )
         })}

         <div className="w-full flex justify-center items-center mt-8">
            <Button gameHasResult={gameHasResult} resetGame={resetGame}>
               Next Game
            </Button>
         </div>
      </div>
   )
}

export default Game
