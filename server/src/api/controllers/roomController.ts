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

      socket.on("join_game", (data: any) => {
         console.log("after on connection")
      })
   }

   @OnMessage("join_game") // Add this decorator
   public async join_game(
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

      const connectedSockets = io.sockets.adapter.rooms.get(message.roomId)
      const socketRooms = Array.from(socket.rooms.values()).filter(
         (room) => room !== socket.id
      )

      // checking if there are any rooms. If there are rooms, then I want to check if only 2 sockets are connected to it
      // if 2 sockets are already connected, then show the room is full error message
      if (
         socketRooms.length > 0 ||
         (connectedSockets && connectedSockets.size === 2)
      ) {
         socket.emit("room_join_error", {
            error: "Room is full. Please choose another room to play from.",
         })
      } else {
         await socket.join(message.roomId)
         socket.emit("room_joined")
      }
   }

   static initializeSocket(@ConnectedSocket() socket: Socket) {
      // Optional: Perform any additional setup or initialization tasks here

      // Bind the socket event handlers
      socket.onAny((event, ...args) => {
         // Optional: Perform any preprocessing or middleware tasks before event handling
         console.log(`Received event '${event}' with arguments:`, args)
      })
   }
}
