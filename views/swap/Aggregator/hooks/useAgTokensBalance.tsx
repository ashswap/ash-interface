import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { AccountInfoSliceNetworkType } from "@multiversx/sdk-dapp/types";
import { accAddressState } from "atoms/dappState";
import { lastCompletedTxHashAtom } from "atoms/transactions";
import { ENVIRONMENT } from "const/env";
import { TOKENS_MAP } from "const/tokens";
import { fetcher } from "helper/common";
import { ChainId, IESDTInfo } from "helper/token/token";
import { TokenAmount } from "helper/token/tokenAmount";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import useSWR, { SWRConfiguration } from "swr";
import { useDebounce } from "use-debounce";
import useAgTokenList from "./useAgTokenList";
import storage from "helper/storage";
const emptyArray: any[] = [];

const useAgTokensBalance = (swrConfig: SWRConfiguration = {}) => {
    const networkConfig: AccountInfoSliceNetworkType = useGetNetworkConfig().network;
    const address = useRecoilValue(accAddressState);
    const lastCompletedTxHash = useRecoilValue(lastCompletedTxHashAtom);
    const [debounceLastTxHash] = useDebounce(lastCompletedTxHash, 750);
    const {data} = useAgTokenList();
    const ids = useMemo(() => (data || []).map(t => t.id).join(','), [data]);
    const balanceFetchKey = useMemo(() => {
        return address ? [`${networkConfig.apiAddress}/accounts/${address}/tokens?size=${ids.split(",").length}&identifiers=${ids}`, debounceLastTxHash]: null
    }, [address, debounceLastTxHash, ids, networkConfig.apiAddress]);
    const {data: balances} = useSWR<Array<{balance: string, identifier: string}>>(balanceFetchKey, fetcher, {dedupingInterval: 6000, ...swrConfig, fallbackData: emptyArray}); 
    const {data: tokens} = useSWR(ids ? `${networkConfig.apiAddress}/tokens?size=${data?.length || ""}&identifiers=${ids}` : null, (url: string) => fetcher(url).then(apiTokens => {
        let result: IESDTInfo[] = [];
        if (Array.isArray(apiTokens) && apiTokens.length > 0) {
            result = apiTokens.map((t: any) => {
                const staticESDT = TOKENS_MAP[t.identifier];
                const esdt: IESDTInfo = {
                    chainId:
                        ENVIRONMENT.NETWORK === "mainnet"
                            ? ChainId.Mainnet
                            : ChainId.Devnet,
                    decimals: t.decimals,
                    identifier: t.identifier,
                    name: staticESDT?.name || t.name,
                    symbol: staticESDT?.symbol || t.ticker,
                    logoURI: staticESDT?.logoURI || t.assets?.pngUrl || t.assets?.svgUrl,
                    projectLink: t.assets?.website,
                };
                return esdt;
            });
            storage.local.setItem({key: "agTokens", data: result});
        } else {
            result = storage.local.getItem("agTokens") as IESDTInfo[] || []
        }
        return result;
    }), {fallbackData: emptyArray, revalidateOnFocus: false});
    
    const list = useMemo(() => {
        const map = Object.fromEntries((balances || []).map(b => [b.identifier, b]));
        const tokensAmount: TokenAmount[] = (tokens || []).map((esdt) => {
            return new TokenAmount(esdt, map[esdt.identifier]?.balance || "0");
        });
        return tokensAmount;
    }, [tokens, balances]);

    return list;
}

export default useAgTokensBalance;