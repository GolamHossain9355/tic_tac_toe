import { Server, Socket } from "socket.io"
import { MainController } from "./api/controllers/mainController"
import { RoomController } from "./api/controllers/roomController"

export default (httpServer) => {
   const io = new Server(httpServer, {
      cors: {
         origin: "*",
      },
   })

   io.on("connection", (socket: Socket) => {
      // Instantiate your controllers and pass the socket and io instances
      const mainController = new MainController()
      mainController.onConnection(socket, io)

      const roomController = new RoomController()
      roomController.onConnection(socket, io)

      socket.on("join_game", async (message) => {
         console.log("Received join_game event with message:", message)
         // Call the join_game method from RoomController
         await roomController.join_game(socket, io, message)
      })
   })

   return io
}
