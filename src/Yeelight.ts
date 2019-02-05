import { createSocket, SocketAsPromised } from "dgram-as-promised";
import { EventEmitter } from "events";
import * as ip from "ip";
import { AddressInfo } from "net";
import * as net from "net";

import { YeelightDevice } from "./YeelightDevice";
import { IYeelightOptionFields } from "./YeelightInterfaces";
import { YeelightOptions } from "./YeelightOptions";

export class Yeelight extends EventEmitter {
    public options: YeelightOptions;
    public devices: YeelightDevice[] = [];

    private socket: SocketAsPromised;
    private discoveryTimeout: number | null = null;

    constructor(options: IYeelightOptionFields = {}) {
        super();
        this.socket = createSocket("udp4");
        this.socket.socket.on("message", this.messageCallback.bind(this));
        this.options = new YeelightOptions(options);
    }

    public async listen() {
        try {
            const promise = this.socket.bind(this.options.listenPort, this.options.listenAddress);
            return promise.then(() => {
                this.socket.setBroadcast(true);
            });
        } catch (e) {
            throw e;
        }
    }

    public async close() {
        return this.socket.close();
    }

    public async discover() {
        await this.sendMessage(this.options.discoveryMsg, this.options.discoveryAddress);
        return new Promise((resolve) => {
            setTimeout(() => {
                this.emit("discoverycompleted");
                this.socket.socket.close();
                this.discoveryTimeout = null;
                resolve();
            }, this.options.discoveryTimeoutSeconds * 1000);
        });
    }

    public connect(device: YeelightDevice) {
        if (device.connected === false && device.socket === null) {
            device.socket = new net.Socket();

            device.socket.connect(device.port, device.host, () => {
                device.connected = true;

                this.emit("deviceconnected", device);
            });
        }
    }

    public async sendMessage(message: string, address: string) {
        const buffer = Buffer.from(message);
        return this.socket.send(buffer, 0, buffer.length, this.options.discoveryPort, address);
    }

    public addDevice(device: YeelightDevice) {
        let index = this.devices.findIndex((item) => item.id === device.id);
        let event = "";

        if (index >= 0) {
            this.devices[index] = device;
            event = "deviceupdated";
        } else {
            index = this.devices.push(device);
            event = "deviceadded";
        }

        this.emit(event, { index, device });
    }

    private handleDiscovery(message: string) {
        const headers = message.toString().split("\r\n");
        const device = new YeelightDevice();

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

    private messageCallback(message: string, address: AddressInfo) {
        if (ip.address() === address.address) {
            return;
        }

        // handle socket discovery message
        this.handleDiscovery(message);

        this.emit("message", { message, address });
    }
}
