import BigNumber from "bignumber.js";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import { Dispatch, SetStateAction } from "react";
import { atom, selector } from "recoil";
type PoolRecord = {
    pool: IPool;
    poolStats?: PoolStatsRecord;
    /** if LP balance > 0 -> staked pool*/
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

export const poolRecordsState = atom<PoolRecord[]>({
    key: "pool_records",
    default: []
});

export const poolSortOptionState = atom<PoolsState["sortOption"]>({
    key: "pool_sort_option",
    default: "apr"
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
    get: ({get}) => {
        const poolRecords = get(poolRecordsState);
        const deboundKeyword = get(poolDeboundKeywordState);
        const sortOption = get(poolSortOptionState);
        let result: PoolRecord[] = [...poolRecords];
        if (deboundKeyword.trim()) {
            result = poolRecords.filter((p) =>
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
    }
})
