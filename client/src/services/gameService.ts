import { Socket } from "socket.io-client"
import { GameMatrix, StartGame } from "../components/Game"

class GameService {
   public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
         socket.emit("join_game", { roomId })
         socket.on("room_joined", () => resolve(true))
         socket.on("room_join_error", ({ error }: { error: string }) =>
            reject(error)
         )
      })
   }

   public async updateGame(
      socket: Socket,
      gameMatrix: GameMatrix,
      currentTurn: boolean
   ) {
      socket.emit("update_game", { matrix: gameMatrix, currentTurn })
   }

   public async onGameUpdate(
      socket: Socket,
      listener: (updatedGameValues: {
         matrix: GameMatrix
         currentTurn: boolean
      }) => void
   ) {
      socket.on("on_game_update", (updatedGameValues) => {
         // console.log(matrix, currentTurn, symbol)
         listener(updatedGameValues)
      })
   }

   public async onStartGame(
      socket: Socket,
      listener: (options: StartGame) => void
   ) {
      socket.on("start_game", (options) => {
         console.log("listening on start game", options)
         return listener(options)
      })
   }
}

export default new GameService()
