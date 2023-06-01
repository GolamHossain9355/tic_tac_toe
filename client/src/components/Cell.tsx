import { FC, HTMLAttributes } from "react"

interface ICellProps extends HTMLAttributes<HTMLDivElement> {
   borderTop?: boolean
   borderRight?: boolean
   borderLeft?: boolean
   borderBottom?: boolean
}

const Cell: FC<ICellProps> = ({
   children,
   className,
   borderTop,
   borderRight,
   borderLeft,
   borderBottom,
   ...rest
}) => {
   return (
      <div
         className={`w-52 h-36 flex items-center justify-center rounded-2xl cursor-pointer gap-2
      ${borderTop ? "border-t-4 border-purple-600 " : ""}
      ${borderRight ? "border-r-4 border-purple-600 " : ""}
      ${borderBottom ? "border-b-4 border-purple-600 " : ""}
      ${borderLeft ? "border-l-4 border-purple-600 " : ""}
      transition-all duration-300 ease-in-out hover:bg-purple-600 hover:bg-opacity-10 ${className}`}
         {...rest}
      >
         {children}
      </div>
   )
}

export default Cell
