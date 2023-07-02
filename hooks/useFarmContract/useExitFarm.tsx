import { TokenTransfer } from "@multiversx/sdk-core/out";
import { accIsLoggedInState } from "atoms/dappState";
import {
    ashRawFarmQuery,
    farmNumberOfAdditionalRewards,
    farmQuery,
    farmRecordsState,
    farmSessionIdMapState,
    FarmToken,
} from "atoms/farmsState";
import BigNumber from "bignumber.js";
import { ASH_TOKEN, TOKENS_MAP } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import FarmContract from "helper/contracts/farmContract";
import { TokenAmount } from "helper/token/tokenAmount";
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
            return TokenTransfer.metaEsdtFromBigInteger(
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
        .filter((tp) => typeof tp !== "undefined") as TokenTransfer[];
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
                const numberOfAdditionalRewards = await snapshot.getPromise(
                    farmNumberOfAdditionalRewards(farm.farm_address)
                );

                if (!loggedIn) return { sessionId: "" };
                const farmContract = ContractManager.getFarmContract(
                    farm.farm_address
                ).withContext({
                    lastRewardBlockTs: farmRecord.lastRewardBlockTs,
                    numberOfAdditionalRewards,
                });
                if (!farmRecord || !farmRecord.stakedData)
                    return { sessionId: "" };
                const { stakedData } = farmRecord;
                const farmTokens = stakedData.farmTokens || [];
                const entries = unstakeMax
                    ? farmTokens.map((t) =>
                          TokenTransfer.metaEsdtFromBigInteger(
                              t.collection,
                              t.nonce.toNumber(),
                              t.balance
                          )
                      )
                    : calcUnstakeEntries2(lpAmt, farmTokens);
                const txs = await farmContract.exitFarm(entries);
                const payload: DappSendTransactionsPropsType = {
                    transactions: txs,
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
                const rawFarm = await snapshot.getPromise(
                    ashRawFarmQuery(farm.farm_address)
                );
                if (!farmRecord?.stakedData?.farmTokens.length || lpAmt.eq(0)) {
                    const rewards = farmRecord?.tokensAPR?.map(
                        (r) => new TokenAmount(TOKENS_MAP[r.tokenId], 0)
                    ) || [];
                    if(farmRecord?.ashPerSec.gt(0)){
                        rewards.unshift(new TokenAmount(ASH_TOKEN, 0));
                    }
                    return rewards;
                }
                const entries = calcUnstakeEntries(
                    lpAmt,
                    farmRecord.stakedData.farmTokens
                );
                const farmContract = ContractManager.getFarmContract(
                    farm.farm_address
                );

                const ashRewards = entries.map(({ unstakeAmt, farmToken }) =>
                    farmContract.calculateRewardsForGivenPosition(
                        unstakeAmt,
                        farmToken.attributes
                    )
                );

                const rewards = FarmContract.estimateAdditionalRewards(
                    entries.map((e) => ({
                        ...e.farmToken,
                        balance: e.unstakeAmt,
                    })),
                    new BigNumber(rawFarm?.divisionSafetyConstant || 0),
                    farmRecord.lpLockedAmt,
                    farmRecord.lastRewardBlockTs,
                    rawFarm?.additionalRewards.map((r) => ({
                        token: TOKENS_MAP[r.tokenId],
                        rewardPerShare: new BigNumber(r.rewardPerShare),
                        rewardPerSec: new BigNumber(r.rewardPerSec),
                        periodRewardEnd: r.periodRewardEnd,
                    })) || []
                ).filter((r) => r.greaterThan(0));

                const totalRewards = await Promise.all(ashRewards);
                const totalASH = totalRewards.reduce(
                    (total, val) => total.plus(val),
                    new BigNumber(0)
                );
                if (totalASH.gt(0)) {
                    rewards.unshift(new TokenAmount(ASH_TOKEN, totalASH));
                }

                return rewards;
            },
        []
    );
    return { exitFarm, estimateRewardOnExit, trackingData, sessionId };
};

export default useExitFarm;
