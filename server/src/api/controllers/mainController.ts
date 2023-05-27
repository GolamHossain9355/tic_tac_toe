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

      socket.on("custom_event", (data: any) => {
         console.log("Data: ", data)
      })
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
