import {
    AccountInfoSliceNetworkType,
    getApiProvider,
    getProxyProvider,
    useGetAccountInfo,
    useGetLoginInfo,
    useGetNetworkConfig,
    useGetPendingTransactions,
    useGetSignedTransactions,
} from "@elrondnetwork/dapp-core";
import { SendTransactionReturnType } from "@elrondnetwork/dapp-core/dist/services/transactions";
import {
    Address,
    AddressValue,
    ApiProvider,
    BigUIntValue,
    BytesValue,
    ContractFunction,
    ExtensionProvider,
    GasLimit,
    ProxyProvider,
    Query,
    TokenIdentifierValue,
    Transaction,
    TypedValue,
} from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { blockTimeMs, gasLimit } from "const/dappConfig";
import { FARMS } from "const/farms";
import pools from "const/pool";
import { ASH_TOKEN } from "const/tokens";
import useContracts from "context/contracts";
import { useWallet } from "context/wallet";
import { toEGLD, toEGLDD } from "helper/balance";
import { fetcher } from "helper/common";
import {
    sendTransactions,
    useCreateTransaction,
} from "helper/transactionMethods";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { IFarm } from "interface/farm";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
const calcUnstakeEntries = (
    weiAmt: BigNumber,
    farmTokens: Required<FarmRecord>["stakedData"]["farmTokens"]
) => {
    let sum = new BigNumber(0);
    return farmTokens
        .map((ft) => {
            if (sum.gte(weiAmt)) {
                return { unstakeAmt: new BigNumber(0), farmToken: ft };
            }
            const remain = weiAmt.minus(sum);
            const amt = ft.balance.lte(remain) ? ft.balance : remain;
            sum = sum.plus(amt);
            return { unstakeAmt: amt, farmToken: ft };
        })
        .filter(({ unstakeAmt }) => unstakeAmt.gt(0));
};
const emptyFunc = () => {};
type FarmRecord = {
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
const initState: FarmsState = {
    farmRecords: [],
    farmToDisplay: [],
    sortOption: "apr",
    keyword: "",
    stakedOnly: false,
    inactive: false,
    loadingMap: {},
    setSortOption: emptyFunc,
    setKeyword: emptyFunc,
    setStakedOnly: emptyFunc,
    setInactive: emptyFunc,
    enterFarm: () => Promise.resolve({ sessionId: "" }),
    claimReward: () => Promise.resolve(),
    claimAllReward: () => Promise.resolve(),
    exitFarm: () => Promise.resolve({ sessionId: "" }),
    estimateRewardOnExit: () => Promise.resolve(new BigNumber(0)),
};
const FarmsContext = createContext<FarmsState>(initState);
export const useFarms = () => {
    const context = useContext(FarmsContext);
    if (context === undefined) {
        throw new Error("useState must be used within a Context.Provider");
    }
    return context;
};
const FarmsProvider = ({ children }: any) => {
    const [farmRecords, setFarmRecords] = useState<FarmRecord[]>([]);
    const [sortOption, setSortOption] =
        useState<FarmsState["sortOption"]>("apr");
    const [keyword, setKeyword] = useState<string>("");
    const [deboundKeyword] = useDebounce(keyword, 500);
    const [stakedOnly, setStakedOnly] = useState(false);
    const [inactive, setInactive] = useState(false);
    const [blockRewardMap, setBlockRewardMap] = useState<
        Record<string, BigNumber>
    >({});
    const [loadingMap, setLoadingMap] = useState<FarmsState["loadingMap"]>({});
    const [sessionIdsMap, setSessionIdsMap] = useState<
        Record<string, string[]>
    >({});
    const signedTransactionsFromStore =
        useGetSignedTransactions().signedTransactions;
    const pendingTransactionsFromStore =
        useGetPendingTransactions().pendingTransactions;
    const { getTokenInLP, getLPValue } = useContracts();
    const createTransaction = useCreateTransaction();
    const { isLoggedIn: loggedIn } = useGetLoginInfo();
    const proxy: ProxyProvider = getProxyProvider();
    const apiProvider: ApiProvider = getApiProvider();
    const { address } = useGetAccountInfo();
    const { lpTokens, tokenPrices, balances } = useWallet();
    const network: AccountInfoSliceNetworkType = useGetNetworkConfig().network;
    // fetch pool stats
    const { data: poolStatsRecords } = useSWR<PoolStatsRecord[]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool`,
        fetcher
    );

    const getPortion = useCallback(
        (lpTokenId, ownLiquidity: BigNumber) => {
            const lpToken = lpTokens[lpTokenId];
            if (!lpToken) return new BigNumber(0);
            return toEGLD(lpToken, ownLiquidity.toString())
                .multipliedBy(100)
                .div(lpToken.totalSupply!);
        },
        [lpTokens]
    );

    const getSNFTAttrs = useCallback(
        async (sftId: string) => {
            if (!loggedIn) return;
            return await apiProvider
                .doGetGeneric(
                    `accounts/${new Address(address).bech32()}/nfts/${sftId}`,
                    (res) => res
                )
                .catch(() => {});
        },
        [loggedIn, apiProvider, address]
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
    }, [getBlockReward]);

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

    const getReward = useCallback(
        async (farm: IFarm, amt: BigNumber, sftId: string) => {
            if (!loggedIn) return new BigNumber(0);
            const attributes = balances[sftId]?.attributes;
            if (!attributes) return new BigNumber(0);
            const res = await proxy.queryContract(
                new Query({
                    address: new Address(farm.farm_address),
                    func: new ContractFunction(
                        "calculateRewardsForGivenPosition"
                    ),
                    args: [new BigUIntValue(amt), new BytesValue(attributes)],
                })
            );
            return new BigNumber(
                res.returnData[0]
                    ? Buffer.from(res.returnData[0], "base64").toString("hex")
                    : 0,
                16
            );
        },
        [loggedIn, proxy, balances]
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
    ]);

    const enterFarm: FarmsState["enterFarm"] = useCallback(
        async (amtWei: BigNumber, farm: IFarm) => {
            if (!amtWei || amtWei.eq(0) || !loggedIn || !address)
                return { sessionId: "" };
            try {
                const farmTokenInWallet =
                    farmRecords.find(
                        (f) => f.farm.farm_address === farm.farm_address
                    )?.stakedData?.farmTokens || [];
                // console.log('in', farmTokenInWallet);
                const farmTokenArgs = farmTokenInWallet.reduce(
                    (total: TypedValue[], val) => {
                        total = [
                            ...total,
                            new TokenIdentifierValue(
                                Buffer.from(val.collection)
                            ),
                            new BigUIntValue(val.nonce),
                            new BigUIntValue(val.balance),
                        ];
                        return total;
                    },
                    []
                );
                const tx = await createTransaction(new Address(address), {
                    func: new ContractFunction("MultiESDTNFTTransfer"),
                    gasLimit: new GasLimit(9_000_000),
                    args: [
                        new AddressValue(new Address(farm.farm_address)),
                        new BigUIntValue(
                            new BigNumber(1 + farmTokenInWallet.length)
                        ),

                        new TokenIdentifierValue(
                            Buffer.from(farm.farming_token_id)
                        ),
                        new BigUIntValue(new BigNumber(0)),
                        new BigUIntValue(amtWei),

                        ...farmTokenArgs,

                        new TokenIdentifierValue(Buffer.from("enterFarm")),
                    ],
                });
                const payload: DappSendTransactionsPropsType = {
                    transactions: tx,
                    transactionsDisplayInfo: {
                        successMessage: `Stake succeed ${toEGLDD(
                            farm.farming_token_decimal,
                            amtWei
                        )} ${farm.farming_token_id}`,
                    },
                };
                const result = await sendTransactions(payload);
                if (result.sessionId)
                    setSessionIdsMap((val) => ({
                        ...val,
                        [farm.farm_address]: [
                            ...(val[farm.farm_address] || []),
                            result.sessionId!,
                        ],
                    }));
                return result;
            } catch (error) {
                console.log(error);
            }
            return { sessionId: "" };
        },
        [loggedIn, address, createTransaction, farmRecords]
    );

    const createExitFarmTx = useCallback(
        async (
            lpAmt: BigNumber,
            collection: string,
            nonce: BigNumber,
            farm: IFarm
        ) => {
            if (!loggedIn) throw new Error("Connect wallet to exit farm");
            return await createTransaction(new Address(address), {
                func: new ContractFunction("ESDTNFTTransfer"),
                gasLimit: new GasLimit(8_000_000),
                args: [
                    new TokenIdentifierValue(Buffer.from(collection)),
                    new BigUIntValue(nonce),
                    new BigUIntValue(lpAmt),
                    new AddressValue(new Address(farm.farm_address)),
                    new TokenIdentifierValue(Buffer.from("exitFarm")),
                ],
            });
        },
        [loggedIn, createTransaction, address]
    );

    const exitFarm: FarmsState["exitFarm"] = useCallback(
        async (lpAmt: BigNumber, farm: IFarm) => {
            if (!loggedIn) return { sessionId: "" };
            try {
                const farmRecord = farmRecords.find(
                    (val) => val.farm.farm_address === farm.farm_address
                );
                if (!farmRecord || !farmRecord.stakedData)
                    return { sessionId: "" };
                const { stakedData } = farmRecord;
                const farmTokens = stakedData.farmTokens || [];
                let txs: Transaction[] = [];
                const entries = calcUnstakeEntries(lpAmt, farmTokens);
                const exitFarmTxCreators = entries.map(
                    ({ farmToken: { collection, nonce }, unstakeAmt }) =>
                        createExitFarmTx(unstakeAmt, collection, nonce, farm)
                );
                txs = await Promise.all(exitFarmTxCreators);
                const payload: DappSendTransactionsPropsType = {
                    transactions: txs.filter((tx) => !!tx) as Transaction[],
                    transactionsDisplayInfo: {
                        successMessage: `Unstake succeed ${toEGLDD(
                            farm.farming_token_decimal,
                            lpAmt
                        )} ${farm.farming_token_id}`,
                    },
                };
                const result = await sendTransactions(payload);
                if (result.sessionId)
                    setSessionIdsMap((val) => ({
                        ...val,
                        [farm.farm_address]: [
                            ...(val[farm.farm_address] || []),
                            result.sessionId!,
                        ],
                    }));
                return result;
            } catch (error) {
                console.error(error);
            }
            return { sessionId: "" };
        },
        [createExitFarmTx, farmRecords, loggedIn]
    );

    const estimateRewardOnExit = useCallback(
        async (lpAmt: BigNumber, farm: IFarm) => {
            const farmRecord = farmRecords.find(
                (val) => val.farm.farm_address === farm.farm_address
            );
            if (!farmRecord?.stakedData?.farmTokens.length)
                return new BigNumber(0);
            const entries = calcUnstakeEntries(
                lpAmt,
                farmRecord.stakedData.farmTokens
            );
            const rewards = entries.map(({ unstakeAmt, farmToken }) =>
                getReward(farm, unstakeAmt, farmToken.tokenId)
            );
            const totalRewards = await Promise.all(rewards);
            return totalRewards.reduce(
                (total, val) => total.plus(val),
                new BigNumber(0)
            );
        },
        [farmRecords, getReward]
    );

    const createClaimRewardTx = useCallback(
        async (
            lpAmt: BigNumber,
            collection: string,
            nonce: BigNumber,
            farm: IFarm
        ) => {
            if (!loggedIn) throw new Error("Connect wallet to claim reward");
            return await createTransaction(new Address(address), {
                func: new ContractFunction("ESDTNFTTransfer"),
                gasLimit: new GasLimit(9_000_000),
                args: [
                    new TokenIdentifierValue(Buffer.from(collection)),
                    new BigUIntValue(nonce),
                    new BigUIntValue(lpAmt),
                    new AddressValue(new Address(farm.farm_address)),
                    new TokenIdentifierValue(Buffer.from("claimRewards")),
                ],
            });
        },
        [createTransaction, address, loggedIn]
    );

    const createClaimRewardTxs = useCallback(
        async (farmRecord: FarmRecord) => {
            const { stakedData } = farmRecord;
            const farmTokens = stakedData?.farmTokens || [];
            const txs: Transaction[] = [];
            for (let i = 0; i < farmTokens.length; i++) {
                const t = farmTokens[i];
                const tx = await createClaimRewardTx(
                    t.balance,
                    t.collection,
                    t.nonce,
                    farmRecord.farm
                );
                txs.push(tx);
            }
            return txs;
        },
        [createClaimRewardTx]
    );

    const claimReward = useCallback(
        async (farm: IFarm) => {
            const farmRecord = farmRecords.find(
                (val) => val.farm.farm_address === farm.farm_address
            );
            if (!farmRecord || !farmRecord.stakedData)
                throw new Error("unable to claim reward");

            try {
                const { stakedData } = farmRecord;
                const txs = await createClaimRewardTxs(farmRecord);
                const payload: DappSendTransactionsPropsType = {
                    transactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Claim succeed ${toEGLDD(
                            ASH_TOKEN.decimals,
                            stakedData.totalRewardAmt
                        )} ${ASH_TOKEN.name}`,
                    },
                };
                const result = await sendTransactions(payload);
                if (result.sessionId)
                    setSessionIdsMap((val) => ({
                        ...val,
                        [farm.farm_address]: [
                            ...(val[farm.farm_address] || []),
                            result.sessionId!,
                        ],
                    }));
            } catch (error) {
                console.error(error);
            }
        },
        [createClaimRewardTxs, farmRecords]
    );

    const claimAllReward = useCallback(async () => {
        let txs: Transaction[] = [];
        let totalASH = new BigNumber(0);
        const farmsAddress: string[] = [];
        for (let i = 0; i < farmRecords.length; i++) {
            const val = farmRecords[i];
            if (val?.stakedData?.totalRewardAmt.gt(0)) {
                const temp = await createClaimRewardTxs(val);
                txs = [...txs, ...temp];
                totalASH = totalASH.plus(val.stakedData.totalRewardAmt);
                farmsAddress.push(val.farm.farm_address);
            }
        }
        const payload: DappSendTransactionsPropsType = {
            transactions: txs,
            transactionsDisplayInfo: {
                successMessage: `Claim succeed ${toEGLDD(
                    ASH_TOKEN.decimals,
                    totalASH
                )} ${ASH_TOKEN.name}`,
            },
        };
        const result = await sendTransactions(payload);
        if (result.sessionId)
            setSessionIdsMap((val) => ({
                ...val,
                ...Object.fromEntries(
                    farmsAddress.map((farm_address) => [
                        farm_address,
                        [...(val[farm_address] || []), result.sessionId!],
                    ])
                ),
            }));
    }, [farmRecords, createClaimRewardTxs]);

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
    }, [sessionIdsMap, pendingTransactionsFromStore]);

    const poolToDisplay = useMemo(() => {
        let result: FarmRecord[] = [...farmRecords].filter((p) =>
            stakedOnly ? !!p.stakedData : true
        );

        if (deboundKeyword.trim()) {
            result = farmRecords.filter((p) =>
                p.pool.tokens.some((t) =>
                    t.name
                        .toLowerCase()
                        .includes(deboundKeyword.trim().toLowerCase())
                )
            );
        }
        switch (sortOption) {
            case "apr":
                result = result.sort((x, y) =>
                    y.emissionAPR.minus(x.emissionAPR).toNumber()
                );
                break;
            case "liquidity":
                result = result.sort((x, y) =>
                    y.totalLiquidityValue
                        .minus(x.totalLiquidityValue)
                        .toNumber()
                );
                break;
            case "volume":
                result = result.sort(
                    (x, y) =>
                        (y.poolStats?.usd_volume || 0) -
                        (x.poolStats?.usd_volume || 0)
                );
                break;
            default:
        }
        return result;
    }, [farmRecords, deboundKeyword, sortOption, stakedOnly]);

    return (
        <FarmsContext.Provider
            value={{
                ...initState,
                farmRecords: farmRecords,
                farmToDisplay: poolToDisplay,
                sortOption,
                keyword,
                stakedOnly,
                inactive,
                loadingMap,
                setSortOption,
                setKeyword,
                setStakedOnly,
                setInactive,
                enterFarm,
                claimReward,
                claimAllReward,
                exitFarm,
                estimateRewardOnExit,
            }}
        >
            {children}
        </FarmsContext.Provider>
    );
};

export default FarmsProvider;
