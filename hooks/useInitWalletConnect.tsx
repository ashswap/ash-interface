import { WalletConnectProvider } from "@elrondnetwork/erdjs";
import useLogout from "hooks/useLogout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDappContext, useDappDispatch } from "../context/dapp";
import storage from "../helper/storage";

interface InitWalletConnectType {
    callbackRoute?: string;
    logoutRoute?: string;
    onLogin?: () => void;
    onLogout?: () => void;
}

export default function useInitWalletConnect({
    callbackRoute,
    logoutRoute,
    onLogin,
    onLogout
}: InitWalletConnectType = {}) {
    let heartbeatDisconnectInterval: any;
    const heartbeatInterval = 15000;
    const { dapp, walletConnectBridge } = useDappContext();
    const logout = useLogout();

    const dispatch = useDappDispatch();
    const router = useRouter();

    const [error, setError] = useState<string>("");
    const [walletConnect, setWalletConnect] = useState<WalletConnectProvider>();

    const provider: any = dapp.provider;
    const _callbackRoute = callbackRoute ?? router.asPath;
    const _logoutRoute = logoutRoute ?? router.asPath;
    useEffect(() => {
        heartbeat();
        const interval = setInterval(() => {
            heartbeat();
        }, heartbeatInterval);

        return () => clearInterval(interval);
    }, [provider]);

    useEffect(() => {
        return () => {
            if (
                provider &&
                "walletConnector" in provider &&
                provider.walletConnector.connected
            ) {
                window.addEventListener("storage", e => {
                    if (e.key === "walletconnect") {
                        handleOnLogout();
                    }
                });
            }
        };
    });

    const heartbeat = () => {
        if (
            provider &&
            "walletConnector" in provider &&
            provider.walletConnector.connected
        ) {
            if (
                !provider.walletConnector.peerMeta.description.match(
                    /(iPad|iPhone|iPod)/g
                )
            ) {
                provider
                    .sendCustomMessage({
                        method: "heartbeat",
                        params: {}
                    })
                    .then(() => {})
                    .catch((e: any) => {
                        console.error("Connection lost", e);
                        handleOnLogout();
                    });
            }
        }
    };

    const handleOnLogin = () => {
        const provider: any = dapp.provider;
        provider
            .getAddress()
            .then((address: string) => {
                const loggedIn = !!storage.local.getItem("loginMethod");
                if (!loggedIn) {
                    router.push(_callbackRoute);
                }
                provider.getSignature().then((signature: string) => {
                    if (signature) {
                        const tokenLogin = storage.session.getItem(
                            "tokenLogin"
                        );
                        const loginToken =
                            tokenLogin && "loginToken" in tokenLogin
                                ? tokenLogin.loginToken
                                : "";

                        dispatch({
                            type: "setTokenLogin",
                            tokenLogin: {
                                loginToken,
                                signature
                            }
                        });
                        dispatch({
                            type: "setWalletConnectLogin",
                            walletConnectLogin: {
                                loginType: "walletConnect",
                                callbackRoute: _callbackRoute,
                                logoutRoute: _logoutRoute
                            }
                        });
                        dispatch({
                            type: "login",
                            address,
                            loginMethod: "walletconnect"
                        });
                        
                    } else {
                        dispatch({
                            type: "setWalletConnectLogin",
                            walletConnectLogin: {
                                loginType: "walletConnect",
                                callbackRoute: _callbackRoute,
                                logoutRoute: _logoutRoute
                            }
                        });
                        dispatch({
                            type: "login",
                            address,
                            loginMethod: "walletconnect"
                        });
                    }
                });

                provider.walletConnector.on("heartbeat", () => {
                    clearInterval(heartbeatDisconnectInterval);
                    heartbeatDisconnectInterval = setInterval(() => {
                        console.log("Maiar Wallet Connection Lost");
                        handleOnLogout();
                        clearInterval(heartbeatDisconnectInterval);
                    }, 150000);
                });
            })
            .catch((e: any) => {
                setError("Invalid address");
                console.log(e);
            });
        if (typeof onLogin === "function") {
            onLogin();
        }
    };

    const handleOnLogout = () => {
        if (!!storage.local.getItem("loginMethod")) {
            router.push(_logoutRoute);
        }
        logout({ callbackUrl: `${window.location.origin}${_logoutRoute}` });
        if (typeof onLogout === "function") {
            onLogout();
        }
    };

    const walletConnectInit = () => {
        const provider = new WalletConnectProvider(
            dapp.proxy,
            walletConnectBridge,
            {
                onClientLogin: handleOnLogin,
                onClientLogout: handleOnLogout
            }
        );
        dispatch({ type: "setProvider", provider });
        dapp.provider = provider;
        setWalletConnect(provider);
    };

    return {
        error,
        walletConnectInit,
        walletConnect
    };
}
