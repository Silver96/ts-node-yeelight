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
const dgram_as_promised_1 = require("dgram-as-promised");
const events_1 = require("events");
const ip = require("ip");
const net = require("net");
const YeelightDevice_1 = require("./YeelightDevice");
const YeelightOptions_1 = require("./YeelightOptions");
class Yeelight extends events_1.EventEmitter {
    constructor(options = {}) {
        super();
        this.devices = [];
        this.discoveryTimeout = null;
        this.socket = dgram_as_promised_1.createSocket("udp4");
        this.socket.socket.on("message", this.messageCallback.bind(this));
        this.options = new YeelightOptions_1.YeelightOptions(options);
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promise = this.socket.bind(this.options.listenPort, this.options.listenAddress);
                return promise.then(() => {
                    this.socket.setBroadcast(true);
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.socket.close();
        });
    }
    discover() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMessage(this.options.discoveryMsg, this.options.discoveryAddress);
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.emit("discoverycompleted");
                    this.socket.socket.close();
                    this.discoveryTimeout = null;
                    resolve();
                }, this.options.discoveryTimeoutSeconds * 1000);
            });
        });
    }
    connect(device) {
        if (device.connected === false && device.socket === null) {
            device.socket = new net.Socket();
            device.socket.connect(device.port, device.host, () => {
                device.connected = true;
                this.emit("deviceconnected", device);
            });
        }
    }
    sendMessage(message, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = Buffer.from(message);
            return this.socket.send(buffer, 0, buffer.length, this.options.discoveryPort, address);
        });
    }
    addDevice(device) {
        let index = this.devices.findIndex((item) => item.id === device.id);
        let event = "";
        if (index >= 0) {
            this.devices[index] = device;
            event = "deviceupdated";
        }
        else {
            index = this.devices.push(device);
            event = "deviceadded";
        }
        this.emit(event, { index, device });
    }
    handleDiscovery(message) {
        const headers = message.toString().split("\r\n");
        const device = new YeelightDevice_1.YeelightDevice();
        device.connected = false;
        device.socket = null;
        // build device params
        for (const header of headers) {
            if (header.indexOf("id:") >= 0) {
                device.id = header.slice(4);
            }
            if (header.indexOf("Location:") >= 0) {
                device.location = header.slice(10);
                const tmp = device.location.split(":");
                device.host = tmp[1].replace("//", "");
                device.port = parseInt(tmp[2], 10);
            }
            if (header.indexOf("power:") >= 0) {
                device.power = header.slice(7);
            }
            if (header.indexOf("bright:") >= 0) {
                device.brightness = header.slice(8);
            }
            if (header.indexOf("model:") >= 0) {
                device.model = header.slice(7);
            }
            if (header.indexOf("rgb:") >= 0) {
                device.rgbDec = header.slice(5);
                // console.log(rgb_dec);
                // if (rgb_dec > 0) {
                //     var rgb = [
                //         (rgb_dec >> 16) & 0xff,
                //         (rgb_dec >> 8) & 0xff,
                //         rgb_dec & 0xff,
                //     ];
                //     device.rgb = rgb;
                // }
            }
            if (header.indexOf("hue:") >= 0) {
                device.hue = header.slice(5);
            }
            if (header.indexOf("sat:") >= 0) {
                device.saturation = header.slice(5);
            }
        }
        this.addDevice(device);
        if (this.discoveryTimeout) {
            clearTimeout(this.discoveryTimeout);
        }
    }
    messageCallback(message, address) {
        if (ip.address() === address.address) {
            return;
        }
        // handle socket discovery message
        this.handleDiscovery(message);
        this.emit("message", { message, address });
    }
}
exports.Yeelight = Yeelight;
