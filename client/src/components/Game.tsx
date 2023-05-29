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

   const updateGameMatrix = (
      row: number,
      col: number,
      symbol: MatrixValues
   ) => {
      if (matrix[row][col] !== null || !socketService.socket) return

      const newMatrix = [...matrix]
      newMatrix[row][col] = symbol
      setMatrix(newMatrix)

      gameService.updateGame(socketService.socket, newMatrix, isPlayerTurn)
   }

   const handleGameUpdate = useCallback(() => {
      if (!socketService.socket) return
      gameService.onGameUpdate(
         socketService.socket,
         ({ matrix: newMatrix, currentTurn }) => {
            setIsPlayerTurn(currentTurn)
            setMatrix(newMatrix)
         }
      )
   }, [setIsPlayerTurn])

   const handleGameStart = useCallback(() => {
      console.log("inside start before ")
      if (!socketService.socket) return
      console.log("inside start after")

      gameService.onStartGame(
         socketService.socket,
         ({ symbol, currentTurn }) => {
            console.log("game values: ", currentTurn, symbol)
            setPlayerSymbol(symbol)
            setIsPlayerTurn(currentTurn)
            setIsGameStarted(true)
         }
      )
   }, [setIsGameStarted, setIsPlayerTurn, setPlayerSymbol])

   useEffect(() => {
      handleGameUpdate()
      handleGameStart()
   }, [handleGameStart, handleGameUpdate])

   console.log("isPlayerTurn: ", isPlayerTurn)
   console.log("isGameStarted: ", isGameStarted)
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
