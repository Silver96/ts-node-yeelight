import { IYeelightOptionFields } from "./YeelightInterfaces";

export class YeelightOptions implements IYeelightOptionFields {

    public listenPort: number;
    public listenAddress: string;

    public discoveryPort: number;
    public discoveryAddress: string;
    public discoveryMsg: string;
    public discoveryTimeoutSeconds: number;

    constructor(fields: IYeelightOptionFields = {}) {
        this.listenPort = fields.listenPort ? fields.listenPort : 45065;
        this.listenAddress = fields.listenAddress ? fields.listenAddress : "0.0.0.0";
        this.discoveryPort = fields.discoveryPort ? fields.discoveryPort : 1982;
        this.discoveryAddress = fields.discoveryAddress ? fields.discoveryAddress : "239.255.255.250";
        this.discoveryMsg = fields.discoveryMsg ?
            fields.discoveryMsg :
            'M-SEARCH * HTTP/1.1\r\nMAN: \"ssdp:discover\"\r\nST: wifi_bulb\r\n';
        this.discoveryTimeoutSeconds = fields.discoveryTimeoutSeconds ? fields.discoveryTimeoutSeconds : 5;
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
