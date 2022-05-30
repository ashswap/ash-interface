import { getProxyProvider } from "@elrondnetwork/dapp-core";
import {
    Address,
    ProxyProvider,
    TokenOfAccountOnNetwork,
} from "@elrondnetwork/erdjs/out";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import { walletBalanceState } from "atoms/walletState";
import { useRecoilCallback } from "recoil";

export const useFetchBalances = () => {
    const fetchBalances = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                try {
                    const isLoggedIn = await snapshot.getPromise(
                        accIsLoggedInState
                    );
                    const address = await snapshot.getPromise(accAddressState);
                    if (!isLoggedIn) {
                        set(walletBalanceState, {});
                        return;
                    }
                    const proxy: ProxyProvider = getProxyProvider();
                    proxy
                        .getAddressEsdtList(new Address(address))
                        .then((resp) => {
                            let tokenBalancesEntries: [
                                string,
                                TokenOfAccountOnNetwork
                            ][] = (resp || []).map((val) => [
                                val.tokenIdentifier,
                                val,
                            ]);
                            set(
                                walletBalanceState,
                                Object.fromEntries(tokenBalancesEntries)
                            );
                        });
                } catch (error) {
                    console.error(error);
                }
            },
        []
    );
    return fetchBalances;
};
