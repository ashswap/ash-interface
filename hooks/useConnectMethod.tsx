import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { LoginMethodsEnum } from "@multiversx/sdk-dapp/types";
import { useMemo } from "react";

export const useConnectMethod = () => {
    const { loginMethod } = useGetLoginInfo();
    const loginMethodName = useMemo(() => {
        switch (loginMethod) {
            case LoginMethodsEnum.extension:
                return "Maiar Wallet Extension";
            case LoginMethodsEnum.walletconnect:
                return "Maiar App";
            case LoginMethodsEnum.wallet:
                return "Web Wallet";
            case LoginMethodsEnum.ledger:
                return "Ledger";
            default:
                return "Wallet";
        }
    }, [loginMethod]);
    return loginMethodName;
};
