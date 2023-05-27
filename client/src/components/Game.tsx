import styled from "styled-components"

const GameContainer = styled.div`
   display: flex;
   flex-direction: column;
   font-family: "Zen Tokyo Zoo", cursive;
   position: relative;
`

const RowContainer = styled.div`
   width: 100%;
   display: flex;
`

interface ICellProps {
   borderTop?: boolean
   borderRight?: boolean
   borderLeft?: boolean
   borderBottom?: boolean
}

const Cell = styled.div<ICellProps>`
   width: 13em;
   height: 9em;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 20px;
   cursor: pointer;
   border-top: ${({ borderTop }) => borderTop && "3px solid #8e44ad"};
   border-left: ${({ borderLeft }) => borderLeft && "3px solid #8e44ad"};
   border-bottom: ${({ borderBottom }) => borderBottom && "3px solid #8e44ad"};
   border-right: ${({ borderRight }) => borderRight && "3px solid #8e44ad"};
   transition: all 270ms ease-in-out;

   &:hover {
      background-color: #8d44ad28;
   }
`

const PlayStopper = styled.div`
   width: 100%;
   height: 100%;
   position: absolute;
   bottom: 0;
   left: 0;
   z-index: 99;
   cursor: default;
`

const X = styled.span`
   font-size: 100px;
   color: #8e44ad;
   &::after {
      content: "X";
   }
`

const O = styled.span`
   font-size: 100px;
   color: #8e44ad;
   &::after {
      content: "O";
   }
`

function Game() {
   return <div>Game</div>
}

export default Game
