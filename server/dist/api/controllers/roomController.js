"use strict"
var __decorate =
   (this && this.__decorate) ||
   function (decorators, target, key, desc) {
      var c = arguments.length,
         r =
            c < 3
               ? target
               : desc === null
               ? (desc = Object.getOwnPropertyDescriptor(target, key))
               : desc,
         d
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
         r = Reflect.decorate(decorators, target, key, desc)
      else
         for (var i = decorators.length - 1; i >= 0; i--)
            if ((d = decorators[i]))
               r =
                  (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) ||
                  r
      return c > 3 && r && Object.defineProperty(target, key, r), r
   }
var __metadata =
   (this && this.__metadata) ||
   function (k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
         return Reflect.metadata(k, v)
   }
var __param =
   (this && this.__param) ||
   function (paramIndex, decorator) {
      return function (target, key) {
         decorator(target, key, paramIndex)
      }
   }
var __awaiter =
   (this && this.__awaiter) ||
   function (thisArg, _arguments, P, generator) {
      function adopt(value) {
         return value instanceof P
            ? value
            : new P(function (resolve) {
                 resolve(value)
              })
      }
      return new (P || (P = Promise))(function (resolve, reject) {
         function fulfilled(value) {
            try {
               step(generator.next(value))
            } catch (e) {
               reject(e)
            }
         }
         function rejected(value) {
            try {
               step(generator["throw"](value))
            } catch (e) {
               reject(e)
            }
         }
         function step(result) {
            result.done
               ? resolve(result.value)
               : adopt(result.value).then(fulfilled, rejected)
         }
         step((generator = generator.apply(thisArg, _arguments || [])).next())
      })
   }
Object.defineProperty(exports, "__esModule", { value: true })
exports.RoomController = void 0
const socket_controllers_1 = require("socket-controllers")
const socket_io_1 = require("socket.io")
let RoomController = class RoomController {
   onConnection(socket, io) {
      console.info("New Socket connected to RoomController: ", socket.id)
   }
   joinGame(socket, io, message) {
      return __awaiter(this, void 0, void 0, function* () {
         console.info(
            "new user joining room: " + socket.id,
            " ",
            "Message: ",
            message
         )
         const connectedSocketsBeforePlayerJoined =
            io.sockets.adapter.rooms.get(message.roomId)
         const socketRooms = Array.from(socket.rooms.values()).filter(
            (room) => room !== socket.id
         )
         // checking if there are any rooms. If there are rooms, then I want to check if only 2 sockets are connected to it
         // if 2 sockets are already connected, then show the room is full error message
         if (
            socketRooms.length > 0 ||
            (connectedSocketsBeforePlayerJoined &&
               connectedSocketsBeforePlayerJoined.size === 2)
         ) {
            socket.emit("room_join_error", {
               error: "Room is full. Please choose another room to play from.",
            })
         } else {
            yield socket.join(message.roomId)
            socket.emit("room_joined")
            const connectedSocketsSizeAfterPlayerJoined =
               io.sockets.adapter.rooms.get(message.roomId).size
            if (connectedSocketsSizeAfterPlayerJoined < 2) return
            setTimeout(() => {
               // Only the last person who joined the room will receive
               // this event and payload in there  socket
               socket.emit("start_game", {
                  symbol: "o",
                  currentTurn: false,
               })
               // Except for the senders socket(last person joined in this case),
               // everyone who joined the room will receive this event and payload in there socket
               // roomId is the same as a roomName
               socket
                  .to(message.roomId)
                  .emit("start_game", { symbol: "x", currentTurn: true })
            }, 1000)
         }
      })
   }
}
__decorate(
   [
      (0, socket_controllers_1.OnConnect)(),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [socket_io_1.Socket, socket_io_1.Server]),
      __metadata("design:returntype", void 0),
   ],
   RoomController.prototype,
   "onConnection",
   null
)
__decorate(
   [
      (0, socket_controllers_1.OnMessage)("join_game"), // Add this decorator
      __param(0, (0, socket_controllers_1.ConnectedSocket)()),
      __param(1, (0, socket_controllers_1.SocketIO)()),
      __param(2, (0, socket_controllers_1.MessageBody)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [
         socket_io_1.Socket,
         socket_io_1.Server,
         Object,
      ]),
      __metadata("design:returntype", Promise),
   ],
   RoomController.prototype,
   "joinGame",
   null
)
RoomController = __decorate(
   [(0, socket_controllers_1.SocketController)()],
   RoomController
)
exports.RoomController = RoomController
