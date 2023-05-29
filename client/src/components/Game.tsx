import { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { useGameContext } from "../contexts/GameContext"
import socketService from "../services/socketService"
import gameService from "../services/gameService"

const GameContainer = styled.div`
   display: flex;
   flex-direction: column;
   font-family: "Zen Tokyo Zoo", cursive;
   position: relative;
`

const RowContainer = styled.div`
   width: 100%;
   display: flex;
`

interface ICellProps {
   borderTop?: boolean
   borderRight?: boolean
   borderLeft?: boolean
   borderBottom?: boolean
}

const Cell = styled.div<ICellProps>`
   width: 13em;
   height: 9em;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 20px;
   cursor: pointer;
   border-top: ${({ borderTop }) => borderTop && "3px solid #8e44ad"};
   border-left: ${({ borderLeft }) => borderLeft && "3px solid #8e44ad"};
   border-bottom: ${({ borderBottom }) => borderBottom && "3px solid #8e44ad"};
   border-right: ${({ borderRight }) => borderRight && "3px solid #8e44ad"};
   transition: all 270ms ease-in-out;

   &:hover {
      background-color: #8d44ad28;
   }
`

const PlayStopper = styled.div`
   width: 100%;
   height: 100%;
   position: absolute;
   bottom: 0;
   left: 0;
   z-index: 99;
   cursor: default;
`

const X = styled.span`
   font-size: 100px;
   color: #8e44ad;
   &::after {
      content: "X";
   }
`

const O = styled.span`
   font-size: 100px;
   color: #8e44ad;
   &::after {
      content: "O";
   }
`

export type StartGame = {
   symbol: "x" | "o"
   currentTurn: boolean
}
type MatrixValues = "x" | "o" | null
export type GameMatrix = Array<Array<MatrixValues>>

function Game() {
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
            alert(theGameIsATieMessage)
            return
         }

         if (currentPlayerWon) {
            gameService.gameWin(socketService.socket, youLostMessage)
            alert(youWonMessage)
         }

         if (otherPlayerWon) {
            gameService.gameWin(socketService.socket, youWonMessage)
            alert(youLostMessage)
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
      try {
         await gameService.onStartGame(
            socketService.socket,
            ({ symbol, currentTurn }) => {
               setPlayerSymbol(symbol)
               setIsPlayerTurn(currentTurn)
               setIsGameStarted(true)
            }
         )
      } catch (error) {
         console.error(error)
      }
   }, [setIsGameStarted, setIsPlayerTurn, setPlayerSymbol])

   const handleGameWin = useCallback(() => {
      if (!socketService.socket) return

      try {
         gameService.onGameWin(socketService.socket, (message) => {
            setIsPlayerTurn(false)
            alert(message)
         })
      } catch (error) {
         console.error(error)
      }
   }, [setIsPlayerTurn])

   useEffect(() => {
      handleGameUpdate()
      handleGameStart()
      handleGameWin()
   }, [handleGameStart, handleGameUpdate, handleGameWin])

   return (
      <GameContainer>
         {!isGameStarted ? (
            <h2>Waiting for the second player to join</h2>
         ) : null}

         {!isGameStarted || !isPlayerTurn ? <PlayStopper /> : null}

         {matrix.map((row, rowIndex) => {
            return (
               <RowContainer>
                  {row.map((colValue: MatrixValues, colIndex) => (
                     <Cell
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
                              <X />
                           ) : (
                              <O />
                           )
                        ) : null}
                     </Cell>
                  ))}
               </RowContainer>
            )
         })}
      </GameContainer>
   )
}

export default Game
