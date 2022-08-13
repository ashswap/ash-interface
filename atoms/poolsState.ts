import BigNumber from "bignumber.js";
import { POOLS_MAP_ADDRESS } from "const/pool";
import { Percent } from "helper/fraction/percent";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import { atom, selector, selectorFamily } from "recoil";
import { ashswapBaseState } from "./ashswap";
export type PoolRecord = {
    pool: IPool;
    poolStats?: PoolStatsRecord;
    totalSupply: BigNumber;
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
                    (x, y) =>
                        (y.poolStats?.apr_day || 0) -
                        (x.poolStats?.apr_day || 0)
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
    },
});

// refactor

export const ashRawPoolMapByIdSelector = selector({
    key: "ash_base_state_raw_pool_map_by_id",
    get: ({ get }) => {
        const base = get(ashswapBaseState);
        return Object.fromEntries(
            base.pools.map((p) => {
                return [p.lpToken.id, p];
            })
        );
    },
    cachePolicy_UNSTABLE: {
        eviction: "most-recent",
    },
});

export const ashRawPoolByAddressQuery = selectorFamily({
    key: "ash_base_state_raw_pool_by_address_query",
    get:
        (address: string) =>
        ({ get }) => 
            get(ashswapBaseState).pools.find(p => p.address === address),
});

export const LPBreakDownQuery = selectorFamily({
    key: "lp_break_down_query",
    get:
        (props: { poolAddress: string; wei: string }) =>
        ({ get }) => {
            const pool = get(ashRawPoolByAddressQuery(props.poolAddress));
            const poolConfig = POOLS_MAP_ADDRESS[props.poolAddress];
            const lpReserves = poolConfig.tokens.map((t, i) => {
                if (!pool?.totalSupply) return new BigNumber(0);
                const val = new BigNumber(props.wei)
                    .multipliedBy(pool.reserves[i] || new BigNumber(0))
                    .div(pool.totalSupply);
                return val.integerValue(BigNumber.ROUND_FLOOR);
            });
            const valueUsd = new BigNumber(props.wei).multipliedBy(pool?.lpToken.price || 0).div(10 ** poolConfig.lpToken.decimals);
            return { lpReserves, valueUsd };
        },
    cachePolicy_UNSTABLE: {eviction: "most-recent"}
});

export const poolRecordQuery = selectorFamily({
    key: "pool_record_query_by_address",
    get: (address: string) => ({get}) => get(poolRecordsState).find(p => p.pool.address === address)
})

export const poolFeesQuery = selectorFamily({
    key: "pool_fees_selector_by_address",
    get: (address: string) => ({get}) => {
        const pool = get(ashRawPoolByAddressQuery(address));
        const fees = {
            swap: new Percent(pool?.swapFeePercent || 0, 100_000),
            admin: new Percent(pool?.adminFeePercent || 0, 100_000)
        }
        return fees;
    }
})
