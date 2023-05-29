import { Socket, Server } from "socket.io"
import {
   ConnectedSocket,
   OnConnect,
   SocketController,
} from "socket-controllers"

@SocketController()
export class MainController {
   @OnConnect()
   public onConnection(socket: Socket, io: Server) {
      console.log("New Socket connected: ", socket.id)
   }
}
