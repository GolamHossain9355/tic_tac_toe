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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
var socket_io_1 = require("socket.io");
var socket_controllers_1 = require("socket-controllers");
var MainController = exports.MainController = /** @class */ (function () {
    function MainController() {
    }
    MainController.prototype.onConnection = function (socket, io) {
        console.log("New Socket connected to MainController:  ", socket.id);
    };
    __decorate([
        (0, socket_controllers_1.OnConnect)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Socket, socket_io_1.Server]),
        __metadata("design:returntype", void 0)
    ], MainController.prototype, "onConnection", null);
    MainController = __decorate([
        (0, socket_controllers_1.SocketController)()
    ], MainController);
    return MainController;
}());
