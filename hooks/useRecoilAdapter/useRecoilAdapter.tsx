import { useSelector } from "@elrondnetwork/dapp-core/reduxStore/DappProviderContext";
import { ashswapBaseState } from "atoms/ashswap";
import { dappCoreState } from "atoms/dappState";
import { blockTimeMs } from "const/dappConfig";
import { useFetchBalances } from "hooks/useFetchBalances";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import useAshBaseStateQuery from "../../graphql/useQueries/useAshBaseStateQuery";
import useInterval from "../useInterval";
import useFarmsState from "./useFarmsState";
import useGetFarmTokens from "./useGetFarmTokens";
import useGetTokens from "./useGetTokens";
import usePoolsState from "./usePoolsState";
import useVEState from "./useVEState";

export function useRecoilAdapter() {
    // copy whole dappContext to recoil
    const store = useSelector((state) => state);
    // end

    // recoil
    const setDappState = useSetRecoilState(dappCoreState);
    const setAshBaseState = useSetRecoilState(ashswapBaseState);
    // end recoil

    // const fetchBalances = useFetchBalances();
    const {data} = useAshBaseStateQuery({refreshInterval: 6000});
    useEffect(() => {data && setAshBaseState(data)}, [data, setAshBaseState]);


    // fetch tokens balance

    useGetTokens();
    useGetFarmTokens();
    usePoolsState();
    useFarmsState();
    useVEState();
    // connect re}coil state to dapp-core
    useEffect(() => {
        setDappState(store as any);
    }, [setDappState, store]);

    
}
