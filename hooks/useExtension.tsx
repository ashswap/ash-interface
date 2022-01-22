import { ExtensionProvider } from "@elrondnetwork/erdjs";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useDappDispatch } from "../context/dapp";
import buildUrlParams from "../helper/buildUrlParams";
import storage from "../helper/storage";
export const useExtensionLogin = ({
    callbackRoute,
    token,
    onLogin,
    onInit
}: {
    callbackRoute?: string;
    token?: string;
    onLogin?: () => void;
    onInit?: (success: boolean) => void;
} = {}) => {
    const dispatch = useDappDispatch();
    const router = useRouter();
    const _callbackRoute = callbackRoute ?? router.asPath;
    const onErrorRef = useRef<(success: boolean) => void>();
    const onLoginRef = useRef<() => void>();

    useEffect(() => {
        onErrorRef.current = onInit;
    }, [onInit]);
    useEffect(() => {
        onLoginRef.current = onLogin;
    }, [onLogin]);

    return () => {
        const provider = ExtensionProvider.getInstance();
        return provider
            .init()
            .then(async initialised => {
                if (initialised) {
                    storage.session.setItem({
                        key: "extensionLogin",
                        data: {},
                        expires: moment()
                            .add(1, "minutes")
                            .unix()
                    });
                    await provider.login({
                        callbackUrl: encodeURIComponent(
                            `${window.location.origin}${_callbackRoute}`
                        ),

                        ...(token ? { token } : {})
                    });

                    dispatch({ type: "setProvider", provider });

                    const { signature, address } = provider.account;
                    const url = new URL(
                        `${window.location.origin}${_callbackRoute}`
                    );

                    const { nextUrlParams } = buildUrlParams(url.search, {
                        address,
                        ...(signature ? { signature } : {}),
                        ...(token ? { loginToken: token } : {})
                    });

                    router.push(`${url.pathname}?${nextUrlParams}`);

                    dispatch({
                        type: "login",
                        address,
                        loginMethod: "extension"
                    });
                    if (typeof onLoginRef.current === "function") {
                        onLoginRef.current();
                    }
                } else {
                    console.warn(
                        "Something went wrong trying to redirect to wallet login.."
                    );
                }
                if (typeof onErrorRef.current === "function") {
                    onErrorRef.current(initialised);
                }
            })
            .catch(err => {
                console.warn(err);
                // if (typeof onErrorRef.current === "function") {
                //     onErrorRef.current(err);
                // }
            });
    };
};
