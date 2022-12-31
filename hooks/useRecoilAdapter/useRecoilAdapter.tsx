import { useGetPendingTransactions } from "@elrondnetwork/dapp-core/hooks";
import { useSelector } from "@elrondnetwork/dapp-core/reduxStore/DappProviderContext";
import { ashswapBaseState } from "atoms/ashswap";
import { dappCoreState } from "atoms/dappState";
import { GraphOptions } from "graphql/type";
import useGraphQLQueryOptions from "graphql/useQueries/useGraphQLQueryOptions";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import useAshBaseStateQuery from "../../graphql/useQueries/useAshBaseStateQuery";
import useFarmControllerState from "./useFarmControllerState";
import useFarmsState from "./useFarmsState";
import useGetFarmTokens from "./useGetFarmTokens";
import useGetTokens from "./useGetTokens";
import usePoolsState from "./usePoolsState";
import useVEState from "./useVEState";

const config: GraphOptions = {
    withBlockchain: true,
    withFarms: true,
    withFD: true,
    withPools: true,
    withSupply: true,
    withTokens: true,
    withVE: true,
};
const fakePrice = [
    { id: "ASH-77a5df", price: 0.2 },
    { id: "USDT-324eda", price: 1 },
    { id: "USDC-6c5d88", price: 1 },
    { id: "WUSDC-232e24", price: 1 },
    { id: "LPT-227ae7", price: 1 },
    { id: "LPT-179382", price: 1 },
];
export function useRecoilAdapter() {
    // copy whole dappContext to recoil
    const store = useSelector((state) => state);
    // end

    // recoil
    const setDappState = useSetRecoilState(dappCoreState);
    const setAshBaseState = useSetRecoilState(ashswapBaseState);
    // end recoil

    const { hasPendingTransactions } = useGetPendingTransactions();

    // const fetchBalances = useFetchBalances();
    const { data } = useAshBaseStateQuery({ refreshInterval: 6000 });
    useGraphQLQueryOptions(config);
    useEffect(() => console.log("adapter"), []);
    useEffect(() => {
        if(!data) return;
        const x = [...data.pools];
        x[0] = {...data.pools[0], lpToken: fakePrice[4]}
        x[1] = {...data.pools[1], lpToken: fakePrice[5]}
        data && setAshBaseState((state) => ({ ...state, ...data, tokens: fakePrice, pools: x }));
    }, [data, setAshBaseState]);

    // fetch tokens balance

    useGetTokens({
        refreshInterval: hasPendingTransactions ? 6000 : undefined,
    });
    useGetFarmTokens();
    usePoolsState();
    useFarmsState();
    useVEState();
    useFarmControllerState();
    // connect re}coil state to dapp-core
    useEffect(() => {
        setDappState(store as any);
    }, [setDappState, store]);
}
