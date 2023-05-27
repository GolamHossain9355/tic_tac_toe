/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from "react"

export interface IGameContextProps {
   isInRoom: boolean
   setIsInRoom: (isInRoom: boolean) => void
}

const defaultState: IGameContextProps = {
   isInRoom: false,
   setIsInRoom: () => {},
}

export const GameContext = createContext(defaultState)

export function useGameContext() {
   return useContext(GameContext)
}
