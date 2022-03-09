import {
    Address,
    ArgSerializer,
    BigUIntValue,
    ContractFunction,
    EndpointParameterDefinition,
    Query,
    TypeExpressionParser,
    TypeMapper,
} from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { network } from "const/network";
import pools from "const/pool";
import { useDappContext } from "context/dapp";
import { useWallet } from "context/wallet";
import { toEGLD } from "helper/balance";
import { fetcher } from "helper/common";
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
const emptyFunc = () => {};
type PoolRecord = {
    pool: IPool;
    poolStats?: PoolStatsRecord;
    /** if LP balance > 0 -> staked pool*/
    stakedData?: {
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
export type PoolsState = {
    poolRecords: PoolRecord[];
    poolToDisplay: PoolRecord[];
    sortOption: "apr" | "liquidity" | "volume";
    keyword: string;
    stakedOnly: boolean;
    inactive: boolean;
    setSortOption: Dispatch<SetStateAction<"apr" | "liquidity" | "volume">>;
    setKeyword: Dispatch<SetStateAction<string>>;
    setStakedOnly: Dispatch<SetStateAction<boolean>>;
    setInactive: Dispatch<SetStateAction<boolean>>;
};
const initState: PoolsState = {
    poolRecords: [],
    poolToDisplay: [],
    sortOption: "apr",
    keyword: "",
    stakedOnly: false,
    inactive: false,
    setSortOption: emptyFunc,
    setKeyword: emptyFunc,
    setStakedOnly: emptyFunc,
    setInactive: emptyFunc,
};
const PoolsContext = createContext<PoolsState>(initState);
export const usePools = () => {
    return useContext(PoolsContext);
};
const PoolsProvider = ({ children }: any) => {
    const [poolRecords, setPoolRecords] = useState<PoolRecord[]>([]);
    const [sortOption, setSortOption] =
        useState<PoolsState["sortOption"]>("apr");
    const [keyword, setKeyword] = useState<string>("");
    const [deboundKeyword] = useDebounce(keyword, 500);
    const [stakedOnly, setStakedOnly] = useState(false);
    const [inactive, setInactive] = useState(false);
    const { balances } = useWallet();
    const dapp = useDappContext();
    const { lpTokens, tokenPrices } = useWallet();
    // fetch pool stats
    const { data: poolStatsRecords } = useSWR<PoolStatsRecord[]>(
        `${network.ashApiBaseUrl}/pool`,
        fetcher
    );

    const getTokenInLP = useCallback(
        (ownLiquidity: BigNumber, poolAddress: string) => {
            return dapp.dapp.proxy
                .queryContract(
                    new Query({
                        address: new Address(poolAddress),
                        func: new ContractFunction("getRemoveLiquidityTokens"),
                        args: [
                            new BigUIntValue(ownLiquidity),
                            new BigUIntValue(new BigNumber(0)),
                            new BigUIntValue(new BigNumber(0)),
                        ],
                    })
                )
                .then(({ returnData }) => {
                    let resultHex = Buffer.from(
                        returnData[0],
                        "base64"
                    ).toString("hex");
                    let parser = new TypeExpressionParser();
                    let mapper = new TypeMapper();
                    let serializer = new ArgSerializer();

                    let type = parser.parse("tuple2<BigUint,BigUint>");
                    let mappedType = mapper.mapType(type);

                    let endpointDefinitions = [
                        new EndpointParameterDefinition(
                            "foo",
                            "bar",
                            mappedType
                        ),
                    ];
                    let values = serializer.stringToValues(
                        resultHex,
                        endpointDefinitions
                    );

                    return {
                        value0: new BigNumber(
                            values[0].valueOf().field0.toString()
                        ),
                        value1: new BigNumber(
                            values[0].valueOf().field1.toString()
                        ),
                    };
                });
        },
        [dapp.dapp.proxy]
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

    const getLPValue = useCallback(
        (pool: IPool, balance0, balance1) => {
            let token0 = pool.tokens[0];
            let token1 = pool.tokens[1];

            if (!balance0 || !balance1) {
                return new BigNumber(0);
            }

            const valueUsd0 = toEGLD(token0, balance0.toString()).multipliedBy(
                tokenPrices[token0.id]
            );
            const valueUsd1 = toEGLD(token1, balance1.toString()).multipliedBy(
                tokenPrices[token1.id]
            );

            return valueUsd0.plus(valueUsd1);
        },
        [tokenPrices]
    );

    const getPoolRecords = useCallback(async () => {
        const records: PoolRecord[] = [];
        for (let i = 0; i < pools.length; i++) {
            const p = pools[i];
            let record: PoolRecord = {
                pool: p,
                poolStats: poolStatsRecords?.find(
                    (stats) => stats.pool_address === p.address
                ),
            };
            const ownLP = balances?.[p.lpToken.id]
                ? balances?.[p.lpToken.id].balance
                : new BigNumber(0);
            if (ownLP.gt(0)) {
                const { value0, value1 } = await getTokenInLP(ownLP, p.address);
                record.stakedData = {
                    ownLiquidity: ownLP,
                    capacityPercent: getPortion(p.lpToken.id, ownLP),
                    value0,
                    value1,
                    lpValueUsd: getLPValue(p, value0, value1),
                };
            }
            records.push(record);
        }
        setPoolRecords(records);
    }, [balances, getTokenInLP, getPortion, getLPValue, poolStatsRecords]);

    useEffect(() => {
        getPoolRecords();
    }, [getPoolRecords]);

    const poolToDisplay = useMemo(() => {
        let result: PoolRecord[] = [...poolRecords];
        if(deboundKeyword.trim()){
            result = poolRecords.filter((p) =>
            p.pool.tokens.some((t) =>
                t.name
                    .toLowerCase()
                    .includes(deboundKeyword.trim().toLowerCase())
            )
        )
        }
        switch(sortOption){
            case "apr":
                result = result.sort((x, y) => (y.poolStats?.emission_apr || 0) - (x.poolStats?.emission_apr || 0));
                break;
            case "liquidity":
                result = result.sort((x, y) => (y.poolStats?.total_value_locked || 0) - (x.poolStats?.total_value_locked || 0));
                break;
            case "volume":
                result = result.sort((x, y) => (y.poolStats?.usd_volume || 0) - (x.poolStats?.usd_volume || 0));
                break;
            default:        
        }
        return result;
    }, [poolRecords, deboundKeyword, sortOption]);

    return (
        <PoolsContext.Provider
            value={{
                ...initState,
                poolRecords,
                poolToDisplay,
                sortOption,
                keyword,
                stakedOnly,
                inactive,
                setSortOption,
                setKeyword,
                setStakedOnly,
                setInactive,
            }}
        >
            {children}
        </PoolsContext.Provider>
    );
};

export default PoolsProvider;
