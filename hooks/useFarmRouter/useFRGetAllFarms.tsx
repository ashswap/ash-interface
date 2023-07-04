import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSWR, { SWRConfiguration } from "swr";
const emptyArray: any[] = [];
const useFRGetAllFarms = (swrConfig: SWRConfiguration = {}) => {
    return useSWR<string[]>(
        ASHSWAP_CONFIG.dappContract.farmRouter,
        async (farmRouter) => {
            const addresses = await ContractManager.getFarmRouterContract(
                farmRouter
            )
                .getAllFarmAddresses()
                .then((addresses) => addresses.map((addr) => addr.bech32()))
                .catch(() => []);
            return addresses;
        },
        {
            fallbackData: emptyArray,
            ...swrConfig
        }
    );
}
export default useFRGetAllFarms;