import { openLegalModalAtom } from "atoms/ashswap";
import { accIsLoggedInState } from "atoms/dappState";
import { walletIsOpenConnectModalState } from "atoms/walletState";
import storage from "helper/storage";
import { useRecoilCallback } from "recoil"

export const useConnectWallet = () => {
    const connect = useRecoilCallback(({snapshot, set}) => async () => {
        const isLoggedIn = await snapshot.getPromise(accIsLoggedInState);
        if(!isLoggedIn){
            if (storage.local.getItem("acceptedLegal")){
                set(walletIsOpenConnectModalState, true);
            }else {
                set(openLegalModalAtom, true);
            }
        }
    }, []);
    return connect;
}