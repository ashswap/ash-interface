import { IESDTInfo } from "helper/token/token";

export default interface IPool {
    address: string;
    tokens: IESDTInfo[];
    lpToken: IESDTInfo;
    isMaiarPool?: boolean;
}
