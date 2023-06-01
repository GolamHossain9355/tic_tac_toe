"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
var socket_controllers_1 = require("socket-controllers");
var socket_io_1 = require("socket.io");
var GameController = exports.GameController = /** @class */ (function () {
    function GameController() {
    }
    GameController.prototype.getSocketGameRoom = function (socket) {
        // potential optimizations may be available for using find instead of filter
        var socketRooms = Array.from(socket.rooms.values()).filter(function (room) { return room !== socket.id; });
        var gameRoom = socketRooms && socketRooms[0];
        return gameRoom;
    };
    GameController.prototype.onConnection = function (socket, io) {
        console.log("New Socket connected to GameController: ", socket.id);
    };
    GameController.prototype.updateGame = function (socket, io, message) {
        return __awaiter(this, void 0, void 0, function () {
            var gameRoom;
            return __generator(this, function (_a) {
                gameRoom = this.getSocketGameRoom(socket);
                // every socket in the room except the socket that sent this event
                // will receive this event and payload(in this case it is an update
                // to the ticTacToe game board, GameMatrix)
                socket.to(gameRoom).emit("on_game_update", message);
                return [2 /*return*/];
            });
        });
    };
    GameController.prototype.gameWin = function (socket, io, message) {
        return __awaiter(this, void 0, void 0, function () {
            var gameRoom;
            return __generator(this, function (_a) {
                gameRoom = this.getSocketGameRoom(socket);
                // every socket in the room except the socket that sent this event
                // will receive this event and payload(in this case it is an update
                // to the ticTacToe game board, GameMatrix)
                socket.to(gameRoom).emit("on_game_win", message);
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        (0, socket_controllers_1.OnConnect)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Socket, socket_io_1.Server]),
        __metadata("design:returntype", void 0)
    ], GameController.prototype, "onConnection", null);
    __decorate([
        (0, socket_controllers_1.OnMessage)("update_game") // Add this decorator
        ,
        __param(0, (0, socket_controllers_1.ConnectedSocket)()),
        __param(1, (0, socket_controllers_1.SocketIO)()),
        __param(2, (0, socket_controllers_1.MessageBody)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Socket,
            socket_io_1.Server, Object]),
        __metadata("design:returntype", Promise)
    ], GameController.prototype, "updateGame", null);
    __decorate([
        (0, socket_controllers_1.OnMessage)("game_win") // Add this decorator
        ,
        __param(0, (0, socket_controllers_1.ConnectedSocket)()),
        __param(1, (0, socket_controllers_1.SocketIO)()),
        __param(2, (0, socket_controllers_1.MessageBody)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Socket,
            socket_io_1.Server, Object]),
        __metadata("design:returntype", Promise)
    ], GameController.prototype, "gameWin", null);
    GameController = __decorate([
        (0, socket_controllers_1.SocketController)()
    ], GameController);
    return GameController;
}());
