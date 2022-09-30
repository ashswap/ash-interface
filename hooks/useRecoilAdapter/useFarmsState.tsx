import { useGetPendingTransactions } from "@elrondnetwork/dapp-core/hooks";
import { SendTransactionReturnType } from "@elrondnetwork/dapp-core/types";
import { blockShardQuery } from "atoms/blockchain";
import { accAddressState } from "atoms/dappState";
import {
    ashRawFarmQuery,
    farmDeboundKeywordState,
    farmKeywordState,
    farmLoadingMapState,
    FarmRecord,
    farmRecordsState,
    farmSessionIdMapState,
    FarmToken,
} from "atoms/farmsState";
import { LPBreakDownQuery, poolRecordQuery } from "atoms/poolsState";
import { farmTokenMapState, tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import { blockTimeMs } from "const/dappConfig";
import { FARMS } from "const/farms";
import pools from "const/pool";
import { ASH_TOKEN } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { calcYieldBoostFromFarmToken } from "helper/farmBooster";
import { decodeNestedStringBase64 } from "helper/serializer";
import useInterval from "hooks/useInterval";
import { FarmTokenAttrs, FarmTokenAttrsStruct, IFarm } from "interface/farm";
import IPool from "interface/pool";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import { useDebounce } from "use-debounce";

export type FarmsState = {
    farmRecords: FarmRecord[];
    farmToDisplay: FarmRecord[];
    sortOption: "apr" | "liquidity" | "volume";
    keyword: string;
    stakedOnly: boolean;
    inactive: boolean;
    loadingMap: Record<string, boolean>;
    setSortOption: Dispatch<SetStateAction<"apr" | "liquidity" | "volume">>;
    setKeyword: Dispatch<SetStateAction<string>>;
    setStakedOnly: Dispatch<SetStateAction<boolean>>;
    setInactive: Dispatch<SetStateAction<boolean>>;
    enterFarm: (
        amtWei: BigNumber,
        farm: IFarm
    ) => Promise<SendTransactionReturnType>;
    claimReward: (farm: IFarm) => Promise<void>;
    claimAllReward: () => Promise<void>;
    exitFarm: (
        lpAmt: BigNumber,
        farm: IFarm
    ) => Promise<SendTransactionReturnType>;
    estimateRewardOnExit: (lpAmt: BigNumber, farm: IFarm) => Promise<BigNumber>;
};

const useFarmsState = () => {
    const keyword = useRecoilValue(farmKeywordState);
    const sessionIdsMap = useRecoilValue(farmSessionIdMapState);
    const setDeboundKeyword = useSetRecoilState(farmDeboundKeywordState);
    const setLoadingMap = useSetRecoilState(farmLoadingMapState);

    const [deboundKeyword] = useDebounce(keyword, 500);

    const pendingTransactionsFromStore =
        useGetPendingTransactions().pendingTransactions;

    useEffect(() => {
        setDeboundKeyword(deboundKeyword);
    }, [deboundKeyword, setDeboundKeyword]);

    const calculateRewardsForGivenPositionLocal = useRecoilCallback(
        ({ snapshot, set }) =>
            async (
                wei: BigNumber,
                attributes: FarmTokenAttrs,
                farmAddress: string
            ) => {
                const farmRaw = await snapshot.getPromise(
                    ashRawFarmQuery(farmAddress)
                );
                const {
                    shard,
                    farmTokenSupply,
                    divisionSafetyConstant,
                    perBlockReward,
                    lastRewardBlockNone,
                    rewardPerShare,
                } = farmRaw || {};
                if (
                    !shard ||
                    !farmTokenSupply ||
                    !lastRewardBlockNone ||
                    !divisionSafetyConstant ||
                    wei.lte(0) ||
                    wei.gt(farmTokenSupply)
                )
                    return new BigNumber(0);

                const blockShard = await snapshot.getPromise(
                    blockShardQuery(shard)
                );

                let currentBlockNonce = blockShard?.nonce;
                if (!currentBlockNonce || farmTokenSupply === "0")
                    return new BigNumber(0);
                let reward_increase = new BigNumber(currentBlockNonce)
                    .minus(lastRewardBlockNone)
                    .multipliedBy(perBlockReward || 0);
                let reward_per_share_increase = reward_increase
                    .multipliedBy(divisionSafetyConstant)
                    .div(farmTokenSupply);

                let future_reward_per_share = new BigNumber(
                    rewardPerShare || 0
                ).plus(reward_per_share_increase);
                if (future_reward_per_share.gt(attributes.reward_per_share)) {
                    let reward_per_share_diff = future_reward_per_share.minus(
                        attributes.reward_per_share
                    );
                    return wei
                        .multipliedBy(reward_per_share_diff)
                        .div(divisionSafetyConstant);
                }
                return new BigNumber(0);
            },
        []
    );

    const getFarmRecord = useRecoilCallback(
        ({ snapshot, set }) =>
            async (f: IFarm, p: IPool) => {
                const accAddress = await snapshot.getPromise(accAddressState);
                const tokenMap = await snapshot.getPromise(tokenMapState);
                const rawFarm = await snapshot.getPromise(
                    ashRawFarmQuery(f.farm_address)
                );
                const poolState = await snapshot.getPromise(
                    poolRecordQuery(p.address)
                );
                const lpLockedAmt = new BigNumber(
                    rawFarm?.farmingTokenBalance || 0
                );
                const farmTokenSupply = new BigNumber(
                    rawFarm?.farmTokenSupply || 0
                );

                const { valueUsd: totalLiquidityValue } =
                    await snapshot.getPromise(
                        LPBreakDownQuery({
                            poolAddress: p.address,
                            wei: lpLockedAmt.toString(),
                        })
                    );

                const ashPerBlock = new BigNumber(rawFarm?.perBlockReward || 0);
                const totalASH = toEGLDD(
                    ASH_TOKEN.decimals,
                    ashPerBlock
                        .multipliedBy(365 * 24 * 60 * 60)
                        .div(blockTimeMs / 1000)
                );
                const emissionAPR = totalASH
                    .multipliedBy(tokenMap[ASH_TOKEN.identifier]?.price || 0)
                    .multipliedBy(100)
                    .div(totalLiquidityValue);

                const record: FarmRecord = {
                    pool: p,
                    farm: f,
                    poolStats: poolState?.poolStats,
                    ashPerBlock,
                    farmTokenSupply,
                    lpLockedAmt,
                    totalLiquidityValue,
                    emissionAPR,
                };
                if (!accAddress) return record;

                const farmTokenMap = await snapshot.getPromise(
                    farmTokenMapState
                );
                const collectionTokens = farmTokenMap[f.farm_token_id];
                const farmTokens: FarmToken[] = collectionTokens.map(
                    (token) => {
                        const attributes = decodeNestedStringBase64(
                            token.attributes || "",
                            FarmTokenAttrsStruct
                        );
                        const perLP = attributes.initial_farm_amount.div(
                            attributes.initial_farming_amount
                        );
                        const balance = new BigNumber(token.balance || 0);
                        const lpAmt = balance
                            .div(perLP)
                            .integerValue(BigNumber.ROUND_FLOOR);
                        const yieldBoostRaw = calcYieldBoostFromFarmToken(
                            farmTokenSupply,
                            balance,
                            lpAmt,
                            f
                        );

                        return {
                            tokenId: token.identifier,
                            collection: token.collection,
                            nonce: new BigNumber(token.nonce),
                            balance,
                            attributes,
                            attrsRaw: token.attributes,
                            weightBoost: perLP.div(0.4),
                            yieldBoost: +new BigNumber(yieldBoostRaw).toFixed(
                                2,
                                BigNumber.ROUND_DOWN
                            ),
                            perLP,
                            lpAmt,
                            farmAddress: f.farm_address,
                        };
                    }
                );
                const isFarmed = farmTokens.some(({ balance }) =>
                    balance.gt(0)
                );
                if (isFarmed) {
                    const totalRewards = await Promise.all(
                        farmTokens.map((t) =>
                            calculateRewardsForGivenPositionLocal(
                                t.balance,
                                t.attributes,
                                f.farm_address
                            )
                        )
                    );
                    const totalStakedLP = farmTokens.reduce(
                        (total, val) =>
                            total.plus(
                                val.balance
                                    .div(val.perLP)
                                    .integerValue(BigNumber.ROUND_FLOOR)
                            ),
                        new BigNumber(0)
                    );
                    const farmBalance = farmTokens.reduce(
                        (total, f) => total.plus(f.balance),
                        new BigNumber(0)
                    );
                    const yieldBoostRaw = calcYieldBoostFromFarmToken(
                        farmTokenSupply,
                        farmBalance,
                        totalStakedLP,
                        f
                    );
                    record.stakedData = {
                        farmTokens,
                        totalStakedLP,
                        totalRewardAmt: totalRewards.reduce(
                            (total, val) => total.plus(val),
                            new BigNumber(0)
                        ),
                        totalStakedLPValue: totalStakedLP
                            .multipliedBy(totalLiquidityValue)
                            .div(lpLockedAmt),
                        weightBoost: farmBalance.div(totalStakedLP).div(0.4),
                        yieldBoost: +new BigNumber(yieldBoostRaw).toFixed(
                            2,
                            BigNumber.ROUND_DOWN
                        ),
                    };
                }
                return record;
            },
        []
    );

    const getFarmRecords = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                try {
                    const recordPromises: Promise<FarmRecord>[] = [];
                    for (let i = 0; i < FARMS.length; i++) {
                        const f = FARMS[i];
                        const p = pools.find(
                            (val) =>
                                val.lpToken.identifier === f.farming_token_id
                        );
                        if (p) {
                            recordPromises.push(getFarmRecord(f, p));
                        }
                    }
                    const records = await Promise.all(recordPromises);
                    set(farmRecordsState, records);
                } catch (error) {
                    console.error(error);
                }
            },
        [getFarmRecord]
    );

    useInterval(getFarmRecords, blockTimeMs);

    useEffect(() => {
        if (Object.keys(sessionIdsMap).length > 0) {
            if (Object.keys(pendingTransactionsFromStore).length > 0) {
                const entries = Object.entries(sessionIdsMap).map(
                    ([farm_address, sessionIds]) => {
                        return [
                            farm_address,
                            sessionIds.some(
                                (id) => id in pendingTransactionsFromStore
                            ),
                        ];
                    }
                );
                setLoadingMap(Object.fromEntries(entries));
            } else {
                setLoadingMap({});
            }
        }
    }, [sessionIdsMap, pendingTransactionsFromStore, setLoadingMap]);
};

export default useFarmsState;
