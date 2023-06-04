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
   const [currentPlayerBorderAnimation, setCurrentPlayerBorderAnimation] =
      useState<string>("")
   const [otherPlayerBorderAnimation, setOtherPlayerBorderAnimation] =
      useState<string>("")
   const [currentPlayerTextStyle, setCurrentPlayerTextStyle] =
      useState("text-purple-700")
   const [otherPlayerTextStyle, setOtherPlayerTextStyle] =
      useState("text-red-700")
   const [youWonTableTextColor, setYouWonTableTextColor] =
      useState("text-purple-800")
   const [youLostTableTextColor, setYouLostTableTextColor] =
      useState("text-purple-800")

   const otherPlayerSymbol: XorO =
      playerSymbol === "..." ? "..." : playerSymbol === "x" ? "o" : "x"
   const { currentPlayerWon, otherPlayerWon, gameIsATie } = gameResult
   const losersGrayColor = "text-gray-700 text-opacity-50"

   useEffect(() => {
      const currentPlayerConstantStyle =
         "border-b-8 rounded-l-lg border-purple-700 absolute top-full right-0"
      const currentPlayerLossStyle =
         "border-b-8 rounded-l-lg border-gray-700 border-opacity-40 absolute top-full right-0"
      const otherPlayerConstantStyle =
         "border-b-8 rounded-r-lg border-red-700 absolute top-full left-0"
      const otherPlayersLossStyle =
         "border-b-8 rounded-r-lg border-gray-700 border-opacity-40 absolute top-full left-0"

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

   useEffect(() => {
      if (gameInfo.currentPlayerWon > gameInfo.otherPlayerWon) {
         setYouWonTableTextColor("text-green-500 font-bold")
         setYouLostTableTextColor(`${losersGrayColor}`)
      }

      if (gameInfo.currentPlayerWon < gameInfo.otherPlayerWon) {
         setYouWonTableTextColor(`${losersGrayColor}`)
         setYouLostTableTextColor("text-red-500 font-bold")
      }

      if (gameInfo.totalGames === 0) return

      if (gameInfo.currentPlayerWon === gameInfo.otherPlayerWon) {
         setYouWonTableTextColor(`${losersGrayColor}`)
         setYouLostTableTextColor(`${losersGrayColor}`)
      }
   }, [gameInfo.currentPlayerWon, gameInfo.otherPlayerWon, gameInfo.totalGames])

   return (
      <div className={`${className} mb-14 mt-6`} {...rest}>
         <div className="font-normal text-purple-800">
            <table className="w-full text-xl border border-gray-300">
               <tr>
                  <th className="font-normal text-right w-1/2 border border-gray-300 p-2">
                     Total Played:
                  </th>
                  <td className="w-1/2 text-center border border-gray-300">
                     <span className="font-bold">{gameInfo.totalGames}</span>
                  </td>
               </tr>
               <tr>
                  <th className="font-normal text-right w-1/2 border p-2 border-gray-300">
                     Game Number:
                  </th>
                  <td className="w-1/2 text-center border border-gray-300">
                     <span className="font-bold">
                        {gameInfo.currentGameNumber}
                     </span>
                  </td>
               </tr>
               <tr className={`${youWonTableTextColor}`}>
                  <th className="font-normal text-right w-1/2 border p-2 border-gray-300">
                     You Won:
                  </th>
                  <td className="w-1/2 text-center border border-gray-300">
                     <span className="font-bold">
                        {gameInfo.currentPlayerWon}
                     </span>
                  </td>
               </tr>
               <tr className={`${youLostTableTextColor}`}>
                  <th className="font-normal text-right w-1/2 p-2 border border-gray-300">
                     Player 2 Won:
                  </th>
                  <td className="w-1/2 text-center border border-gray-300">
                     <span className="font-bold">
                        {gameInfo.otherPlayerWon}
                     </span>
                  </td>
               </tr>
               <tr>
                  <th className="font-normal text-right w-1/2  p-2 border border-gray-300">
                     Games Tied:
                  </th>
                  <td className="w-1/2 text-center border border-gray-300">
                     <span className="font-bold">{gameInfo.gameIsATie}</span>
                  </td>
               </tr>
            </table>
         </div>

         <div className="w-full flex justify-center items-center">
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
      </div>
   )
}

export default GameBoardHeader
