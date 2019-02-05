import { Socket } from "net";

export interface IYeelightOptionFields {
    listenPort?: number;
    listenAddress?: string;

    discoveryPort?: number;
    discoveryAddress?: string;
    discoveryMsg?: string;
    discoveryTimeoutSeconds?: number;
}

export interface IYeelightDeviceFields {
    id: string;
    location: string;
    host: string;
    port: number;
    socket: Socket | null;

    connected: boolean;

    power: any;
    brightness: any;
    model: any;
    rgbDec: any;
    hue: any;
    saturation: any;
}
