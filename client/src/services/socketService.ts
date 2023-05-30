import { Socket, io } from "socket.io-client"

class SocketService {
   public socket: Socket | null = null

   public connect(url: string): Promise<Socket> {
      return new Promise((resolve, reject) => {
         this.socket = io(url, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
         })

         console.info("Connecting to socket")
         if (!this.socket) reject()

         this.socket.on("connect", () => {
            resolve(this.socket as Socket)
            console.info("socket connected")
         })

         this.socket.on("disconnect", (reason) => {
            console.info("Disconnected. Reason:", reason)
            reject(reason)
         })

         this.socket.on("connect_error", (err) => {
            console.info("Connection error: ", err)
            reject(err)
         })
      })
   }
}

export default new SocketService()
