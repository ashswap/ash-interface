import { Address } from "@elrondnetwork/erdjs";
import { ReactNode, useEffect, useState } from "react";
import { useDappContext, useDappDispatch } from "../../context/dapp";
import {
    getLatestNonce,
    useGetAccount,
    useGetAddress,
    useRefreshAccount
} from "../../helper/accountMethods";
import { newWalletProvider } from "../../helper/provider";
import storage from "../../helper/storage";
import useSetProvider from "../../hooks/useSetProvider";
import { useGetNetworkConfig } from "./helpers";

const Authenticate = ({ children }: { children: ReactNode }) => {
    const dispatch = useDappDispatch();
    const {
        loggedIn,
        dapp,
        address,
        ledgerAccount,
        chainId,
        network
    } = useDappContext();
    const [loading, setLoading] = useState(false);
    const getAccount = useGetAccount();
    const getAddress = useGetAddress();
    const getNetworkConfig = useGetNetworkConfig();
    const refreshAccount = useRefreshAccount();
    const showLedgerProviderModal = useSetProvider();

    const { getItem, removeItem } = storage.session;

    useEffect(() => {
        if(loggedIn){
            refreshAccount()
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn]);
    useEffect(() => {

        if (getItem("walletLogin")) {
            setLoading(true);
            const provider = newWalletProvider(network);
            getAddress()
                .then(address => {
                    if (address) {
                        removeItem("walletLogin");
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
                                dispatch({ type: "setProvider", provider });
                                dispatch({
                                    type: "login",
                                    address,
                                    loginMethod: "wallet"
                                });
                                setLoading(false);
                            })
                            .catch(e => {
                                console.error("Failed getting account ", e);
                                removeItem("walletLogin");
                                setLoading(false);
                            });
                    } else {
                        removeItem("walletLogin");
                    }
                })
                .catch(e => {
                    console.error("Failed getting address ", e);
                    removeItem("walletLogin");
                    setLoading(false);
                });
        }
    }, [dapp.proxy]);

    const redirect = !loggedIn && !getItem("walletLogin");

    useEffect(() => {
        if (chainId.valueOf() === "-1") {
            getNetworkConfig()
                .then(networkConfig => {
                    dispatch({
                        type: "setChainId",
                        chainId: networkConfig.ChainID
                    });
                })
                .catch(e => {
                    console.error("To do ", e);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId.valueOf()]);

    const fetchAccount = () => {
        if (address && loggedIn && !getItem("walletLogin")) {
            dispatch({ type: "setAccountLoading", accountLoading: true });
            dapp.proxy
                .getAccount(new Address(address))
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
                })
                .catch(e => {
                    dispatch({ type: "setAccountError", accountError: e });
                    dispatch({
                        type: "setAccountLoading",
                        accountLoading: false
                    });
                    console.error("Failed getting account ", e);
                    setLoading(false);
                });

            if (storage.local.getItem("ledgerLogin") && !ledgerAccount) {
                const ledgerLogin = storage.local.getItem("ledgerLogin");
                dispatch({
                    type: "setLedgerAccount",
                    ledgerAccount: {
                        index: ledgerLogin.index,
                        address
                    }
                });
            }
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchAccount, [address]);

    return <>{children}</>;
};

export default Authenticate;
