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
export class GameController {
   private getSocketGameRoom(socket: Socket): string {
      // potential optimizations may be available for using find instead of filter
      const socketRooms = Array.from(socket.rooms.values()).filter(
         (room) => room !== socket.id
      )
      const gameRoom = socketRooms && socketRooms[0]
      return gameRoom
   }

   @OnConnect()
   public onConnection(socket: Socket, io: Server) {
      console.log("New Socket connected to GameController: ", socket.id)
   }

   @OnMessage("update_game") // Add this decorator
   public async updateGame(
      @ConnectedSocket() socket: Socket,
      @SocketIO() io: Server,
      @MessageBody() message: any
   ) {
      const gameRoom = this.getSocketGameRoom(socket)
      console.log("updating game")
      // const messageForCurrentSocket =
      // socket.emit("on_game_update",)
      // every socket in the room except the socket that sent this event
      // will receive this event and payload(in this case it is an update
      // to the ticTacToe game board, GameMatrix)
      console.log(message)

      socket.to(gameRoom).emit("on_game_update", message)
   }
}
