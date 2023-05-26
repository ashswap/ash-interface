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

const useAgTokensBalance = (swrConfig: SWRConfiguration = {}) => {
    const networkConfig: AccountInfoSliceNetworkType = useGetNetworkConfig().network;
    const address = useRecoilValue(accAddressState);
    const lastCompletedTxHash = useRecoilValue(lastCompletedTxHashAtom);
    const [debounceLastTxHash] = useDebounce(lastCompletedTxHash, 750);
    const {data} = useSWR<Array<{id: string, decimal?: number; coingeckoId?: string}>>(`${ENVIRONMENT.AG_API}/tokens`, fetcher);
    const ids = useMemo(() => (data || []).map(t => t.id).join(','), [data]);
    const balanceFetchKey = useMemo(() => {
        return address ? [`${networkConfig.apiAddress}/accounts/${address}/tokens?identifiers=${ids}`, debounceLastTxHash]: null
    }, [address, debounceLastTxHash, ids, networkConfig.apiAddress]);
    const {data: balances} = useSWR<Array<{balance: string, identifier: string}>>(balanceFetchKey, (url) => fetcher(url), {dedupingInterval: 6000, ...swrConfig}); 
    const {data: tokens} = useSWR(`${networkConfig.apiAddress}/tokens?identifiers=${ids}`, fetcher);
    const list = useMemo(() => {
        const map = Object.fromEntries((balances || []).map(b => [b.identifier, b]));
        const tokensAmount: TokenAmount[] = (tokens || []).map((t: any) => {
            const esdt: IESDTInfo = {
                chainId:
                    ENVIRONMENT.NETWORK === "mainnet"
                        ? ChainId.Mainnet
                        : ChainId.Devnet,
                decimals: t.decimals,
                identifier: t.identifier,
                name: t.name,
                symbol: t.ticker,
                logoURI: TOKENS_MAP[t.identifier]?.logoURI || t.assets?.svgUrl || t.assets?.pngUrl,
                projectLink: t.assets?.website,
            };
            return new TokenAmount(esdt, map[esdt.identifier]?.balance || "0");
        });
        
        return tokensAmount;
    }, [tokens, balances]);
    return list;
}

export default useAgTokensBalance;