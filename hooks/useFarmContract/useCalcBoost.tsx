import BigNumber from "bignumber.js";
import { calcYieldBoost } from "helper/farmBooster";
import { FarmBoostInfo } from "interface/farm";
import moment from "moment";
import { useRecoilCallback } from "recoil";

const useCalcBoost = () => {
    const func = useRecoilCallback(
        ({ snapshot, set }) =>
            async (
                slopeRefill: BigNumber,
                lpAmt: BigNumber,
                slopeUsed: BigNumber,
                veSupply: BigNumber,
                lockedAshAmt: BigNumber,
                unlockTs: BigNumber,
                farmingLocked: BigNumber,
                farmSupply: BigNumber,
                farmBalance: BigNumber,
            ) => {
                const currentTs = moment().unix();
                const boostInfo: FarmBoostInfo = {
                    veForBoost: new BigNumber(0),
                    boost: 1,
                };
                if (unlockTs.lt(currentTs)) {
                    return boostInfo;
                }

                const slopeForBoost = BigNumber.max(
                    lockedAshAmt
                        .div(4 * 365 * 24 * 3600)
                        .minus(slopeUsed.minus(slopeRefill)),
                    slopeRefill
                );
                const veForBoost = slopeForBoost.multipliedBy(
                    unlockTs.minus(currentTs)
                );
                const veForMaxBoost = lpAmt
                    .multipliedBy(veSupply)
                    .div(farmingLocked);
                return {
                    veForBoost: BigNumber.min(veForBoost, veForMaxBoost),
                    boost: calcYieldBoost(lpAmt, farmingLocked, veForBoost, veSupply, farmSupply, farmBalance),
                };
            },
        []
    );

    return func;
};

export default useCalcBoost;
