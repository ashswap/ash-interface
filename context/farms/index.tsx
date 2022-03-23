import {
    Address,
    AddressValue,
    ArgSerializer,
    BigUIntValue,
    BytesValue,
    ContractFunction,
    EndpointParameterDefinition,
    GasLimit,
    PrimitiveValue,
    Query,
    StringValue,
    Struct,
    StructType,
    TokenIdentifierValue,
    Transaction,
    TransactionHash,
    TypedValue,
    TypeExpressionParser,
    TypeMapper,
} from "@elrondnetwork/erdjs/out";
import { notification } from "antd";
import BigNumber from "bignumber.js";
import { FARMS } from "const/farms";
import { gasLimit, network } from "const/network";
import pools from "const/pool";
import useContracts from "context/contracts";
import { useDappContext } from "context/dapp";
import { useWallet } from "context/wallet";
import { toEGLD, toEGLDD } from "helper/balance";
import { fetcher } from "helper/common";
import {
    contractArgsDeserialize,
    queryContractParser,
} from "helper/serializer";
import { IFarm } from "interface/farm";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import IconNewTab from "assets/svg/new-tab-green.svg";
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
import { ASH_TOKEN } from "const/tokens";
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
    /** own LP tokens*/
    liquidityData?: {
        /** number of own LP token*/
        ownLiquidity: BigNumber;
        /** number of token 0 in own LP*/
        value0: BigNumber;
        /** number of token 1 in own LP*/
        value1: BigNumber;
        /** own LP over total LP*/
        capacityPercent: BigNumber;
        /** total liquidity in USD value*/
        lpValueUsd: BigNumber;
    };
};
export type FarmsState = {
    farmRecords: FarmRecord[];
    farmToDisplay: FarmRecord[];
    sortOption: "apr" | "liquidity" | "volume";
    keyword: string;
    stakedOnly: boolean;
    inactive: boolean;
    setSortOption: Dispatch<SetStateAction<"apr" | "liquidity" | "volume">>;
    setKeyword: Dispatch<SetStateAction<string>>;
    setStakedOnly: Dispatch<SetStateAction<boolean>>;
    setInactive: Dispatch<SetStateAction<boolean>>;
    enterFarm: (
        amtWei: BigNumber,
        farm: IFarm
    ) => Promise<TransactionHash | null>;
    claimReward: (farm: IFarm) => void;
    exitFarm: (
        lpAmt: BigNumber,
        farm: IFarm
    ) => Promise<{ [key: number]: string }>;
    estimateRewardOnExit: (lpAmt: BigNumber, farm: IFarm) => Promise<BigNumber>;
};
const initState: FarmsState = {
    farmRecords: [],
    farmToDisplay: [],
    sortOption: "apr",
    keyword: "",
    stakedOnly: false,
    inactive: false,
    setSortOption: emptyFunc,
    setKeyword: emptyFunc,
    setStakedOnly: emptyFunc,
    setInactive: emptyFunc,
    enterFarm: () => Promise.resolve(null),
    claimReward: emptyFunc,
    exitFarm: () => Promise.resolve({}),
    estimateRewardOnExit: () => Promise.resolve(new BigNumber(0))
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
    const { getTokenInLP, getLPValue, createTransaction, sendMultipleTxs } = useContracts();
    const dapp = useDappContext();
    const { lpTokens, tokenPrices, balances } = useWallet();
    // fetch pool stats
    const { data: poolStatsRecords } = useSWR<PoolStatsRecord[]>(
        `${network.ashApiBaseUrl}/pool`,
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
        async (collection: string, nonce: number) => {
            if (!dapp.loggedIn) return;
            return await dapp.dapp.proxy.doGetGeneric(
                `address/${new Address(
                    dapp.address
                ).bech32()}/nft/${collection}/nonce/${nonce}`,
                (res) => res.tokenData
            );
        },
        [dapp.loggedIn, dapp.dapp, dapp.address]
    );

    const getReward = useCallback(
        async (
            farm: IFarm,
            amt: BigNumber,
            collection: string,
            nonce: number
        ) => {
            
            if (!dapp.loggedIn) return new BigNumber(0);
            const data = await getSNFTAttrs(collection, nonce);
            if (!data?.attributes) return new BigNumber(0);
            const res = await dapp.dapp.proxy.queryContract(
                new Query({
                    address: new Address(farm.farm_address),
                    func: new ContractFunction(
                        "calculateRewardsForGivenPosition"
                    ),
                    args: [
                        new BigUIntValue(amt),
                        new BytesValue(Buffer.from(data.attributes, "base64")),
                    ],
                })
            );
            return new BigNumber(
                res.returnData[0] ? Buffer.from(res.returnData[0], "base64").toString("hex") : 0,
                16
            );
        },
        [dapp.loggedIn, getSNFTAttrs, dapp.dapp]
    );
    const getFarmRecords = useCallback(async () => {
        const records: FarmRecord[] = [];
        for (let i = 0; i < FARMS.length; i++) {
            const f = FARMS[i];
            const p = pools.find(
                (val) => val.lpToken.id === f.farming_token_id
            );
            if (p) {
                const record: FarmRecord = {
                    pool: p,
                    farm: f,
                    poolStats: poolStatsRecords?.find(
                        (stats) => stats.pool_address === p.address
                    ),
                };
                const ownLP = balances?.[p.lpToken.id]
                    ? balances?.[p.lpToken.id].balance
                    : new BigNumber(0);
                if (ownLP.gt(0)) {
                    const { value0, value1 } = await getTokenInLP(
                        ownLP,
                        p.address
                    );
                    record.liquidityData = {
                        ownLiquidity: ownLP,
                        capacityPercent: getPortion(p.lpToken.id, ownLP),
                        value0,
                        value1,
                        lpValueUsd: await getLPValue(ownLP, p),
                    };
                }
                const farmTokens = Object.keys(balances)
                    .filter((tokenId) => tokenId.startsWith(f.farm_token_id))
                    .map((id) => ({
                        tokenId: id,
                        collection: f.farm_token_id,
                        nonce: new BigNumber(
                            id.replace(f.farm_token_id + "-", ""),
                            16
                        ),
                        balance: balances[id].balance,
                    }));
                const isFarmed = farmTokens.some(({ balance }) =>
                    balance.gt(0)
                );
                if (isFarmed) {
                    const rewards = farmTokens.map((t) =>
                        getReward(
                            f,
                            t.balance,
                            f.farm_token_id,
                            t.nonce.toNumber()
                        )
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
        getTokenInLP,
        getPortion,
        poolStatsRecords,
        getReward,
    ]);

    const enterFarm = useCallback(
        async (amtWei: BigNumber, farm: IFarm) => {
            if (!amtWei || amtWei.eq(0) || !dapp.loggedIn || !dapp.address)
                return null;
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
                const tx = await createTransaction(new Address(dapp.address), {
                    func: new ContractFunction("MultiESDTNFTTransfer"),
                    gasLimit: new GasLimit(gasLimit),
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
                const signedTx = await dapp.dapp.provider.signTransaction(tx);
                const hash = await dapp.dapp.proxy.sendTransaction(signedTx);
                notification.open({
                    message: `Stake succeed ${toEGLDD(
                        farm.farming_token_decimal,
                        amtWei
                    )} ${farm.farming_token_id}`,
                    icon: <IconNewTab />,

                    onClick: () =>
                        window.open(
                            network.explorerAddress +
                                "/transactions/" +
                                hash.toString(),
                            "_blank"
                        ),
                });
                return hash;
            } catch (error) {
                console.log(error);
            }
            return null;
        },
        [dapp.loggedIn, dapp.dapp, dapp.address, createTransaction, farmRecords]
    );

    const createExitFarmTx = useCallback(
        async (
            lpAmt: BigNumber,
            collection: string,
            nonce: BigNumber,
            farm: IFarm
        ) => {
            if (!dapp.loggedIn) throw new Error("Connect wallet to exit farm");
            return await createTransaction(new Address(dapp.address), {
                func: new ContractFunction("ESDTNFTTransfer"),
                gasLimit: new GasLimit(gasLimit),
                args: [
                    new TokenIdentifierValue(Buffer.from(collection)),
                    new BigUIntValue(nonce),
                    new BigUIntValue(lpAmt),
                    new AddressValue(new Address(farm.farm_address)),
                    new TokenIdentifierValue(Buffer.from("exitFarm")),
                ],
            });
        },
        [dapp.loggedIn, createTransaction, dapp.address]
    );

    const exitFarm = useCallback(
        async (lpAmt: BigNumber, farm: IFarm) => {
            if(!dapp.loggedIn) return {};
            const farmRecord = farmRecords.find(
                (val) => val.farm.farm_address === farm.farm_address
            );
            if (!farmRecord || !farmRecord.stakedData) return {};
            const { stakedData } = farmRecord;
            const farmTokens = stakedData.farmTokens || [];
            let txs: Transaction[] = [];
            const entries = calcUnstakeEntries(lpAmt, farmTokens);
            const exitFarmTxCreators = entries.map(({farmToken: {collection, nonce}, unstakeAmt}) => createExitFarmTx(unstakeAmt, collection, nonce, farm))
            txs = await Promise.all(exitFarmTxCreators);
            for(let i = 1; i< txs.length; i++){
                const tx = txs[i];
                tx.setNonce(
                    txs[i - 1].getNonce().increment()
                );
            }
            const signedTxs = await dapp.dapp.provider.signTransactions(
                txs.filter((tx) => !!tx) as Transaction[]
            );
            const sentTxs = await sendMultipleTxs(signedTxs);
            notification.open({
                message: `Unstake succeed ${toEGLDD(
                    farm.farming_token_decimal,
                    lpAmt
                )} ${farm.farming_token_id}`,
                icon: <IconNewTab />,

                onClick: () => {},
            });
            return sentTxs;
        },
        [createExitFarmTx, farmRecords, dapp.dapp, dapp.loggedIn, sendMultipleTxs]
    );

    const estimateRewardOnExit = useCallback(
        async (lpAmt: BigNumber, farm: IFarm) => {
            const farmRecord = farmRecords.find(
                (val) => val.farm.farm_address === farm.farm_address
            );
            if(!farmRecord?.stakedData?.farmTokens.length) return new BigNumber(0);
            const entries = calcUnstakeEntries(
                lpAmt,
                farmRecord.stakedData.farmTokens
            );
            const rewards = entries.map(({ unstakeAmt, farmToken }) =>
                getReward(
                    farm,
                    unstakeAmt,
                    farmToken.collection,
                    farmToken.nonce.toNumber()
                )
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
            if (!dapp.loggedIn)
                throw new Error("Connect wallet to claim reward");
            return await createTransaction(new Address(dapp.address), {
                func: new ContractFunction("ESDTNFTTransfer"),
                gasLimit: new GasLimit(gasLimit),
                args: [
                    new TokenIdentifierValue(Buffer.from(collection)),
                    new BigUIntValue(nonce),
                    new BigUIntValue(lpAmt),
                    new AddressValue(new Address(farm.farm_address)),
                    new TokenIdentifierValue(Buffer.from("claimRewards")),
                ],
            });
        },
        [createTransaction, dapp.address, dapp.loggedIn]
    );
    const claimReward = useCallback(
        async (farm: IFarm) => {
            const farmRecord = farmRecords.find(
                (val) => val.farm.farm_address === farm.farm_address
            );
            if (!farmRecord || !farmRecord.stakedData)
                throw new Error("unable to claim reward");
            const { stakedData } = farmRecord;
            const farmTokens = stakedData.farmTokens || [];
            const txs: Transaction[] = [];
            for (let i = 0; i < farmTokens.length; i++) {
                const t = farmTokens[i];
                const tx = await createClaimRewardTx(
                    t.balance,
                    t.collection,
                    t.nonce,
                    farm
                );
                tx.setNonce(
                    txs[i - 1]?.getNonce().increment() || tx.getNonce()
                );
                txs.push(tx);
            }
            const signedTxs = await dapp.dapp.provider.signTransactions(txs);
            await sendMultipleTxs(signedTxs);
            notification.open({
                message: `Claim succeed ${toEGLDD(
                    ASH_TOKEN.decimals,
                    stakedData.totalRewardAmt
                )} ${ASH_TOKEN.name}`,
                // icon: <IconNewTab />,

                onClick: () => {},
            });
        },
        [createClaimRewardTx, dapp.dapp, farmRecords, sendMultipleTxs]
    );

    useEffect(() => {
        getFarmRecords();
    }, [getFarmRecords]);

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
                result = result.sort(
                    (x, y) =>
                        (y.poolStats?.emission_apr || 0) -
                        (x.poolStats?.emission_apr || 0)
                );
                break;
            case "liquidity":
                result = result.sort(
                    (x, y) =>
                        (y.poolStats?.total_value_locked || 0) -
                        (x.poolStats?.total_value_locked || 0)
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
                setSortOption,
                setKeyword,
                setStakedOnly,
                setInactive,
                enterFarm,
                claimReward,
                exitFarm,
                estimateRewardOnExit
            }}
        >
            {children}
        </FarmsContext.Provider>
    );
};

export default FarmsProvider;
