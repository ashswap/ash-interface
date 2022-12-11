import { UserOnboardingStatus } from "hooks/useOnboarding";
import { atom } from "recoil";

export const userOnboardingState = atom<UserOnboardingStatus>({
    key: "storage_user_onboarding",
    default: {}
})