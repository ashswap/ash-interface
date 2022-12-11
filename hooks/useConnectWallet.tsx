import { accIsLoggedInState } from "atoms/dappState";
import { walletIsOpenConnectModalState } from "atoms/walletState";
import { useRecoilCallback } from "recoil"

export const useConnectWallet = () => {
    const connect = useRecoilCallback(({snapshot, set}) => async () => {
        const isLoggedIn = await snapshot.getPromise(accIsLoggedInState);
        if(!isLoggedIn){
            set(walletIsOpenConnectModalState, true);
        }
    }, []);
    return connect;
}