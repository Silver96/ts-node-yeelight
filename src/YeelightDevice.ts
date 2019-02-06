import * as net from 'net';
import { Socket } from 'net';
import { IYeelightDeviceFields } from './YeelightInterfaces';

export class YeelightDevice implements IYeelightDeviceFields {

    public id!: string;
    public location!: string;
    public host!: string;
    public port!: number;

    public socket: Socket | null = null;

    public connected: boolean = false;
    public brightness: any;
    public hue: any;
    public model: any;
    public power: any;
    public rgbDec: any;
    public saturation: any;

    constructor(params?: { id: string, location: string, host: string, port: number }) {
        if (params) {
            this.id = params.id;
            this.location = params.location;
            this.host = params.host;
            this.port = params.port;
        }
    }

    public async turnOn() {
        let request = {
            id: 1,
            method: 'set_power',
            params: ['on', 'smooth', 300],
        }

        await this.sendCommand(request);
    }

    public async turnOff() {
        let request = {
            id: 1,
            method: 'set_power',
            params: ['off', 'smooth', 300],
        }

        await this.sendCommand(request);
    }

    public toggle() {
        if (this.power === 'on') {
            this.turnOff();
        } else {
            this.turnOn()
        }
    }

    public connect() {
        if (this.connected === false && this.socket === null) {
            this.socket = new net.Socket();

            this.socket.connect(this.port, this.host, () => {
                this.connected = true;
            });
        }
    }

    public async sendCommand(command: any) {
        if (this.connected === false || this.socket === null) {
            console.log(`${this.id} is not connected, can't send command`);
            return;
        }
        let message = JSON.stringify(command);
        this.socket.write(message + '\r\n');
    }

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

}
