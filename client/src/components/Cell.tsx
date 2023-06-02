import { FC, HTMLAttributes, useState, useEffect } from "react"
import { GameResult, NumberOrNull, WiningCells } from "./Game"

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

   return (
      <div
         className={`w-52 h-36 max-w-52 flex items-center justify-center rounded-2xl cursor-pointer gap-2
      ${borderTop ? "border-t-4 border-purple-700 " : ""}
      ${borderRight ? "border-r-4 border-purple-700 " : ""}
      ${borderBottom ? "border-b-4 border-purple-700 " : ""}
      ${borderLeft ? "border-l-4 border-purple-700 " : ""}
      transition-all duration-300 ease-in-out hover:bg-purple-600 hover:bg-opacity-10 ${className}
      ${disabledCellValue} ${
            cellHasCurrentPlayerSymbol &&
            "bg-green-300 hover:bg-green-300 hover:bg-opacity-100"
         } ${
            cellHasOtherPlayersSymbol &&
            "bg-red-300 hover:bg-red-300 hover:bg-opacity-100"
         }
         ${
            isCurrentWiningCell &&
            gameResult.currentPlayerWon &&
            "bg-green-500 hover:bg-green-500"
         }
         ${
            isCurrentWiningCell &&
            gameResult.otherPlayerWon &&
            "bg-red-500 hover:bg-red-500"
         }
         ${
            gameResult.gameIsATie &&
            cellHasCurrentPlayerSymbol &&
            "bg-green-700 hover:bg-green-700"
         }
         ${
            gameResult.gameIsATie &&
            cellHasOtherPlayersSymbol &&
            "bg-red-700 hover:bg-red-700"
         }
      `}
         {...rest}
      >
         {children}
      </div>
   )
}

export default Cell
