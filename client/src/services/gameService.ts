import { Socket } from "socket.io-client"
import {
   GameInfo,
   GameMatrix,
   GameResult,
   StartGame,
   WiningCells,
} from "../components/Game"

type MessageReceived = {
   message: string
   winingCells: WiningCells
   isPlayerTurnReset: boolean
   newGameInfo: GameInfo
}

type ResetGame = {
   gameInfo: GameInfo
   matrixReset: GameMatrix
   gameResultReset: GameResult
   winingCellsReset: WiningCells
   receivedLostWonOrTieMsgReset: null
   isGameStartedReset: boolean
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
      socket.emit("update_game", {
         matrix: gameMatrix,
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
      winingCells: WiningCells | null,
      isPlayerTurnReset: boolean,
      newGameInfo: GameInfo
   ) {
      socket.emit("game_win", {
         message,
         winingCells,
         isPlayerTurnReset,
         newGameInfo,
      })
   }

   public async onGameWin(
      socket: Socket,
      listener: (options: MessageReceived) => void
   ) {
      socket.on("on_game_win", (options) => listener(options))
   }

   public async gameReset(socket: Socket, message: ResetGame) {
      socket.emit("game_reset", message)
   }

   public async onGameReset(
      socket: Socket,
      listener: (options: ResetGame) => void
   ) {
      socket.on("on_game_reset", (options) => {
         return listener(options)
      })
   }
}

export default new GameService()
