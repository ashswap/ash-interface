import { useDappContext, useDappDispatch } from "../context/dapp";
import getProviderType from "../helper/getProviderType";
import storage from "../helper/storage";

export default function useLogout() {
    const { dapp } = useDappContext();
    const dispatch = useDappDispatch();
    const providerType = getProviderType(dapp.provider);

    return ({
        callbackUrl,
        callbackRoute
    }: {
        callbackUrl?: string;
        callbackRoute?: never;
    } = {}) => {
        storage.session.clear();
        storage.local.removeItem("nonce");
        storage.local.removeItem("address");
        storage.local.removeItem("loginMethod");
        storage.local.removeItem("ledgerLogin");

        const url = callbackRoute
            ? `${window.location.origin}${callbackRoute}`
            : callbackUrl;

        if (Boolean(providerType)) {
            dapp.provider
                .logout({ callbackUrl: url })
                .then(() => {
                    dispatch({ type: "logout" });
                })
                .catch(e => {
                    console.error("Unable to perform logout", e);
                });
        } else {
            dispatch({ type: "logout" });
        }
    };
}
