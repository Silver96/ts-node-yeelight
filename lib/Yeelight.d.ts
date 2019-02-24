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
    init(): void;
    listen(): Promise<void>;
    close(): Promise<void>;
    discover(): Promise<{}>;
    sendMessage(message: string, address: string): Promise<number | undefined>;
    addDevice(device: YeelightDevice): void;
    private handleDiscovery;
    private messageCallback;
}
