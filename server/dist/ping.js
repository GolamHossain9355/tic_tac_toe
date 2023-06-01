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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
// Function to ping your server
function pingServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Replace `https://your-server-url` with the actual URL of your server
            const response = yield (0, node_fetch_1.default)("https://your-server-url");
            console.log(`Ping response: ${response.status}`);
        }
        catch (error) {
            console.error("Error pinging server:", error);
        }
    });
}
// Ping the server every 13 minutes (in milliseconds)
const pingInterval = 13 * 60 * 1000;
setInterval(pingServer, pingInterval);
