import {
    FarmInController,
    FarmInControllerAccount,
    FarmType,
} from "graphql/type.graphql";
import { FarmWeightChartRecord } from "interface/chart";
import { atom, selectorFamily } from "recoil";
import { ashswapBaseState } from "./ashswap";

export const fcFarmWeightChartRecordsAtom = atom<FarmWeightChartRecord[]>({
    key: "farm_weight_allocation_chart_records_atom",
    default: [],
});
export const fcNextFarmWeightChartRecordsAtom = atom<FarmWeightChartRecord[]>({
    key: "next_farm_weight_allocation_chart_records_atom",
    default: [],
});
export const fcFarmSelector = selectorFamily<
    FarmInController | undefined,
    string | undefined
>({
    key: "farm_controller_farm_selector",
    get:
        (farmAddress) =>
        ({ get }) => {
            if (!farmAddress) return undefined;
            const base = get(ashswapBaseState);
            return base.farmController?.farms?.find(
                (f) => f.address === farmAddress
            );
        },
});
export const fcTypeSelector = selectorFamily<
    FarmType | undefined,
    number | undefined
>({
    key: "farm_controller_farm_type_selector",
    get:
        (type) =>
        ({ get }) => {
            if (typeof type === "undefined") return undefined;
            const base = get(ashswapBaseState);
            return base.farmController?.farmTypes?.find(
                (f) => f.farmType === type
            );
        },
});
export const fcAccountFarmSelector = selectorFamily<
    FarmInControllerAccount | undefined,
    string | undefined
>({
    key: "farm_controller_account_farm_selector",
    get:
        (farmAddress) =>
        ({ get }) => {
            if (!farmAddress) return undefined;
            const base = get(ashswapBaseState);
            return base.farmController?.account?.farms?.find(
                (f) => f.address === farmAddress
            );
        },
});
