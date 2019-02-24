import { Socket } from "net";
import { IYeelightDeviceFields } from "./YeelightInterfaces";
export declare class YeelightDevice implements IYeelightDeviceFields {
    id: string;
    location: string;
    host: string;
    port: number;
    socket: Socket | null;
    connected: boolean;
    brightness: any;
    hue: any;
    model: any;
    power: boolean;
    rgbDec: any;
    saturation: any;
    constructor(params?: {
        id: string;
        location: string;
        host: string;
        port: number;
    });
    turnOn(): Promise<void>;
    turnOff(): Promise<void>;
    toggle(): Promise<void>;
    connect(): Promise<boolean>;
    sendCommand(command: any): Promise<void>;
}
