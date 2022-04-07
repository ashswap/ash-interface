import storage from "helper/storage";
import { useCallback, useEffect, useMemo, useState } from "react";

// note: undefined or false -> the onboarding UI has not been shown yet
type UserOnboardingStatus = {
    stake_gov_1st?: boolean;
    stake_gov_extend_lock_time?: boolean;
    stake_lp?: boolean;
};
export const useOnboarding = (key: keyof UserOnboardingStatus) => {
    const [state, setState] = useState<boolean>(false);
    const [localState, setLocalState] = useState<UserOnboardingStatus>({});
    useEffect(() => {
        const data: UserOnboardingStatus = storage.local.getItem("userOnboarding");
        setState(!data?.[key]);
    }, [key]);
    const _setState = useCallback(
        (val: boolean) => {
            const newLocalState = { ...localState, [key]: val };
            storage.local.setItem({
                key: "userOnboarding",
                data: newLocalState,
            });
            setLocalState(newLocalState);
            setState(!val);
        },
        [key, localState]
    );
    return [state, _setState] as [typeof state, typeof _setState];
};
