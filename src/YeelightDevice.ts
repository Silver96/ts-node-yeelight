import { Socket } from "net";
import { IYeelightDeviceFields } from "./YeelightInterfaces";

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
}
