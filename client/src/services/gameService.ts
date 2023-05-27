import { Socket } from "socket.io-client"

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
}

export default new GameService()
