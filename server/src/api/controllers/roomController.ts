import {
   ConnectedSocket,
   MessageBody,
   OnConnect,
   OnMessage,
   SocketController,
   SocketIO,
} from "socket-controllers"
import { Server, Socket } from "socket.io"

@SocketController()
export class RoomController {
   @OnConnect()
   public onConnection(socket: Socket, io: Server) {
      console.log("New Socket connected to RoomController: ", socket.id)
   }

   @OnMessage("join_game") // Add this decorator
   public async joinGame(
      @ConnectedSocket() socket: Socket,
      @SocketIO() io: Server,
      @MessageBody() message: any
   ) {
      console.log(
         "new user joining room: " + socket.id,
         " ",
         "Message: ",
         message
      )

      const connectedSocketsBeforePlayerJoined = io.sockets.adapter.rooms.get(
         message.roomId
      )
      const socketRooms = Array.from(socket.rooms.values()).filter(
         (room) => room !== socket.id
      )
      // checking if there are any rooms. If there are rooms, then I want to check if only 2 sockets are connected to it
      // if 2 sockets are already connected, then show the room is full error message
      if (
         socketRooms.length > 0 ||
         (connectedSocketsBeforePlayerJoined &&
            connectedSocketsBeforePlayerJoined.size === 2)
      ) {
         socket.emit("room_join_error", {
            error: "Room is full. Please choose another room to play from.",
         })
      } else {
         await socket.join(message.roomId)
         socket.emit("room_joined")

         const connectedSocketsSizeAfterPlayerJoined =
            io.sockets.adapter.rooms.get(message.roomId).size

         if (connectedSocketsSizeAfterPlayerJoined < 2) return

         setTimeout(() => {
            // Only the last person who joined the room will receive
            // this event and payload in there  socket
            socket.emit("start_game", {
               symbol: "o",
               currentTurn: false,
            })

            // Except for the senders socket(last person joined in this case),
            // everyone who joined the room will receive this event and payload in there socket
            // roomId is the same as a roomName
            socket
               .to(message.roomId)
               .emit("start_game", { symbol: "x", currentTurn: true })
         }, 1000)
      }
   }
}
