import BigNumber from "bignumber.js";
import { IToken } from "interface/token";

export const toWei = (token: IToken, valueStr: string) => {
    if (valueStr === "") {
        return new BigNumber(0);
    }

    let amount = new BigNumber(valueStr);
    amount = new BigNumber(
        amount
            .multipliedBy(new BigNumber(10).exponentiatedBy(token.decimals))
            .toFixed(0)
    );

    if (amount.lt(0)) {
        return new BigNumber(0);
    }

    return amount;
};

export const toEGLD = (token: IToken, valueStr: string) => {
    if (valueStr === "") {
        return new BigNumber(0);
    }

    let amount = new BigNumber(valueStr);
    amount = new BigNumber(
        amount
            .div(new BigNumber(10).exponentiatedBy(token.decimals))
            .toFixed(0)
    );

    if (amount.lt(0)) {
        return new BigNumber(0);
    }

    return amount;
};
