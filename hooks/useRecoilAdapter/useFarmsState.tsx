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
    FarmToken
} from "atoms/farmsState";
import { LPBreakDownQuery, poolRecordsState } from "atoms/poolsState";
import { farmTokenMapState, tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import { FARMS, FARMS_MAP } from "const/farms";
import pools from "const/pool";
import { ASH_TOKEN } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import { calcYieldBoostFromFarmToken } from "helper/farmBooster";
import { FarmTokenAttrs, IFarm } from "interface/farm";
import IPool from "interface/pool";
import moment from "moment";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import { useDebounce } from "use-debounce";
type RewardSnapshot = {
    ts: number;
    reward: BigNumber;
};
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
    const [lastQueryRewardMap, setLastQueryRewardMap] = useState<
        Record<string, RewardSnapshot>
    >({});
    const rewardPerSecKey = useMemo(() => {
        return ashBase.farms.map(f => f.rewardPerSec).join("-");
    }, [ashBase.farms]);

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
                rewardPerSec,
                lastRewardBlockTs,
                rewardPerShare,
            } = farmRaw || {};
            const produceRewardEnable = !!farmRaw?.produceRewardEnabled;
            if (
                !shard ||
                !farmTokenSupply ||
                !lastRewardBlockTs ||
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
                new BigNumber(lastRewardBlockTs),
                new BigNumber(rewardPerSec || 0),
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

    const queryReward = useRecoilCallback(
        ({ snapshot }) =>
            async (farmAddress: string) => {
                const tokenMap = await snapshot.getPromise(farmTokenMapState);
                const tokens = tokenMap[FARMS_MAP[farmAddress].farm_token_id];
                const contract = ContractManager.getFarmContract(farmAddress);
                const estimateds = await Promise.all(
                    tokens.map((t) => {
                        return contract.calculateRewardsForGivenPosition(
                            t.balance,
                            contract.parseCustomType<FarmTokenAttrs>(
                                t.attributes,
                                "FarmTokenAttributes"
                            )
                        );
                    })
                );
                return estimateds.reduce((s, e) => s.plus(e), new BigNumber(0));
            },
        []
    );

    const queryRewards = useRecoilCallback(
        () => async () => {
            if (farmTokenMap && rewardPerSecKey) {
                const rewards = await Promise.all(
                    FARMS.map((f) => queryReward(f.farm_address))
                );
                setLastQueryRewardMap(
                    FARMS.reduce((map, f, i) => {
                        return {
                            ...map,
                            [f.farm_address]: {
                                reward: rewards[i],
                                ts: moment().unix(),
                            },
                        };
                    }, {})
                );
            }
        },
        [farmTokenMap, rewardPerSecKey, queryReward]
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

            const ashPerSec = new BigNumber(rawFarm?.rewardPerSec || 0);
            const totalASH = toEGLDD(
                ASH_TOKEN.decimals,
                ashPerSec.multipliedBy(365 * 24 * 60 * 60)
            );
            const emissionAPR = totalLiquidityValue.gt(0)
                ? totalASH
                      .multipliedBy(tokenMap[ASH_TOKEN.identifier]?.price || 0)
                      .multipliedBy(100)
                      .div(totalLiquidityValue)
                : new BigNumber(0);

            const record: FarmRecord = {
                pool: p,
                farm: f,
                poolStats: poolState?.poolStats,
                ashPerSec,
                lastRewardBlockTs: rawFarm?.lastRewardBlockTs || 0,
                farmTokenSupply,
                lpLockedAmt,
                totalLiquidityValue,
                emissionAPR,
            };
            if (!accAddress) return record;

            const collectionTokens = farmTokenMap[f.farm_token_id];
            const farmTokens: FarmToken[] = collectionTokens.map((token) => {
                const attributes = ContractManager.getFarmContract(
                    f.farm_address
                ).parseCustomType<FarmTokenAttrs>(
                    token.attributes,
                    "FarmTokenAttributes"
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
                const farmBalance = farmTokens.reduce(
                    (total, f) => total.plus(f.balance),
                    new BigNumber(0)
                );
                const lastSnapshotReward = lastQueryRewardMap[f.farm_address] || {reward: new BigNumber(0), ts: moment().unix()};
                const rewardIncrease = BigNumber.max(moment().unix() - lastSnapshotReward.ts, 0).multipliedBy(ashPerSec).multipliedBy(farmBalance).idiv(farmTokenSupply);
                const estimatedReward = lastSnapshotReward.reward.plus(rewardIncrease);
                const totalStakedLP = farmTokens.reduce(
                    (total, val) =>
                        total.plus(
                            val.balance
                                .div(val.perLP)
                                .integerValue(BigNumber.ROUND_FLOOR)
                        ),
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
                    totalRewardAmt: estimatedReward,
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

        [ashBase.farms, poolRecords, lpBreak, tokenMap, accAddress, farmTokenMap, lastQueryRewardMap]
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

    const [deboundGetFarmRecords] = useDebounce(getFarmRecords, 1000);

    useEffect(() => {
        deboundGetFarmRecords();
    }, [deboundGetFarmRecords]);

    const [debounceQueryRewards] = useDebounce(queryRewards, 500);

    useEffect(() => {
        debounceQueryRewards()
    }, [debounceQueryRewards]);

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
