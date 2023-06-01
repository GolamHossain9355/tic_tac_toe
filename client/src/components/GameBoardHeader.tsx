/* eslint-disable @typescript-eslint/no-empty-interface */
import { FC, HTMLAttributes } from "react"

interface IGameBoardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const GameBoardHeader: FC<IGameBoardHeaderProps> = ({ className, ...rest }) => {
   return (
      <div className={`${className}`} {...rest}>
         header asd asd
      </div>
   )
}

export default GameBoardHeader
