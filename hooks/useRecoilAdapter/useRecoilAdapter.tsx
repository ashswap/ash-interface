import { useGetPendingTransactions } from "@elrondnetwork/dapp-core/hooks";
import { useSelector } from "@elrondnetwork/dapp-core/reduxStore/DappProviderContext";
import { ashswapBaseState } from "atoms/ashswap";
import { dappCoreState } from "atoms/dappState";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import useAshBaseStateQuery from "../../graphql/useQueries/useAshBaseStateQuery";
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

    const {hasPendingTransactions} = useGetPendingTransactions();

    // const fetchBalances = useFetchBalances();
    const {data} = useAshBaseStateQuery({refreshInterval: 6000});
    useEffect(() => {data && setAshBaseState(data)}, [data, setAshBaseState]);


    // fetch tokens balance

    useGetTokens({refreshInterval: hasPendingTransactions ? 6000: undefined});
    useGetFarmTokens();
    usePoolsState();
    useFarmsState();
    useVEState();
    // connect re}coil state to dapp-core
    useEffect(() => {
        setDappState(store as any);
    }, [setDappState, store]);

    
}
