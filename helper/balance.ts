import BigNumber from "bignumber.js";
import { IESDTInfo } from "./token/token";

export const toWei = (token: IESDTInfo, valueStr: string) => {
    if (valueStr === "") {
        return new BigNumber(0);
    }

    let amount = new BigNumber(valueStr);
    if(amount.isNaN()) return new BigNumber(0);
    amount = new BigNumber(
        amount
            .multipliedBy(new BigNumber(10).exponentiatedBy(token.decimals))
            .toFixed(0)
    );

    if (amount.lt(0)) {
        return new BigNumber(0);
    }

    return amount.integerValue(BigNumber.ROUND_DOWN);
};

export const toEGLD = (token: IESDTInfo, valueStr: string) => {
    return toEGLDD(token.decimals, valueStr);
};

export const toEGLDD = (decimals: number, num: BigNumber.Value) => {
    if (num === "") {
        return new BigNumber(0);
    }

    let amount = new BigNumber(num);
    amount = amount.div(new BigNumber(10).exponentiatedBy(decimals));

    if (amount.lt(0)) {
        return new BigNumber(0);
    }

    return amount;
}