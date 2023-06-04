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
      console.info("New Socket connected to MainController:  ", socket.id)
   }
}
