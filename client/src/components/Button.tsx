import { FC, HTMLAttributes } from "react"

interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
   gameHasResult: boolean
   resetGame: () => Promise<void>
}

const Button: FC<IButtonProps> = ({
   className,
   children,
   gameHasResult,
   resetGame,
   ...rest
}) => {
   return (
      <button
         className={` text-white px-4 py-2 rounded-md ${className} ${
            gameHasResult ? "bg-purple-700 hover:bg-purple-500" : "bg-gray-700"
         } z-[999]`}
         disabled={!gameHasResult}
         onClick={async () => await resetGame()}
         {...rest}
      >
         {children}
      </button>
   )
}

export default Button
