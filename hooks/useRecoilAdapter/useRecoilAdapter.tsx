import { useGetPendingTransactions } from "@elrondnetwork/dapp-core/hooks";
import { useSelector } from "@elrondnetwork/dapp-core/reduxStore/DappProviderContext";
import { ashswapBaseState } from "atoms/ashswap";
import { dappCoreState } from "atoms/dappState";
import { FARMS } from "const/farms";
import pools from "const/pool";
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
    withRW: true,
};
// úe local only in cáe missing token price
const fakePrice = [
    { id: "ASH-84eab0", price: 0.2 },
    { id: "USDT-3e3720", price: 1 },
    { id: "USDC-fd47e9", price: 1 },
    { id: "BUSD-b53884", price: 1 },
    { id: "ALP-68ec91", price: 1 },
    { id: "ALP-1d42c1", price: 40 },
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
    useEffect(() => {
        data && setAshBaseState(data);
        // if(!data) return;
        // const x = [...data.pools];
        // x[0] = {...data.pools[0], lpToken: fakePrice[4]}
        // x[1] = {...data.pools[1], lpToken: fakePrice[5]}

        // if(data.farmController){
        //     data.farmController = {...data.farmController, farms: data.farmController.farms.filter((f: any) => FARMS.map(_f => _f.farm_address).includes(f.address))}
        // }
        // data && setAshBaseState((state) => ({ ...state, ...data, tokens: fakePrice, pools: x }));
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
