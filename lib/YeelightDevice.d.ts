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
    power: any;
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
    toggle(): void;
    connect(): void;
    sendCommand(command: any): Promise<void>;
}
