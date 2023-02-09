import { userOnboardingState } from "atoms/storage";
import storage from "helper/storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

// note: undefined or false -> the onboarding UI has not been shown yet
export type UserOnboardingStatus = {
    stake_gov_1st?: boolean;
    stake_gov_extend_lock_time?: boolean;
    stake_lp?: boolean;
    swap_select_token?: boolean;
    swap_search_token?: boolean;
    swap_quick_select_token?: boolean;
    swap_pop_select_token_to?: boolean;
    swap_view_available_pair?: boolean;
    swap_input_amt?: boolean;
    swap_fair_price?: boolean;
    swap_history?: boolean;
    pool_deposit?: boolean;
    pool_deposit_input?: boolean;
    pool_deposit_checkbox?: boolean;
    pool_withdraw_input?: boolean;
    pool_withdraw_estimate?: boolean;
    pool_farm_from_added_lp?: boolean;
    farm_zero_available_ve?: boolean;
    farm_expected_ve?: boolean;
    farm_transfered_token_guide?: boolean;
    farm_max_boost?: boolean;
    dao_farm_weight_bribe?: boolean;
};
export const useOnboarding = (key: keyof UserOnboardingStatus) => {
    const [onboardingState, setStorageUserOnboardingState] =
        useRecoilState(userOnboardingState);
    useEffect(() => {
        const data: UserOnboardingStatus =
            storage.local.getItem("userOnboarding");
        setTimeout(() => {
            setStorageUserOnboardingState((state) => ({
                ...state,
                [key]: !data?.[key],
            }));
        }, 1000);
    }, [key, setStorageUserOnboardingState]);
    const _setState = useCallback(
        (val: boolean) => {
            const newLocalState = {
                ...storage.local.getItem("userOnboarding"),
                [key]: val,
            };
            storage.local.setItem({
                key: "userOnboarding",
                data: newLocalState,
            });
            setStorageUserOnboardingState((state) => ({
                ...state,
                [key]: !val,
            }));
        },
        [key, setStorageUserOnboardingState]
    );
    return [!!onboardingState[key], _setState] as [boolean, typeof _setState];
};
