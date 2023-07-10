import { useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks";
import { ashswapBaseState } from "atoms/ashswap";
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
    { id: "ALP-836706", price: 100 },
    { id: "ALP-8dcaa8", price: 40 },
];
export function useRecoilAdapter() {
    // recoil
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
        // const y = [...data.poolsV2];
        // y[0] = {...data.poolsV2[0], lpToken: fakePrice[6]}

        // const farmController = data.farmController ? {...data.farmController, farms: data.farmController.farms.filter((f: any) => FARMS.map(_f => _f.farm_address).includes(f.address))} : undefined;
        // data && setAshBaseState((state) => ({ ...state, ...data, tokens: fakePrice, pools: x, poolsV2: y, farmController}));
    }, [data, setAshBaseState]);

    // fetch tokens balance

    useGetTokens({
        refreshInterval: hasPendingTransactions ? 6000 : undefined,
    });
    useGetFarmTokens();
    usePoolsState();
    useFarmsState();
    useFarmControllerState();
}
