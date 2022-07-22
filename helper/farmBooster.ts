import { FarmToken } from "atoms/farmsState";
import BigNumber from "bignumber.js";
import { IFarm } from "interface/farm";
import { toEGLDD } from "./balance";

export const calcYieldBoost = (
    lpAmt: BigNumber,
    totalLP: BigNumber,
    ve: BigNumber,
    totalVe: BigNumber,
    farmSupply: BigNumber,
    existFarmTokenBal: BigNumber,
) => {
    const base = lpAmt.multipliedBy(0.4);
    const farmBase = farmSupply.plus(base).minus(existFarmTokenBal);
    const _boosted = lpAmt
        .multipliedBy(0.4)
        .plus(totalLP.multipliedBy(0.6).multipliedBy(ve).div(totalVe));
    const boosted = BigNumber.min(_boosted, lpAmt);
    const farmBoost = farmSupply.plus(boosted).minus(existFarmTokenBal);
    return +boosted.div(farmBoost).div(base.div(farmBase)).toFixed(2) || 1;
};

export const calcYieldBoostFromFarmToken = (
    farmTokenSupply: BigNumber,
    farmBalance: BigNumber,
    lpAmt: BigNumber,
    farm: IFarm
) => {
    const base = toEGLDD(farm.farming_token_decimal, lpAmt).multipliedBy(0.4);
    return (
        +farmBalance
            .div(farmTokenSupply)
            .div(
                base.div(
                    toEGLDD(
                        farm.farm_token_decimal,
                        farmTokenSupply.minus(farmBalance)
                    ).plus(base)
                )
            )
            .toFixed(2) || 1
    );
};
