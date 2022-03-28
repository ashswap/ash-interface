import { AccountOnNetwork, Address, Nonce } from "@elrondnetwork/erdjs";
import { blockTimeMs } from "const/network";
import moment from "moment";
import { useRouter } from "next/router";
import { useDappContext, useDappDispatch } from "../context/dapp";
import addressIsValid from "./addressIsValid";
import getProviderType from "./getProviderType";
import storage from "./storage";

export function useGetAccount() {
    const { dapp } = useDappContext();
    return (address: string) => dapp.proxy.getAccount(new Address(address));
}

export function useGetAddress(): () => Promise<string> {
    const router = useRouter();
    const { dapp, address, loggedIn, loginMethod } = useDappContext();
    const providerType = getProviderType(dapp.provider);

    return () => {
        // ledger logged in
        if (providerType && providerType === "ledger" && loggedIn) {
            return new Promise(resolve => {
                resolve(address);
            });
            // all providers
        } else if (providerType && providerType !== "wallet") {
            return dapp.provider.getAddress();
        } else {
            // wallet
            return new Promise(resolve => {
                if (storage.session.getItem("walletLogin")) {
                    //   const urlSearchParams = new URLSearchParams(router.query);
                    const paramAddress = router.query.address as string;
                    if (addressIsValid(paramAddress)) {
                        resolve(paramAddress);
                    }
                }
                if (loggedIn) {
                    resolve(address);
                }
                resolve("");
            });
        }
    };
}

export const useSetNonce = () => {
    const dispatch = useDappDispatch();
    const { account, address } = useDappContext();
    return (nonce: number) => {
        storage.local.setItem({
            key: "nonce",
            data: nonce,
            expires: moment()
                .add(blockTimeMs, "milliseconds")
                .unix()
        });

        dispatch({
            type: "setAccount",
            account: {
                ...account,
                address,
                nonce: new Nonce(nonce)
            }
        });
    };
};

export function getLatestNonce(account: AccountOnNetwork) {
    const lsNonce = storage.local.getItem("nonce");
    const nonce =
        lsNonce && !isNaN(parseInt(lsNonce))
            ? new Nonce(Math.max(parseInt(lsNonce), account.nonce.valueOf()))
            : account.nonce;
    return nonce;
}

export function useGetAccountShard() {
    const { network, address, shard } = useDappContext();
    const dispatch = useDappDispatch();

    return (): Promise<number | undefined> =>
        new Promise(resolve => {
            if (shard === undefined) {
                fetch(`${network.apiAddress}/accounts/${address}`)
                    .then(response => response.json())
                    .then(({ shard }) => {
                        dispatch({ type: "setAccountShard", shard });
                        resolve(shard);
                    })
                    .catch(err => {
                        console.error(err);
                        resolve(undefined);
                    });
            } else {
                resolve(shard);
            }
        });
}

export function useRefreshAccount() {
    const { dapp } = useDappContext();
    const getAddress = useGetAddress();
    const getAccount = useGetAccount();
    const dispatch = useDappDispatch();

    const setAccount = () => {
        dispatch({ type: "setAccountLoading", accountLoading: true });
        getAddress()
            .then(address => {
                getAccount(address)
                    .then(account => {
                        dispatch({
                            type: "setAccount",
                            account: {
                                balance: account.balance.toString(),
                                address,
                                nonce: getLatestNonce(account),
                                ...(account.userName !== ""
                                    ? { userName: account.userName }
                                    : {})
                            }
                        });
                        dispatch({
                            type: "setAccountLoading",
                            accountLoading: false
                        });
                        dispatch({
                            type: "setAccountError",
                            accountError: undefined
                        });
                    })
                    .catch(e => {
                        dispatch({
                            type: "setAccountLoading",
                            accountLoading: false
                        });
                        dispatch({ type: "setAccountError", accountError: e });
                        console.error("Failed getting account ", e);
                    });
            })
            .catch(e => {
                dispatch({ type: "setAccountLoading", accountLoading: false });
                dispatch({ type: "setAccountError", accountError: e });
                console.error("Failed getting address ", e);
            });
    };

    return () =>
        dapp.provider.isInitialized()
            ? setAccount()
            : dapp.provider
                  .init()
                  .then(initialised => {
                      if (!initialised) {
                          return;
                      }
                      setAccount();
                  })
                  .catch(e => {
                      console.error("Failed initializing provider ", e);
                  });
}
