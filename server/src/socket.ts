import { Server, Socket } from "socket.io"
import { MainController } from "./api/controllers/mainController"
import { RoomController } from "./api/controllers/roomController"
import { GameController } from "./api/controllers/gameController"

export default (httpServer) => {
   const io = new Server(httpServer, {
      cors: {
         origin: process.env.CLIENT_URL || "http://localhost:5173",
      },
   })

   io.on("connection", (socket: Socket) => {
      // Instantiate your controllers and pass the socket and io instances
      const mainController = new MainController()
      const roomController = new RoomController()
      const gameController = new GameController()

      mainController.onConnection(socket, io)
      roomController.onConnection(socket, io)
      gameController.onConnection(socket, io)

      socket.on("join_game", async (message) => {
         // console.info("Received join_game event with message:", message)
         await roomController.joinGame(socket, io, message)
      })

      socket.on("update_game", async (message) => {
         // console.info("Received update_game event with message:", message)
         await gameController.updateGame(socket, io, message)
      })

      socket.on("game_win", async (message) => {
         await gameController.gameWin(socket, io, message)
      })
   })

   return io
}
