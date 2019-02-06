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
}
