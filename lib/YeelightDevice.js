"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.YeelightDevice = YeelightDevice;
