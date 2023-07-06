import BigNumber from "bignumber.js";
import { POOLS_MAP_ADDRESS } from "const/pool";
import { Percent } from "helper/fraction/percent";
import IPool, { EPoolState, EPoolType } from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import { atom, selector, selectorFamily } from "recoil";
import { KeyedMutator } from "swr";
import { ashswapBaseState } from "./ashswap";
export type PoolRecord = {
    pool: IPool;
    poolStats?: PoolStatsRecord;
    totalSupply: BigNumber;
    state: EPoolState;
    /** if LP balance > 0 -> staked pool*/
    liquidityData?: {
        /** number of own LP token*/
        ownLiquidity: BigNumber;
        /** Lp reserves */
        lpReserves: BigNumber[];
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
};

export const poolRecordsState = atom<PoolRecord[]>({
    key: "pool_records",
    default: [],
});

export const poolSortOptionState = atom<PoolsState["sortOption"]>({
    key: "pool_sort_option",
    default: "apr",
});

export const poolKeywordState = atom<string>({
    key: "pool_keyword",
    default: "",
});

export const poolDeboundKeywordState = atom<string>({
    key: "pool_debound_keyword",
    default: "",
});

export const poolStakedOnlyState = atom<boolean>({
    key: "pool_staked_only",
    default: false,
});

export const poolToDisplayState = selector<PoolRecord[]>({
    key: "pool_to_display",
    get: ({ get }) => {
        const poolRecords = get(poolRecordsState);
        const deboundKeyword = get(poolDeboundKeywordState);
        const sortOption = get(poolSortOptionState);
        let result: PoolRecord[] = [...poolRecords];
        if (deboundKeyword.trim()) {
            result = poolRecords.filter((p) =>
                p.pool.tokens.some((t) =>
                    t.symbol
                        .toLowerCase()
                        .includes(deboundKeyword.trim().toLowerCase())
                )
            );
        }
        switch (sortOption) {
            case "apr":
                result = result.sort(
                    (x, y) => (y.poolStats?.apr || 0) - (x.poolStats?.apr || 0)
                );
                break;
            case "liquidity":
                result = result.sort(
                    (x, y) => (y.poolStats?.tvl || 0) - (x.poolStats?.tvl || 0)
                );
                break;
            case "volume":
                result = result.sort(
                    (x, y) =>
                        (y.poolStats?.volume_usd || 0) -
                        (x.poolStats?.volume_usd || 0)
                );
                break;
            default:
        }
        return result;
    },
});

// refactor

export const ashRawPoolV1ByAddressQuery = selectorFamily({
    key: "ash_base_state_raw_pool_v1_by_address_query",
    get:
        (address: string) =>
        ({ get }) =>
            get(ashswapBaseState).pools.find((p) => p.address === address),
});

export const LPBreakDownQuery = selectorFamily({
    key: "lp_break_down_query",
    get:
        (props: { poolAddress: string; wei: string }) =>
        ({ get }) => {
            const poolConfig = POOLS_MAP_ADDRESS[props.poolAddress];
            const pool =
                poolConfig.type === EPoolType.PoolV2
                    ? get(ashRawPoolV2ByAddressQuery(props.poolAddress))
                    : get(ashRawPoolV1ByAddressQuery(props.poolAddress));
            const lpReserves = poolConfig.tokens.map((t, i) => {
                if (!pool?.totalSupply) return new BigNumber(0);
                const val = new BigNumber(props.wei)
                    .multipliedBy(pool.reserves[i] || new BigNumber(0))
                    .div(pool.totalSupply);
                return val.integerValue(BigNumber.ROUND_FLOOR);
            });
            const valueUsd = new BigNumber(props.wei)
                .multipliedBy(pool?.lpToken.price || 0)
                .div(10 ** poolConfig.lpToken.decimals);
            return { lpReserves, valueUsd };
        },
    cachePolicy_UNSTABLE: { eviction: "most-recent" },
});

export const poolRecordQuery = selectorFamily({
    key: "pool_record_query_by_address",
    get:
        (address: string) =>
        ({ get }) =>
            get(poolRecordsState).find((p) => p.pool.address === address),
});

export const poolV1FeesQuery = selectorFamily({
    key: "pool_v1_fees_selector_by_address",
    get:
        (address: string) =>
        ({ get }) => {
            const pool = get(ashRawPoolV1ByAddressQuery(address));
            const fees = {
                swap: new Percent(pool?.swapFeePercent || 0, 100_000),
                admin: new Percent(pool?.adminFeePercent || 0, 100_000),
            };
            return fees;
        },
});

export const poolStatsRefresherAtom = atom<KeyedMutator<PoolStatsRecord[]>>({
    key: "pool_stats_record_refresher_atom",
    default: () => Promise.resolve(undefined),
});

export const ashRawPoolV2ByAddressQuery = selectorFamily({
    key: "ash_base_state_raw_pool_v2_by_address_query",
    get:
        (address: string) =>
        ({ get }) =>
            get(ashswapBaseState).poolsV2.find((p) => p.address === address),
});
