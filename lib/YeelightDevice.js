"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
class YeelightDevice {
    constructor(params) {
        this.socket = null;
        this.connected = false;
        if (params) {
            this.id = params.id;
            this.location = params.location;
            this.host = params.host;
            this.port = params.port;
        }
    }
    turnOn() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                id: 1,
                method: "set_power",
                params: ["on", "smooth", 300],
            };
            yield this.sendCommand(request);
        });
    }
    turnOff() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                id: 1,
                method: "set_power",
                params: ["off", "smooth", 300],
            };
            yield this.sendCommand(request);
        });
    }
    toggle() {
        if (this.power === "on") {
            this.turnOff();
        }
        else {
            this.turnOn();
        }
    }
    connect() {
        if (this.connected === false && this.socket === null) {
            this.socket = new net.Socket();
            this.socket.connect(this.port, this.host, () => {
                this.connected = true;
            });
        }
    }
    sendCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connected === false || this.socket === null) {
                // console.log(`${this.id} is not connected, can't send command`);
                return;
            }
            const message = JSON.stringify(command);
            this.socket.write(message + "\r\n");
        });
    }
}
exports.YeelightDevice = YeelightDevice;
