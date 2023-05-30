/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from "react"

export interface IGameContextProps {
   isInRoom: boolean
   setIsInRoom: (isInRoom: boolean) => void
   playerSymbol: "x" | "o" | null
   setPlayerSymbol: (symbol: "x" | "o") => void
   isPlayerTurn: boolean
   setIsPlayerTurn: (currentTurn: boolean) => void
   isGameStarted: boolean
   setIsGameStarted: (started: boolean) => void
}

const defaultState: IGameContextProps = {
   isInRoom: false,
   setIsInRoom: () => {},
   playerSymbol: null,
   setPlayerSymbol: () => {},
   isPlayerTurn: false,
   setIsPlayerTurn: () => {},
   isGameStarted: false,
   setIsGameStarted: () => {},
}

export const GameContext = createContext(defaultState)

export function useGameContext() {
   return useContext(GameContext)
}
