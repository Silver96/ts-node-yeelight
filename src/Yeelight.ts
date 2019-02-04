// @ts-ignore
import { createSocket, SocketAsPromised } from 'dgram-as-promised';
import * as ip from 'ip';
import * as net from 'net';
import { EventEmitter } from 'events';
import Timeout = NodeJS.Timeout;

export interface YeelightOptionFields {
    listenPort?: number;
    listenAddress?: string;

    discoveryPort?: number;
    discoveryAddress?: string;
    discoveryMsg?: string;
    discoveryTimeoutSeconds?: number;
}

export class YeelightOptions implements YeelightOptionFields {

    listenPort: number;
    listenAddress: string;

    discoveryPort: number;
    discoveryAddress: string;
    discoveryMsg: string;
    discoveryTimeoutSeconds: number;

    constructor(fields: YeelightOptionFields = {}) {
        Object.assign(this, {
            listenPort: 45065,
            listenAddress: '0.0.0.0',
            discoveryPort: 1982,
            discoveryAddress: '239.255.255.250',
            discoveryMsg: 'M-SEARCH * HTTP/1.1\r\nMAN: \"ssdp:discover\"\r\nST: wifi_bulb\r\n',
            discoveryTimeoutSeconds: 5,
        }, fields);
    }

    //
    //
    // Yeelight.prototype.setPower = function (device, state, speed) {
    //     speed = speed || 300;
    //
    //     var on_off = state === true ? 'on' : 'off';
    //     device.power = on_off;
    //
    //     var request = {
    //         id: 1,
    //         method: 'set_power',
    //         params: [on_off, 'smooth', speed],
    //     };
    //
    //     this.sendCommand(device, request, function (device) {
    //         this.emit('powerupdated', device);
    //     }.bind(this));
    // };
    //
    // Yeelight.prototype.setBrightness = function (device, percentage, speed) {
    //     speed = speed || 300;
    //
    //     if (device.power == 'off') {
    //         device.brightness = '0';
    //         this.setPower(device, true, 0);
    //     }
    //
    //     device.brightness = percentage;
    //
    //     var request = {
    //         id: 1,
    //         method: 'set_bright',
    //         params: [percentage, 'smooth', speed],
    //     };
    //
    //     this.sendCommand(device, request, function (device) {
    //         this.emit('brightnessupdated', device);
    //     }.bind(this));
    // };
    //
    // Yeelight.prototype.setRGB = function (device, rgb, speed) {
    //     speed = speed || 300;
    //
    //     var rgb_dec = (rgb[0] * 65536) + (rgb[1] * 256) + rgb[2];
    //
    //     device.rgb = rgb_dec;
    //
    //     var request = {
    //         id: 1,
    //         method: 'set_rgb',
    //         params: [rgb_dec, 'smooth', speed],
    //     };
    //
    //     this.sendCommand(device, request, function (device) {
    //         this.emit('rgbupdated', device);
    //     }.bind(this));
    // };
    //
    // Yeelight.prototype.sendCommand = function (device, command, callback) {
    //     if (device.connected === false && device.socket === null) {
    //         console.log('Connection broken ' + device.connected + '\n' + device.socket);
    //         this.emit('devicedisconnected', device);
    //         return;
    //     }
    //
    //     var message = JSON.stringify(command);
    //
    //     device.socket.write(message + '\r\n');
    //
    //     if (typeof callback !== 'undefined') {
    //         callback(device);
    //     }
    // };

}

export class YeelightDevice {
    id: string;
    location: string;
    connected: boolean;

    host: string;
    port: number;
    socket: SocketAsPromised;//Socket;

    power: any;
    brightness: any;
    model: any;
    rgb_dec: any;
    hue: any;
    saturation: any;

    constructor(fields?: { [k: string]: any }) {
        if (!fields) {
            fields = {};
        }
        Object.assign(this, fields);
    }
}

export default class Yeelight extends EventEmitter {

    private socket: SocketAsPromised;
    private discoveryTimeout: Timeout;
    options: YeelightOptions;
    devices: YeelightDevice[] = [];

    constructor(options: YeelightOptionFields = {}) {
        super();
        this.socket = createSocket('udp4');
        this.socket.socket.on('message', this.messageCallback.bind(this));
        this.options = new YeelightOptions(options);
    }

    public async listen() {
        try {
            await this.socket.bind(this.options.listenPort, this.options.listenAddress);
            this.socket.setBroadcast(true);
            this.emit('ready', this.options.listenPort);
        } catch (e) {
            throw e;
        }
    }

    public async discover() {
        await this.sendMessage(this.options.discoveryMsg, this.options.discoveryAddress);
        this.discoveryTimeout = setTimeout(() => {
            this.emit('discoverycompleted');
            this.socket.socket.close();
        }, this.options.discoveryTimeoutSeconds * 1000);
    }

    public connect(device) {
        if (device.connected === false && device.socket === null) {
            device.socket = new net.Socket();

            device.socket.connect(device.port, device.host, () => {
                device.connected = true;

                this.emit('deviceconnected', device);
            });
        }
    }

    public async sendMessage(message: string, address: string) {
        const buffer = Buffer.from(message);
        return this.socket.send(buffer, 0, buffer.length, this.options.discoveryPort, address);
    }

    private handleDiscovery(message: string, address: string) {
        const headers = message.toString().split('\r\n');
        const device = new YeelightDevice();

        device.connected = false;
        device.socket = null;

        // build device params
        for (let i = 0; i < headers.length; i++) {
            if (headers[i].indexOf('id:') >= 0)
                device.id = headers[i].slice(4);
            if (headers[i].indexOf('Location:') >= 0) {
                device.location = headers[i].slice(10);
                let tmp = device.location.split(':');
                device.host = tmp[1].replace('//', '');
                device.port = parseInt(tmp[2], 10);
            }
            if (headers[i].indexOf('power:') >= 0)
                device.power = headers[i].slice(7);
            if (headers[i].indexOf('bright:') >= 0)
                device.brightness = headers[i].slice(8);
            if (headers[i].indexOf('model:') >= 0)
                device.model = headers[i].slice(7);
            if (headers[i].indexOf('rgb:') >= 0) {
                device.rgb_dec = headers[i].slice(5);
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
            if (headers[i].indexOf('hue:') >= 0)
                device.hue = headers[i].slice(5);
            if (headers[i].indexOf('sat:') >= 0)
                device.saturation = headers[i].slice(5);
        }

        this.addDevice(device);
        this.discoveryTimeout.refresh();
    }

    public addDevice(device: YeelightDevice) {
        let index = this.devices.findIndex((item) => item.id === device.id);
        let event = '';

        if (index >= 0) {
            this.devices[index] = device;
            event = 'deviceupdated';
        } else {
            index = this.devices.push(device);
            event = 'deviceadded';
        }

        this.emit(event, { index, device });
    }

    private messageCallback(message, address) {
        if (ip.address() == address.address) {
            return;
        }

        // handle socket discovery message
        this.handleDiscovery(message, address);

        this.emit('message', { message, address });
    }
}