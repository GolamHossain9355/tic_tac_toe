import { Socket } from "socket.io-client"
import { GameMatrix, StartGame, WiningCells } from "../components/Game"

type MessageReceived = {
   message: string
   winingCells: WiningCells
}

type ResetGame = {
   message: string
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

   public async updateGame(
      socket: Socket,
      gameMatrix: GameMatrix,
      isResettingGame: boolean
   ) {
      socket.emit("update_game", {
         matrix: gameMatrix,
         resettingGame: isResettingGame,
      })
   }

   public async onGameUpdate(
      socket: Socket,
      listener: (updatedGameValues: {
         matrix: GameMatrix
         resettingGame: boolean
      }) => void
   ) {
      socket.on("on_game_update", (updatedGameValues) => {
         console.log("here game service")
         return listener(updatedGameValues)
      })
   }

   public async onStartGame(
      socket: Socket,
      listener: (options: StartGame) => void
   ) {
      socket.on("start_game", (options) => {
         return listener(options)
      })
   }

   public async gameWin(
      socket: Socket,
      message: string,
      winingCells: WiningCells | null
   ) {
      socket.emit("game_win", { message, winingCells })
   }

   public async onGameWin(
      socket: Socket,
      listener: (options: MessageReceived) => void
   ) {
      socket.on("on_game_win", (options) => listener(options))
   }

   public async gameReset(socket: Socket) {
      const message = "Reset game"
      socket.emit("game_reset", message)
   }

   public async onGameReset(
      socket: Socket,
      listener: (options: ResetGame) => void
   ) {
      socket.on("on_game_reset", (options) => listener(options))
   }
}

export default new GameService()
