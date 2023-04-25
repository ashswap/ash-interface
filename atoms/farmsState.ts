import BigNumber from "bignumber.js";
import { TokenAmount } from "helper/token/tokenAmount";
import { FarmTokenAttrs, IFarm } from "interface/farm";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import { IMetaESDT } from "interface/tokens";
import { atom, selector, selectorFamily } from "recoil";
import { KeyedMutator } from "swr";
import { ViewType } from "views/stake/farms/FarmFilter";
import { ashswapBaseState } from "./ashswap";
import { accAddressState } from "./dappState";
export type FarmToken = {
    tokenId: string;
    collection: string;
    nonce: BigNumber;
    balance: BigNumber;
    attributes: FarmTokenAttrs;
    attrsRaw: string;
    weightBoost: number;
    yieldBoost: number;
    perLP: BigNumber;
    lpAmt: BigNumber;
    farmAddress: string;
};
export type FarmRecord = {
    pool: IPool;
    farm: IFarm;
    poolStats?: PoolStatsRecord;
    stakedData?: {
        farmTokens: FarmToken[];
        totalStakedLP: BigNumber;
        totalRewardAmt: BigNumber;
        rewards: TokenAmount[];
        totalStakedLPValue: BigNumber;
        weightBoost: number;
        yieldBoost: number;
        totalAPR: number;
    };
    ashPerSec: BigNumber;
    lastRewardBlockTs: number;
    farmTokenSupply: BigNumber;
    lpLockedAmt: BigNumber;
    totalLiquidityValue: BigNumber;
    ashBaseAPR: number;
    tokensAPR: {
        tokenId: string;
        apr: number;
    }[];
    tradingAPR: number;
    totalAPRMin: number;
    totalAPRMax: number;
};

export type FarmSortOption = "apr" | "liquidity" | "volume";

export const farmRecordsState = atom<FarmRecord[]>({
    key: "farm_records",
    default: [],
});

export const farmSortOptionState = atom<FarmSortOption>({
    key: "farm_sort_option",
    default: "apr",
});

export const farmKeywordState = atom<string>({
    key: "farm_keyword",
    default: "",
});

export const farmDeboundKeywordState = atom<string>({
    key: "farm_debound_keyword",
    default: "",
});

export const farmStakedOnlyState = atom<boolean>({
    key: "farm_staked_only",
    default: false,
});

export const farmViewTypeState = atom<ViewType>({
    key: "farm_view_type",
    default: ViewType.Card,
});

export const farmLoadingMapState = atom<Record<string, boolean>>({
    key: "farm_loading_map",
    default: {},
});

export const farmSessionIdMapState = atom<Record<string, string[]>>({
    key: "farm_session_id_map",
    default: {},
});

export const farmToDisplayState = selector<FarmRecord[]>({
    key: "farm_to_display",
    get: ({ get }) => {
        const farmRecords = get(farmRecordsState);
        const stakedOnly = get(farmStakedOnlyState);
        const deboundKeyword = get(farmDeboundKeywordState);
        const sortOption = get(farmSortOptionState);

        let result: FarmRecord[] = [...farmRecords].filter((p) =>
            stakedOnly ? !!p.stakedData : true
        );

        if (deboundKeyword.trim()) {
            result = farmRecords.filter((p) =>
                p.pool.tokens.some((t) =>
                    t.symbol
                        .toLowerCase()
                        .includes(deboundKeyword.trim().toLowerCase())
                )
            );
        }
        switch (sortOption) {
            case "apr":
                result = result.sort((x, y) => (y.totalAPRMax) - x.totalAPRMax);
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
                        (y.poolStats?.volume_usd || 0) -
                        (x.poolStats?.volume_usd || 0)
                );
                break;
            default:
        }
        return result;
    },
    cachePolicy_UNSTABLE: {
        eviction: "most-recent",
    },
});

export const farmTokensState = selector<FarmToken[]>({
    key: "farm_tokens_list",
    get: ({ get }) => {
        const farmRecords = get(farmRecordsState);
        return farmRecords.reduce(
            (total: FarmToken[], record) => [
                ...total,
                ...(record.stakedData?.farmTokens || []),
            ],
            []
        );
    },
    cachePolicy_UNSTABLE: {
        eviction: "most-recent",
    },
});

export const farmOwnerTokensState = selector<FarmToken[]>({
    key: "farm_owner_tokens",
    get: ({ get }) => {
        const tokens = get(farmTokensState);
        const address = get(accAddressState);
        return tokens.filter((t) => t.attributes.booster.bech32() === address);
    },
    cachePolicy_UNSTABLE: {
        eviction: "most-recent",
    },
});

export const farmTransferedTokensState = selector<FarmToken[]>({
    key: "farm_transfered_tokens",
    get: ({ get }) => {
        const tokens = get(farmTokensState);
        const address = get(accAddressState);
        return tokens.filter((t) => t.attributes.booster.bech32() !== address);
    },
    cachePolicy_UNSTABLE: {
        eviction: "most-recent",
    },
});

export const farmMapAddressState = selector({
    key: "farm_data_map_address",
    get: ({ get }) => {
        const farmRecords = get(farmRecordsState);
        return Object.fromEntries(
            farmRecords.map((f) => [f.farm.farm_address, f])
        );
    },
    cachePolicy_UNSTABLE: {
        eviction: "most-recent",
    },
});

export const farmQuery = selectorFamily({
    key: "farm_single_selector_by_address",
    get:
        (address: string) =>
        ({ get }) => {
            return get(farmMapAddressState)[address];
        },
});

export const farmOwnerTokensQuery = selectorFamily({
    key: "farm_owner_tokens_query_by_farm_address",
    get:
        (farmAddress: string) =>
        ({ get }) => {
            const farmRecord = get(farmQuery(farmAddress));
            const address = get(accAddressState);
            return (
                farmRecord.stakedData?.farmTokens?.filter(
                    (f) => f.attributes.booster.bech32() === address
                ) || []
            );
        },
    cachePolicy_UNSTABLE: {
        eviction: "most-recent",
    },
});

export const farmTransferedTokensQuery = selectorFamily({
    key: "farm_transfered_tokens_query_by_farm_address",
    get:
        (farmAddress: string) =>
        ({ get }) => {
            const farmRecord = get(farmQuery(farmAddress));
            const address = get(accAddressState);
            return (
                farmRecord.stakedData?.farmTokens?.filter(
                    (f) => f.attributes.booster.bech32() !== address
                ) || []
            );
        },
    cachePolicy_UNSTABLE: {
        eviction: "most-recent",
    },
});

export const farmPoolQuery = selectorFamily({
    key: "farm_linked_pool_query_by_farm_address",
    get:
        (farmAddress: string) =>
        ({ get }) => {
            const farm = get(farmQuery(farmAddress));
            return farm?.pool;
        },
});
// refactor

export const ashRawFarmQuery = selectorFamily({
    key: "ash_base_state_raw_farm_query_by_address",
    get:
        (address: string) =>
        ({ get }) => {
            const base = get(ashswapBaseState);
            return base.farms.find((f) => f.address === address);
        },
});

export const farmTokensRefresherAtom = atom<KeyedMutator<IMetaESDT[]>>({
    key: "refresh_farm_tokens_balance",
    default: () => Promise.resolve(undefined),
});

export const farmNumberOfAdditionalRewards = selectorFamily<number, string>({
    key: "farm_number_of_additional_rewards",
    get: (address: string) => ({get}) => {
        return get(ashRawFarmQuery(address))?.additionalRewards.length || 0;
    }
})