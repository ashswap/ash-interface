import { ExtensionProvider, HWProvider } from "@elrondnetwork/erdjs";
import { useEffect, useState } from "react";
import { useDappContext, useDappDispatch } from "../context/dapp";
import { useGetAddress } from "../helper/accountMethods";
import getProviderType, { newWalletProvider } from "../helper/provider";
import storage from "../helper/storage";
import useInitWalletConnect from "./useInitWalletConnect";
import useLogout from "./useLogout";

export default function useSetProvider() {
    const { network, dapp } = useDappContext();
    const dispatch = useDappDispatch();
    const { getItem } = storage.session;
    const getAddress = useGetAddress();
    const [showLedgerProviderModal, setShowLedgerProviderModal] = useState(
        false
    );
    const logout = useLogout();

    const walletConnectLogin = getItem("walletConnectLogin");

    const { callbackRoute, logoutRoute } = walletConnectLogin
        ? walletConnectLogin
        : { callbackRoute: "", logoutRoute: "" };

    const { walletConnectInit } = useInitWalletConnect({
        callbackRoute,
        logoutRoute
    });

    useEffect(() => {
        const loginMethod = storage.local.getItem("loginMethod");
        const providerType = getProviderType(dapp.provider);

        if (!providerType) {
            switch (true) {
                case Boolean(loginMethod === "ledger"):
                case Boolean(storage.local.getItem("ledgerLogin")): {
                    const hwWalletP = new HWProvider(dapp.proxy);
                    hwWalletP
                        .init()
                        .then((success: any) => {
                            if (!success) {
                                setShowLedgerProviderModal(false);
                                console.warn("Could not initialise ledger app");
                                return;
                            }
                            const addressIndex =
                                storage.local.getItem("ledgerLogin").index || 0;
                            if (addressIndex !== 0) {
                                setShowLedgerProviderModal(true);
                                hwWalletP
                                    .login({
                                        addressIndex:
                                            storage.local.getItem("ledgerLogin")
                                                .index || 0
                                    })
                                    .then(() => {
                                        dispatch({
                                            type: "setProvider",
                                            provider: hwWalletP
                                        });
                                        setShowLedgerProviderModal(false);
                                    })
                                    .catch(err => {
                                        setShowLedgerProviderModal(false);
                                        dispatch({
                                            type: "setProvider",
                                            provider: hwWalletP
                                        });
                                        logout({
                                            callbackUrl: window.location.href
                                        });
                                        console.error(
                                            "Could not log into ledger provider",
                                            err
                                        );
                                    });
                            } else {
                                dispatch({
                                    type: "setProvider",
                                    provider: hwWalletP
                                });
                            }
                        })
                        .catch(err => {
                            setShowLedgerProviderModal(false);
                            console.error(
                                "Could not initialise ledger app",
                                err
                            );
                        });
                    break;
                }

                case Boolean(loginMethod === "walletconnect"):
                case Boolean(walletConnectLogin): {
                    walletConnectInit();
                    break;
                }

                case Boolean(loginMethod === "wallet"): {
                    const provider = newWalletProvider(network);
                    dispatch({ type: "setProvider", provider });
                    break;
                }

                case Boolean(loginMethod === "extension"):
                case Boolean(getItem("extensionLogin")): {
                    getAddress()
                        .then(address => {
                            const provider = ExtensionProvider.getInstance().setAddress(
                                address
                            );
                            provider
                                .init()
                                .then((success: any) => {
                                    if (success) {
                                        dispatch({
                                            type: "setProvider",
                                            provider
                                        });
                                    } else {
                                        console.error(
                                            "Could not initialise extension, make sure Elrond wallet extension is installed."
                                        );
                                    }
                                })
                                .catch(err => {
                                    console.error(
                                        "Unable to login to ExtensionProvider",
                                        err
                                    );
                                });
                        })
                        .catch(e => {
                            console.log(e);
                        });

                    break;
                }
            }
        }
    }, []);
    return showLedgerProviderModal;
}
