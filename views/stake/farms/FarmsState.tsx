import {
    getProxyProvider, useGetPendingTransactions
} from "@elrondnetwork/dapp-core";
import { SendTransactionReturnType } from "@elrondnetwork/dapp-core/dist/services/transactions";
import {
    Address, ContractFunction, ProxyProvider,
    Query
} from "@elrondnetwork/erdjs/out";
import { farmBlockRewardMapState, farmDeboundKeywordState, farmKeywordState, farmLoadingMapState, farmRecordsState, farmSessionIdMapState } from "atoms/farmsState";
import {
    walletBalanceState, walletTokenPriceState
} from "atoms/walletState";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { blockTimeMs } from "const/dappConfig";
import { FARMS } from "const/farms";
import pools from "const/pool";
import { ASH_TOKEN } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { fetcher } from "helper/common";
import useFarmReward from "hooks/useFarmContract/useFarmReward";
import useLPValue from "hooks/usePoolContract/useLPValue";
import { IFarm } from "interface/farm";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import {
    Dispatch,
    SetStateAction,
    useCallback, useEffect
} from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
export type FarmRecord = {
    pool: IPool;
    farm: IFarm;
    poolStats?: PoolStatsRecord;
    stakedData?: {
        farmTokens: {
            tokenId: string;
            collection: string;
            nonce: BigNumber;
            balance: BigNumber;
        }[];
        totalStakedLP: BigNumber;
        totalRewardAmt: BigNumber;
    };
    ashPerBlock: BigNumber;
    farmTokenSupply: BigNumber;
    totalLiquidityValue: BigNumber;
    emissionAPR: BigNumber;
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

const FarmsState = () => {
    const tokenPrices = useRecoilValue(walletTokenPriceState);
    const balances = useRecoilValue(walletBalanceState);
    const keyword = useRecoilValue(farmKeywordState);
    const sessionIdsMap = useRecoilValue(farmSessionIdMapState);
    const setDeboundKeyword = useSetRecoilState(farmDeboundKeywordState);
    const setLoadingMap = useSetRecoilState(farmLoadingMapState);
    const setFarmRecords = useSetRecoilState(farmRecordsState);
    const [blockRewardMap, setBlockRewardMap] = useRecoilState(farmBlockRewardMapState);

    const getReward = useFarmReward();

    const [deboundKeyword] = useDebounce(keyword, 500);

    const pendingTransactionsFromStore =
        useGetPendingTransactions().pendingTransactions;
    const getLPValue = useLPValue();

    const proxy: ProxyProvider = getProxyProvider();


    useEffect(() => {
        setDeboundKeyword(deboundKeyword);
    }, [deboundKeyword, setDeboundKeyword]);
    // fetch pool stats
    const { data: poolStatsRecords } = useSWR<PoolStatsRecord[]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool`,
        fetcher
    );

    const getBlockReward = useCallback(
        async (farmAddress: string) => {
            if (!proxy) return new BigNumber(0);
            return await proxy
                .queryContract(
                    new Query({
                        address: new Address(farmAddress),
                        func: new ContractFunction("getPerBlockRewardAmount"),
                    })
                )
                .then(({ returnData }) => {
                    return new BigNumber(
                        Buffer.from(returnData[0], "base64").toString("hex"),
                        16
                    );
                })
                .catch(() => new BigNumber(0));
        },
        [proxy]
    );

    const getFarmBlockRewardMap = useCallback(async () => {
        const rewards = await Promise.all(
            FARMS.map((f) => getBlockReward(f.farm_address))
        );
        const entries: [string, BigNumber][] = rewards.map((reward, i) => [
            FARMS[i].farm_address,
            reward,
        ]);
        const map = Object.fromEntries(entries);
        setBlockRewardMap(map);
    }, [getBlockReward, setBlockRewardMap]);

    const getFarmTokenSupply = useCallback(
        (farmAddress: string) => {
            return proxy
                .queryContract(
                    new Query({
                        address: new Address(farmAddress),
                        func: new ContractFunction("getFarmTokenSupply"),
                    })
                )
                .then(({ returnData }) => {
                    return returnData[0]
                        ? new BigNumber(
                              Buffer.from(returnData[0], "base64").toString(
                                  "hex"
                              ),
                              16
                          )
                        : new BigNumber(0);
                })
                .catch(() => new BigNumber(0));
        },
        [proxy]
    );


    const getFarmRecords = useCallback(async () => {
        const records: FarmRecord[] = [];
        for (let i = 0; i < FARMS.length; i++) {
            const f = FARMS[i];
            const p = pools.find(
                (val) => val.lpToken.id === f.farming_token_id
            );
            if (p) {
                const farmTokenSupply = await getFarmTokenSupply(
                    f.farm_address
                );
                const totalLiquidityValue = await getLPValue(
                    farmTokenSupply,
                    p
                );
                const ashPerBlock =
                    blockRewardMap[f.farm_address] || new BigNumber(0);
                const totalASH = toEGLDD(
                    ASH_TOKEN.decimals,
                    ashPerBlock
                        .multipliedBy(365 * 24 * 60 * 60)
                        .div(blockTimeMs / 1000)
                );
                const emissionAPR = totalASH
                    .multipliedBy(tokenPrices[ASH_TOKEN.id] || 0)
                    .multipliedBy(100)
                    .div(totalLiquidityValue);
                const record: FarmRecord = {
                    pool: p,
                    farm: f,
                    poolStats: poolStatsRecords?.find(
                        (stats) => stats.pool_address === p.address
                    ),
                    ashPerBlock,
                    farmTokenSupply,
                    totalLiquidityValue,
                    emissionAPR,
                };
                const farmTokens = Object.keys(balances)
                    .filter((tokenId) => tokenId.startsWith(f.farm_token_id))
                    .map((id) => ({
                        tokenId: id,
                        collection: f.farm_token_id,
                        nonce: new BigNumber(
                            id.replace(f.farm_token_id + "-", ""),
                            16
                        ),
                        balance: balances[id]?.balance || new BigNumber(0),
                    }));
                const isFarmed = farmTokens.some(({ balance }) =>
                    balance.gt(0)
                );
                if (isFarmed) {
                    const rewards = farmTokens.map((t) =>
                        getReward(f, t.balance, t.tokenId)
                    );
                    const totalRewards = await Promise.all(rewards);
                    record.stakedData = {
                        farmTokens,
                        totalStakedLP: farmTokens.reduce(
                            (total, val) => total.plus(val.balance),
                            new BigNumber(0)
                        ),
                        totalRewardAmt: totalRewards.reduce(
                            (total, val) => total.plus(val),
                            new BigNumber(0)
                        ),
                    };
                }
                records.push(record);
            }
        }
        setFarmRecords(records);
    }, [
        balances,
        getLPValue,
        poolStatsRecords,
        getReward,
        blockRewardMap,
        getFarmTokenSupply,
        tokenPrices,
        setFarmRecords
    ]);



    useEffect(() => {
        getFarmBlockRewardMap();
    }, [getFarmBlockRewardMap]);

    useEffect(() => {
        getFarmRecords();
    }, [getFarmRecords]);

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

    return null;
};

export default FarmsState;
