import { Socket } from "socket.io-client"
import { GameMatrix, StartGame, WiningCells } from "../components/Game"

type MessageReceived = {
   message: string
   winingCells: WiningCells
}
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

   public async updateGame(socket: Socket, gameMatrix: GameMatrix) {
      socket.emit("update_game", { matrix: gameMatrix })
   }

   public async onGameUpdate(
      socket: Socket,
      listener: (updatedGameValues: { matrix: GameMatrix }) => void
   ) {
      socket.on("on_game_update", (updatedGameValues) => {
         listener(updatedGameValues)
      })
   }

   public async onStartGame(
      socket: Socket,
      listener: (options: StartGame) => void
   ) {
      socket.on("start_game", (options) => {
         listener(options)
      })
   }

   public async gameWin(
      socket: Socket,
      message: string,
      winingCells: WiningCells | null
   ) {
      socket.emit("game_win", { message, winingCells })
   }

   // listener: (message: string, winingCells: WiningCells) => void
   public async onGameWin(
      socket: Socket,
      listener: (options: MessageReceived) => void
   ) {
      socket.on("on_game_win", (options) => {
         return listener(options)
      })
   }
}

export default new GameService()
