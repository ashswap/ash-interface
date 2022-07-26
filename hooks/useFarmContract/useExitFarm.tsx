import { TokenPayment as TokenPaymen } from "@elrondnetwork/erdjs/out";
import { accIsLoggedInState } from "atoms/dappState";
import {
    farmQuery,
    farmRecordsState,
    farmSessionIdMapState,
    FarmToken,
} from "atoms/farmsState";
import BigNumber from "bignumber.js";
import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { IFarm } from "interface/farm";
import { useRecoilCallback } from "recoil";
const calcUnstakeEntries = (weiAmt: BigNumber, farmTokens: FarmToken[]) => {
    let sum = new BigNumber(0);
    return farmTokens
        .map((ft) => {
            if (sum.gte(weiAmt)) {
                return { unstakeAmt: new BigNumber(0), farmToken: ft };
            }
            const remain = weiAmt.minus(sum);
            const lpBalance = ft.balance
                .div(ft.perLP)
                .integerValue(BigNumber.ROUND_FLOOR);
            const amt = lpBalance.lte(remain) ? lpBalance : remain;
            sum = sum.plus(amt);
            return {
                unstakeAmt: amt.eq(remain)
                    ? amt
                          .multipliedBy(ft.perLP)
                          .integerValue(BigNumber.ROUND_FLOOR)
                    : ft.balance,
                farmToken: ft,
            };
        })
        .filter(({ unstakeAmt }) => unstakeAmt.gt(0));
};
const calcUnstakeEntries2 = (weiAmt: BigNumber, farmTokens: FarmToken[]) => {
    let sum = new BigNumber(0);
    return farmTokens
        .map((ft) => {
            if (sum.gte(weiAmt)) {
                return undefined;
            }
            const remain = weiAmt.minus(sum);
            const lpBalance = ft.balance
                .div(ft.perLP)
                .integerValue(BigNumber.ROUND_FLOOR);
            const amt = lpBalance.lte(remain) ? lpBalance : remain;
            sum = sum.plus(amt);
            return TokenPaymen.metaEsdtFromBigInteger(
                ft.collection,
                ft.nonce.toNumber(),
                amt.eq(remain)
                    ? amt
                          .multipliedBy(ft.perLP)
                          .integerValue(BigNumber.ROUND_FLOOR)
                    : ft.balance
            );
            // return {
            //     unstakeAmt: amt.eq(remain)
            //         ? amt
            //               .multipliedBy(ft.perLP)
            //               .integerValue(BigNumber.ROUND_FLOOR)
            //         : ft.balance,
            //     farmToken: ft,
            // };
        })
        .filter((tp) => typeof tp !== "undefined") as TokenPaymen[];
};
const useExitFarm = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const exitFarm = useRecoilCallback(
        ({ snapshot, set }) =>
            async (
                lpAmt: BigNumber,
                farm: IFarm,
                unstakeMax: boolean = false
            ) => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const farmRecord = await snapshot.getPromise(
                    farmQuery(farm.farm_address)
                );

                if (!loggedIn) return { sessionId: "" };
                const farmContract = ContractManager.getFarmContract(
                    farm.farm_address
                );
                if (!farmRecord || !farmRecord.stakedData)
                    return { sessionId: "" };
                const { stakedData } = farmRecord;
                const farmTokens = stakedData.farmTokens || [];
                const entries = unstakeMax
                    ? farmTokens.map((t) =>
                          TokenPaymen.metaEsdtFromBigInteger(
                              t.collection,
                              t.nonce.toNumber(),
                              t.balance
                          )
                      )
                    : calcUnstakeEntries2(lpAmt, farmTokens);
                const tx = await farmContract.exitFarm(entries);
                const payload: DappSendTransactionsPropsType = {
                    transactions: tx,
                    transactionsDisplayInfo: {
                        successMessage: `Unstake succeed ${toEGLDD(
                            farm.farming_token_decimal,
                            lpAmt
                        )} ${farm.farming_token_id}`,
                    },
                };
                const result = await sendTransactions(payload);
                if (result.sessionId)
                    set(farmSessionIdMapState, (val) => ({
                        ...val,
                        [farm.farm_address]: [
                            ...(val[farm.farm_address] || []),
                            result.sessionId!,
                        ],
                    }));
                return result;
            },
        [sendTransactions]
    );

    const estimateRewardOnExit = useRecoilCallback(
        ({ snapshot, set }) =>
            async (lpAmt: BigNumber, farm: IFarm) => {
                const farmRecords = await snapshot.getPromise(farmRecordsState);
                const farmRecord = farmRecords.find(
                    (val) => val.farm.farm_address === farm.farm_address
                );
                if (!farmRecord?.stakedData?.farmTokens.length)
                    return new BigNumber(0);
                const entries = calcUnstakeEntries(
                    lpAmt,
                    farmRecord.stakedData.farmTokens
                );
                const farmContract = ContractManager.getFarmContract(
                    farm.farm_address
                );
                const rewards = entries.map(({ unstakeAmt, farmToken }) =>
                    farmContract.calculateRewardsForGivenPosition(
                        unstakeAmt,
                        farmToken.attributes
                    )
                );
                const totalRewards = await Promise.all(rewards);
                return totalRewards.reduce(
                    (total, val) => total.plus(val),
                    new BigNumber(0)
                );
            },
        []
    );
    return { exitFarm, estimateRewardOnExit, trackingData, sessionId };
};

export default useExitFarm;
