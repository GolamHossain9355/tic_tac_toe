import { FC, HTMLAttributes, useEffect, useState } from "react"
import { GameInfo, GameResult } from "./Game"

type XorO = "x" | "o" | "..."

interface IGameBoardHeaderProps extends HTMLAttributes<HTMLDivElement> {
   playerSymbol: XorO
   isPlayerTurn: boolean
   gameResult: GameResult
   gameInfo: GameInfo
}

const GameBoardHeader: FC<IGameBoardHeaderProps> = ({
   className,
   playerSymbol,
   isPlayerTurn,
   gameResult,
   gameInfo,
   ...rest
}) => {
   const otherPlayerSymbol: XorO =
      playerSymbol === "..." ? "..." : playerSymbol === "x" ? "o" : "x"
   const [currentPlayerBorderAnimation, setCurrentPlayerBorderAnimation] =
      useState<string>("")
   const [otherPlayerBorderAnimation, setOtherPlayerBorderAnimation] =
      useState<string>("")
   const [currentPlayerTextStyle, setCurrentPlayerTextStyle] =
      useState("text-purple-700")

   const [otherPlayerTextStyle, setOtherPlayerTextStyle] =
      useState("text-red-700")

   const { currentPlayerWon, otherPlayerWon, gameIsATie } = gameResult

   useEffect(() => {
      const currentPlayerConstantStyle =
         "border-b-8 rounded-l-lg border-purple-700 absolute top-full right-0"
      const currentPlayerLossStyle =
         "border-b-8 rounded-l-lg border-gray-700 border-opacity-40 absolute top-full right-0"
      const otherPlayerConstantStyle =
         "border-b-8 rounded-r-lg border-red-700 absolute top-full left-0"
      const otherPlayersLossStyle =
         "border-b-8 rounded-r-lg order-gray-700 border-opacity-40 absolute top-full left-0"

      if (currentPlayerWon) {
         setCurrentPlayerBorderAnimation(
            `${currentPlayerConstantStyle} border-expand`
         )
         setOtherPlayerBorderAnimation(`${otherPlayersLossStyle} border-expand`)
         return
      }

      if (otherPlayerWon) {
         setCurrentPlayerBorderAnimation(
            `${currentPlayerLossStyle} border-expand`
         )
         setOtherPlayerBorderAnimation(
            `${otherPlayerConstantStyle} border-expand`
         )
         return
      }

      if (gameIsATie) {
         setCurrentPlayerBorderAnimation(
            `${currentPlayerLossStyle} border-expand`
         )
         setOtherPlayerBorderAnimation(`${otherPlayersLossStyle} border-expand`)
         return
      }

      if (isPlayerTurn) {
         setCurrentPlayerBorderAnimation(
            `${currentPlayerConstantStyle} border-expand`
         )
         setOtherPlayerBorderAnimation(
            `${otherPlayerConstantStyle} border-shrink`
         )
         return
      }

      setCurrentPlayerBorderAnimation(
         `${currentPlayerConstantStyle} border-shrink`
      )
      setOtherPlayerBorderAnimation(`${otherPlayerConstantStyle} border-expand`)
   }, [currentPlayerWon, gameIsATie, gameResult, isPlayerTurn, otherPlayerWon])

   const losersGrayColor = "text-gray-700 text-opacity-50"

   useEffect(() => {
      if (otherPlayerWon) {
         setCurrentPlayerTextStyle(`${losersGrayColor}`)
         return
      }

      if (currentPlayerWon) {
         setOtherPlayerTextStyle(`${losersGrayColor}`)
         return
      }

      if (gameIsATie) {
         setCurrentPlayerTextStyle(`${losersGrayColor}`)
         setOtherPlayerTextStyle(`${losersGrayColor}`)
         return
      }

      setCurrentPlayerTextStyle("text-purple-700")
      setOtherPlayerTextStyle("text-red-700")
   }, [
      currentPlayerWon,
      gameIsATie,
      otherPlayerWon,
      gameInfo.currentGameNumber,
   ])

   return (
      <div
         className={`${className} w-full flex justify-center items-center mb-12`}
         {...rest}
      >
         <div
            className={`w-full flex py-4 justify-center items-center relative`}
         >
            <div
               className={`${currentPlayerTextStyle} font-bold transition-colors text-2xl md:text-4xl`}
            >
               Your Turn ({playerSymbol.toUpperCase()})
            </div>
            <span className={`${currentPlayerBorderAnimation}`} />
         </div>

         <div
            className={`w-full py-4 flex justify-center items-center relative`}
         >
            <div
               className={`${otherPlayerTextStyle} font-bold transition-colors text-2xl md:text-4xl `}
            >
               Player 2 ({otherPlayerSymbol.toUpperCase()})
            </div>
            <span className={`${otherPlayerBorderAnimation}`} />
         </div>
      </div>
   )
}

export default GameBoardHeader
