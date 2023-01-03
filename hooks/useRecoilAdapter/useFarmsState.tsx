import { useGetPendingTransactions } from "@elrondnetwork/dapp-core/hooks";
import { SendTransactionReturnType } from "@elrondnetwork/dapp-core/types";
import { ashswapBaseState } from "atoms/ashswap";
import { accAddressState } from "atoms/dappState";
import {
    farmDeboundKeywordState,
    farmKeywordState,
    farmLoadingMapState,
    FarmRecord,
    farmRecordsState,
    farmSessionIdMapState,
    FarmToken,
} from "atoms/farmsState";
import { LPBreakDownQuery, poolRecordsState } from "atoms/poolsState";
import { farmTokenMapState, tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import { blockTimeMs } from "const/dappConfig";
import { FARMS } from "const/farms";
import pools from "const/pool";
import { ASH_TOKEN } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { calcYieldBoostFromFarmToken } from "helper/farmBooster";
import { decodeNestedStringBase64 } from "helper/serializer";
import { FarmTokenAttrs, FarmTokenAttrsStruct, IFarm } from "interface/farm";
import IPool from "interface/pool";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
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

const calculatePerBlockRewards = (
    currentBlock: BigNumber,
    lastBlock: BigNumber,
    perBlockReward: BigNumber,
    produceRewardEnable: boolean
) => {
    if (currentBlock.lte(lastBlock) || !produceRewardEnable) {
        return new BigNumber(0);
    }

    return new BigNumber(currentBlock)
        .minus(lastBlock)
        .multipliedBy(perBlockReward || 0);
};

const useFarmsState = () => {
    const keyword = useRecoilValue(farmKeywordState);
    const sessionIdsMap = useRecoilValue(farmSessionIdMapState);
    const accAddress = useRecoilValue(accAddressState);
    const tokenMap = useRecoilValue(tokenMapState);
    const farmTokenMap = useRecoilValue(farmTokenMapState);
    const ashBase = useRecoilValue(ashswapBaseState);
    const poolRecords = useRecoilValue(poolRecordsState);
    const setDeboundKeyword = useSetRecoilState(farmDeboundKeywordState);
    const setLoadingMap = useSetRecoilState(farmLoadingMapState);
    const setFarmRecordsState = useSetRecoilState(farmRecordsState);

    const [deboundKeyword] = useDebounce(keyword, 500);

    const pendingTransactionsFromStore =
        useGetPendingTransactions().pendingTransactions;

    useEffect(() => {
        setDeboundKeyword(deboundKeyword);
    }, [deboundKeyword, setDeboundKeyword]);

    const calculateRewardsForGivenPositionLocal = useCallback(
        async (
            wei: BigNumber,
            attributes: FarmTokenAttrs,
            farmAddress: string
        ) => {
            const farmRaw = ashBase.farms.find(
                (_f) => _f.address === farmAddress
            );
            const {
                shard,
                farmTokenSupply,
                divisionSafetyConstant,
                perBlockReward,
                lastRewardBlockNone,
                rewardPerShare,
            } = farmRaw || {};
            const produceRewardEnable = true;
            if (
                !shard ||
                !farmTokenSupply ||
                !lastRewardBlockNone ||
                !divisionSafetyConstant ||
                wei.lte(0) ||
                wei.gt(farmTokenSupply)
            )
                return new BigNumber(0);

            const blockShard = ashBase.blockchain?.blockShards?.find(
                (s) => s.shard === shard
            );

            let currentBlockNonce = blockShard?.nonce;
            if (!currentBlockNonce || farmTokenSupply === "0")
                return new BigNumber(0);
            let reward_increase = calculatePerBlockRewards(
                new BigNumber(currentBlockNonce),
                new BigNumber(lastRewardBlockNone),
                new BigNumber(perBlockReward || 0),
                produceRewardEnable
            );

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
        [ashBase]
    );

    const lpBreak = useRecoilCallback(
        ({ snapshot }) =>
            async (poolAddress: string, wei: string) => {
                return await snapshot.getPromise(
                    LPBreakDownQuery({ poolAddress, wei })
                );
            },
        []
    );

    const getFarmRecord = useCallback(
        async (f: IFarm, p: IPool) => {
            const rawFarm = ashBase.farms.find(
                (_f) => _f.address === f.farm_address
            );
            const poolState = poolRecords.find(
                (_p) => _p.pool.address === p.address
            );
            const lpLockedAmt = new BigNumber(
                rawFarm?.farmingTokenBalance || 0
            );
            const farmTokenSupply = new BigNumber(
                rawFarm?.farmTokenSupply || 0
            );

            const { valueUsd: totalLiquidityValue } = await lpBreak(
                p.address,
                lpLockedAmt.toString()
            );

            const ashPerBlock = new BigNumber(rawFarm?.perBlockReward || 0);
            const totalASH = toEGLDD(
                ASH_TOKEN.decimals,
                ashPerBlock
                    .multipliedBy(365 * 24 * 60 * 60)
                    .div(blockTimeMs / 1000)
            );
            const emissionAPR = totalLiquidityValue.gt(0) ? totalASH
                .multipliedBy(tokenMap[ASH_TOKEN.identifier]?.price || 0)
                .multipliedBy(100)
                .div(totalLiquidityValue) : new BigNumber(0);

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

            const collectionTokens = farmTokenMap[f.farm_token_id];
            const farmTokens: FarmToken[] = collectionTokens.map((token) => {
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
            });
            const isFarmed = farmTokens.some(({ balance }) => balance.gt(0));
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

        [
            accAddress,
            ashBase.farms,
            calculateRewardsForGivenPositionLocal,
            farmTokenMap,
            poolRecords,
            tokenMap,
            lpBreak,
        ]
    );

    const getFarmRecords = useCallback(async () => {
        try {
            const recordPromises: Promise<FarmRecord>[] = [];
            for (let i = 0; i < FARMS.length; i++) {
                const f = FARMS[i];
                const p = pools.find(
                    (val) => val.lpToken.identifier === f.farming_token_id
                );
                if (p) {
                    recordPromises.push(getFarmRecord(f, p));
                }
            }
            const records = await Promise.all(recordPromises);
            setFarmRecordsState(records);
        } catch (error) {
            console.error(error);
        }
    }, [getFarmRecord, setFarmRecordsState]);

    const [deboundGetFarmRecords] = useDebounce(getFarmRecords, 500);

    useEffect(() => {
        deboundGetFarmRecords();
    }, [deboundGetFarmRecords]);

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
