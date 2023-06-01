"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const mainController_1 = require("./api/controllers/mainController");
const roomController_1 = require("./api/controllers/roomController");
const gameController_1 = require("./api/controllers/gameController");
exports.default = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
        },
    });
    io.on("connection", (socket) => {
        // Instantiate your controllers and pass the socket and io instances
        const mainController = new mainController_1.MainController();
        const roomController = new roomController_1.RoomController();
        const gameController = new gameController_1.GameController();
        mainController.onConnection(socket, io);
        roomController.onConnection(socket, io);
        gameController.onConnection(socket, io);
        socket.on("join_game", (message) => __awaiter(void 0, void 0, void 0, function* () {
            // console.info("Received join_game event with message:", message)
            yield roomController.joinGame(socket, io, message);
        }));
        socket.on("update_game", (message) => __awaiter(void 0, void 0, void 0, function* () {
            // console.info("Received update_game event with message:", message)
            yield gameController.updateGame(socket, io, message);
        }));
        socket.on("game_win", (message) => __awaiter(void 0, void 0, void 0, function* () {
            yield gameController.gameWin(socket, io, message);
        }));
    });
    return io;
};
