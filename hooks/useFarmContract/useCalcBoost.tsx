import { getProxyProvider } from "@elrondnetwork/dapp-core";
import {
    Address,
    AddressValue,
    ContractFunction,
    ProxyProvider,
    Query,
} from "@elrondnetwork/erdjs/out";
import { accAddressState } from "atoms/dappState";
import { FarmToken } from "atoms/farmsState";
import {
    govLockedAmtState,
    govTotalSupplyVeASH,
    govUnlockTSState,
    govVeASHAmtState,
} from "atoms/govState";
import BigNumber from "bignumber.js";
import { FARM_DIV_SAFETY_CONST } from "const/farms";
import { queryContractParser } from "helper/serializer";
import { FarmBoostInfo, IFarm } from "interface/farm";
import moment from "moment";
import { useRecoilCallback } from "recoil";
import useGetSlopeUsed from "./useGetSlopeUsed";

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

                const boostedFarmAmount = BigNumber.min(
                    lpAmt
                        .multipliedBy(0.4)
                        .plus(
                            farmingLocked
                                .multipliedBy(veForBoost)
                                .multipliedBy(0.6)
                                .div(veSupply)
                        ),
                    lpAmt
                );
                const boost = boostedFarmAmount.div(lpAmt).div(0.4).toNumber();
                return {
                    veForBoost,
                    boost
                };
            },
        []
    );

    return func;
};

export default useCalcBoost;
