import storage from "helper/storage";
import { useCallback, useEffect, useMemo, useState } from "react";

// note: undefined or false -> the onboarding UI has not been shown yet
type UserOnboardingStatus = {
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
};
export const useOnboarding = (key: keyof UserOnboardingStatus) => {
    const [state, setState] = useState<boolean>(false);
    useEffect(() => {
        const data: UserOnboardingStatus = storage.local.getItem("userOnboarding");
        setTimeout(() => {
            setState(!data?.[key]);
        }, 1000);
        
    }, [key]);
    const _setState = useCallback(
        (val: boolean) => {
            const newLocalState = { ...storage.local.getItem("userOnboarding"), [key]: val };
            storage.local.setItem({
                key: "userOnboarding",
                data: newLocalState,
            });
            setState(!val);
        },
        [key]
    );
    return [state, _setState] as [typeof state, typeof _setState];
};
