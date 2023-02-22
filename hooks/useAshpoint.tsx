import { useGetAccountProvider } from "@elrondnetwork/dapp-core/hooks";
import { LoginMethodsEnum } from "@elrondnetwork/dapp-core/types";
import { getAccountProviderType } from "@elrondnetwork/dapp-core/utils";
import * as Sentry from "@sentry/nextjs";
import {
    atomQuestUserStats,
    questIsOpenOwnerSignModalAtom,
    questIsRegisteredAtom,
    questOwnerSignatureSelector
} from "atoms/ashpoint";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import { ENVIRONMENT } from "const/env";
import logApi from "helper/logHelper";
import { QuestUserStatsModel } from "interface/quest";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

const useAshpoint = () => {
    const router = useRouter();
    const accAddress = useRecoilValue(accAddressState);
    const isLoggedIn = useRecoilValue(accIsLoggedInState);
    const setIsRegistered = useSetRecoilState(questIsRegisteredAtom);
    const setUserStats = useSetRecoilState(atomQuestUserStats);
    const setIsOpenOwnerSign = useSetRecoilState(questIsOpenOwnerSignModalAtom);
    const { providerType } = useGetAccountProvider();
    const address = useRecoilValue(accAddressState);
    const { signature: ashpointSignature, rejected: ashpointRejectedSign } =
        useRecoilValue(questOwnerSignatureSelector);
    const ashpointIsRegistered = useRecoilValue(questIsRegisteredAtom);

    const getUserStats = useCallback(() => {
        if (ENVIRONMENT.ENABLE_ASHPOINT && ashpointSignature) {
            logApi
                .get<QuestUserStatsModel>("/api/v1/wallet")
                .then((res) => setUserStats(res.data))
                .catch((err) => Sentry.captureException(err));
        }
    }, [ashpointSignature, setUserStats]);

    useEffect(() => {
        const provider = getAccountProviderType();
        if (accAddress && isLoggedIn && provider !== LoginMethodsEnum.wallet) {
            logApi
                .get("/api/v1/no-auth/wallet", {
                    params: { wallet: accAddress },
                })
                .then((data) => setIsRegistered(data.data.is_exist));
        }
    }, [accAddress, isLoggedIn, setIsRegistered]);

    useEffect(() => getUserStats(), [getUserStats]);

    useEffect(() => {
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
    }, [
        providerType,
        router.pathname,
        address,
        ashpointSignature,
        ashpointIsRegistered,
        ashpointRejectedSign,
        setIsOpenOwnerSign,
    ]);
};

export default useAshpoint;
