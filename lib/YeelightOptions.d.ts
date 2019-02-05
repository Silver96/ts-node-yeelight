import { IYeelightOptionFields } from "./YeelightInterfaces";
export declare class YeelightOptions implements IYeelightOptionFields {
    listenPort: number;
    listenAddress: string;
    discoveryPort: number;
    discoveryAddress: string;
    discoveryMsg: string;
    discoveryTimeoutSeconds: number;
    constructor(fields?: IYeelightOptionFields);
}
