import { FC, HTMLAttributes, useState, useEffect } from "react"
import { GameInfo, GameResult, NumberOrNull, WiningCells } from "./Game"

interface ICellProps extends HTMLAttributes<HTMLDivElement> {
   borderTop: boolean
   borderRight: boolean
   borderLeft: boolean
   borderBottom: boolean
   isPlayerTurn: boolean
   colValueIsNull: boolean
   cellIndex: number
   cellPosition: { colIndex: number; rowIndex: number }
   cellHasCurrentPlayerSymbol: boolean | null
   cellHasOtherPlayersSymbol: boolean | null
   gameResult: GameResult
   winingCells: WiningCells
}

const waitTimeBeforeCellIsGray = (
   index: number,
   styleString: string
): Promise<string> => {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve(styleString)
      }, 100 * index)
   })
}

const formattedWiningCells = (
   winingCells: WiningCells
): { colIndex: NumberOrNull; rowIndex: NumberOrNull }[] => {
   const { firstCell, secondCell, thirdCell } = winingCells
   return [
      { colIndex: firstCell[0], rowIndex: firstCell[1] },
      { colIndex: secondCell[0], rowIndex: secondCell[1] },
      { colIndex: thirdCell[0], rowIndex: thirdCell[1] },
   ]
}

const Cell: FC<ICellProps> = ({
   children,
   className,
   borderTop,
   borderRight,
   borderLeft,
   borderBottom,
   isPlayerTurn,
   colValueIsNull,
   cellHasCurrentPlayerSymbol,
   cellHasOtherPlayersSymbol,
   gameResult,
   winingCells,
   cellPosition,
   cellIndex,
   ...rest
}) => {
   const [disabledCellValue, setDisabledCellValue] = useState<null | string>(
      null
   )
   const [currentCellStyle, setCurrentCellStyle] = useState<string>("")

   const formattedWinningCellValues = formattedWiningCells(winingCells)

   const isCurrentWiningCell = formattedWinningCellValues.some(
      (winingCellPosition) =>
         winingCellPosition.colIndex === cellPosition.colIndex &&
         winingCellPosition.rowIndex === cellPosition.rowIndex
   )

   useEffect(() => {
      async function loadCellValue() {
         if (!isPlayerTurn && colValueIsNull) {
            const value = await waitTimeBeforeCellIsGray(
               cellIndex,
               "bg-gray-700 bg-opacity-20"
            )
            setDisabledCellValue(value)
            return
         }

         setDisabledCellValue(null)
      }
      loadCellValue()
   }, [cellIndex, colValueIsNull, isPlayerTurn])

   useEffect(() => {
      const { currentPlayerWon, gameIsATie, otherPlayerWon } = gameResult
      const gameFinished = currentPlayerWon || otherPlayerWon || gameIsATie

      if (cellHasCurrentPlayerSymbol && !gameFinished) {
         setCurrentCellStyle(
            "bg-green-200 hover:bg-green-200 hover:bg-opacity-100"
         )
         return
      }

      if (cellHasOtherPlayersSymbol && !gameFinished) {
         setCurrentCellStyle("bg-red-200 hover:bg-red-200 hover:bg-opacity-100")
         return
      }

      if (isCurrentWiningCell && currentPlayerWon) {
         setCurrentCellStyle("bg-green-400 hover:bg-green-400")
         return
      }

      if (isCurrentWiningCell && otherPlayerWon) {
         setCurrentCellStyle("bg-red-400 hover:bg-red-400")
         return
      }

      if (!isCurrentWiningCell && (currentPlayerWon || otherPlayerWon)) {
         setCurrentCellStyle("bg-gray-700 bg-opacity-20")
         return
      }

      // this will be the style for all the cells if the game is a tie
      if (gameIsATie) {
         setCurrentCellStyle("bg-gray-700 bg-opacity-20")
         return
      }
   }, [
      cellHasCurrentPlayerSymbol,
      cellHasOtherPlayersSymbol,
      gameResult,
      isCurrentWiningCell,
   ])

   return (
      <div
         className={`w-28 h-24 ${
            !colValueIsNull && "pointer-events-none"
         } md:w-40 md:h-36 lg:w-52 lg:h-40 max-w-52 flex items-center justify-center rounded-2xl cursor-pointer gap-2
      ${borderTop ? "border-t-4 border-purple-700 " : ""}
      ${borderRight ? "border-r-4 border-purple-700 " : ""}
      ${borderBottom ? "border-b-4 border-purple-700 " : ""}
      ${borderLeft ? "border-l-4 border-purple-700 " : ""}
      transition-all duration-300 ease-in-out hover:bg-purple-600 hover:bg-opacity-10 ${className}
      ${disabledCellValue} ${currentCellStyle}
         `}
         {...rest}
      >
         {children}
      </div>
   )
}

export default Cell
