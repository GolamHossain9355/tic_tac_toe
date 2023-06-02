import { FC, HTMLAttributes } from "react"

interface IGameBoardHeaderProps extends HTMLAttributes<HTMLDivElement> {
   playerSymbol: "x" | "o"
}

const GameBoardHeader: FC<IGameBoardHeaderProps> = ({
   className,
   playerSymbol,
   ...rest
}) => {
   return (
      <div className={`${className} w-full border border-black`} {...rest}>
         You are {playerSymbol}
      </div>
   )
}

export default GameBoardHeader
