import { useGetAccountProvider } from "@multiversx/sdk-dapp/hooks";
import { LoginMethodsEnum } from "@multiversx/sdk-dapp/types";
import { getAccountProviderType } from "@multiversx/sdk-dapp/utils";
import * as Sentry from "@sentry/nextjs";
import {
    atomQuestUserStats,
    questIsOpenOwnerSignModalAtom,
    questIsRegisteredAtom,
    questOwnerSignatureSelector,
} from "atoms/ashpoint";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import { ENVIRONMENT } from "const/env";
import logApi from "helper/logHelper";
import { QuestUserStatsModel } from "interface/quest";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useDebouncedCallback } from "use-debounce";

const useAshpoint = () => {
    const router = useRouter();
    const accAddress = useRecoilValue(accAddressState);
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const setIsRegistered = useSetRecoilState(questIsRegisteredAtom);
    const [userStats, setUserStats] = useRecoilState(atomQuestUserStats);
    const setIsOpenOwnerSign = useSetRecoilState(questIsOpenOwnerSignModalAtom);
    const { providerType } = useGetAccountProvider();
    const address = useRecoilValue(accAddressState);
    const { signature: ashpointSignature, rejected: ashpointRejectedSign } =
        useRecoilValue(questOwnerSignatureSelector);
    const ashpointIsRegistered = useRecoilValue(questIsRegisteredAtom);

    const getUserStats = useCallback(() => {
        if (
            ENVIRONMENT.ENABLE_ASHPOINT &&
            (ashpointSignature || !ENVIRONMENT.ENABLE_ASHPOINT_SIGN)
        ) {
            logApi
                .get<QuestUserStatsModel>("/api/v1/wallet")
                .then((res) => setUserStats(res.data))
                .catch((err) => Sentry.captureException(err));
        }
    }, [ashpointSignature, setUserStats]);

    const getUserStatsDebounce = useDebouncedCallback(getUserStats, 200);

    useEffect(() => {
        const provider = getAccountProviderType();
        if (
            accAddress &&
            isLoggedIn &&
            provider !== LoginMethodsEnum.wallet &&
            ENVIRONMENT.ENABLE_ASHPOINT_SIGN &&
            ENVIRONMENT.ENABLE_ASHPOINT
        ) {
            logApi
                .get("/api/v1/no-auth/wallet", {
                    params: { wallet: accAddress },
                })
                .then((data) => setIsRegistered(data.data.is_exist));
        }
    }, [accAddress, isLoggedIn, setIsRegistered]);

    useEffect(() => {
        getUserStatsDebounce();
    }, [getUserStatsDebounce]);

    useEffect(() => {
        if (ENVIRONMENT.ENABLE_ASHPOINT_SIGN && ENVIRONMENT.ENABLE_ASHPOINT) {
            if (
                providerType !== LoginMethodsEnum.wallet &&
                address &&
                !ashpointSignature
            ) {
                if (
                    router.pathname.startsWith("/ashpoint") ||
                    (ashpointIsRegistered && !ashpointRejectedSign)
                ) {
                    setIsOpenOwnerSign(true);
                }
            } else {
                setIsOpenOwnerSign(false);
            }
        }
    }, [
        providerType,
        router.pathname,
        address,
        ashpointSignature,
        ashpointIsRegistered,
        ashpointRejectedSign,
        setIsOpenOwnerSign,
    ]);

    useEffect(() => {
        if (!ENVIRONMENT.ENABLE_ASHPOINT_SIGN) {
            const isRegistered =
                (userStats?.wallet?.twitter_username ||
                    userStats?.wallet?.discord_id) &&
                userStats?.wallet?.wallet_address === accAddress;
            setIsRegistered(!!isRegistered);
        }
    }, [accAddress, setIsRegistered, userStats]);
};

export default useAshpoint;
