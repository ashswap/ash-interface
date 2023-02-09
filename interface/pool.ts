import { IESDTInfo } from "helper/token/token";

export enum EPoolType {
    PlainPool, LendingPool, MetaPool, PoolV2
}
export default interface IPool {
    address: string;
    tokens: IESDTInfo[];
    lpToken: IESDTInfo;
    isMaiarPool?: boolean;
    type: EPoolType;
}
