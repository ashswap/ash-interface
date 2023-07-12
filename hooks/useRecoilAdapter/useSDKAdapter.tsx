import { useSelector } from "@multiversx/sdk-dapp/reduxStore/DappProviderContext";
import { dappCoreState } from "atoms/dappState";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

const useSDKAdapter = () => {
    const store = useSelector((state) => state);
    const setDappState = useSetRecoilState(dappCoreState);
    useEffect(() => {
        setDappState(store as any);
    }, [setDappState, store]);
}

export default useSDKAdapter;