/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { ChangeEvent, useState } from "react"
import styled from "styled-components"
import { useGameContext } from "../contexts/GameContext"
import socketService from "../services/socketService"
import gameService from "../services/gameService"
import { toast } from "react-toastify"
import { useCallback } from "react"
import { defaultCloseLoadingAlertValues } from "../utils/alertFeatures"

const JoinRoomContainer = styled.div`
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   margin-top: 2em;
   gap: 1rem;
`

const RoomIdInput = styled.input`
   height: 30px;
   width: 20em;
   font-size: 17px;
   outline: none;
   border: 1px solid #8e44ad;
   border-radius: 3px;
   padding: 0 10px;
`

const JoinButton = styled.button`
   outline: none;
   background-color: #8e44ad;
   color: #fff;
   font-size: 17px;
   border: 2px solid transparent;
   border-radius: 5px;
   padding: 4px 18px;
   transition: all 230ms ease-in-out;
   cursor: pointer;

   &:hover {
      background-color: transparent;
      border: 2px solid #8e44ad;
      color: #8e44ad;
   }
`

function JoinRoom() {
   const [roomName, setRoomName] = useState("")
   const [isJoining, setIsJoining] = useState(false)
   const { setIsInRoom } = useGameContext()

   const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setRoomName(value)
   }

   const joinRoom = useCallback(
      async (event: React.FormEvent) => {
         event.preventDefault()
         const socket = socketService.socket

         if (!roomName || roomName.trim() === "" || !socket) return

         setIsJoining(true)
         const loadingToastId = toast.loading("Joining room")
         try {
            const joined = await gameService.joinGameRoom(socket, roomName)

            if (!joined) return

            setIsInRoom(true)
            toast.update(loadingToastId, {
               render: `Joined room: ${roomName}`,
               type: toast.TYPE.SUCCESS,
               ...defaultCloseLoadingAlertValues,
            })
         } catch (error) {
            toast.update(loadingToastId, {
               render: `Could not join this room. ${error}`,
               type: toast.TYPE.ERROR,
               ...defaultCloseLoadingAlertValues,
            })
            console.error(error)
         } finally {
            setIsJoining(false)
         }
      },
      [roomName, setIsInRoom]
   )

   return (
      <form onSubmit={joinRoom}>
         <JoinRoomContainer>
            <h4>Enter room ID to join the game</h4>
            <RoomIdInput
               placeholder="Room ID"
               value={roomName}
               onChange={handleRoomNameChange}
            />
            <JoinButton type="submit" disabled={isJoining}>
               {isJoining ? "Joining..." : "Join"}
            </JoinButton>
         </JoinRoomContainer>
      </form>
   )
}

export default JoinRoom
