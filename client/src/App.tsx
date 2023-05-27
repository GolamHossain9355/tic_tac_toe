import { useEffect, useState } from "react"
import styled from "styled-components"
import socketService from "./services/socketService"

import "./App.css"
import JoinRoom from "./components/JoinRoom"
import { GameContext, IGameContextProps } from "./contexts/GameContext"

const AppContainer = styled.div`
   width: 100%;
   height: 100vh;
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 1em;
`

const WelcomeText = styled.h1`
   margin: 0;
   color: #8e44ad;
`

const MainContainer = styled.div`
   width: 100%;
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
`

function App() {
   const [isInRoom, setIsInRoom] = useState(false)

   const connectedSocket = async () => {
      try {
         await socketService.connect("http://localhost:9000")
      } catch (error) {
         console.log("Error connect: ", error)
      }
   }

   useEffect(() => {
      connectedSocket()
   }, [])

   const gameContextValue: IGameContextProps = {
      isInRoom,
      setIsInRoom,
   }

   return (
      <GameContext.Provider value={gameContextValue}>
         <AppContainer>
            <WelcomeText>Welcome to Tic-Tac-Toe</WelcomeText>

            <MainContainer>
               <JoinRoom />
            </MainContainer>
         </AppContainer>
      </GameContext.Provider>
   )
}

export default App
