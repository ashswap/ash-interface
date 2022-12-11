import BigNumber from "bignumber.js";
import { ElrondStruct, ElrondType } from "./elrond";

export interface VELocked {
    balance: BigNumber;
    end: number;
}

export const VELockedStruct: ElrondStruct<VELocked> = {
    "1_balance": ElrondType.BIG_UINT,
    "2_end": ElrondType.U_64
} 