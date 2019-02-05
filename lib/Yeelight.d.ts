import { EventEmitter } from "events";
import { YeelightDevice } from "./YeelightDevice";
import { IYeelightOptionFields } from "./YeelightInterfaces";
import { YeelightOptions } from "./YeelightOptions";
export declare class Yeelight extends EventEmitter {
    options: YeelightOptions;
    devices: YeelightDevice[];
    private socket;
    private discoveryTimeout;
    constructor(options?: IYeelightOptionFields);
    listen(): Promise<void>;
    close(): Promise<void>;
    discover(): Promise<{}>;
    connect(device: YeelightDevice): void;
    sendMessage(message: string, address: string): Promise<number>;
    addDevice(device: YeelightDevice): void;
    private handleDiscovery;
    private messageCallback;
}
