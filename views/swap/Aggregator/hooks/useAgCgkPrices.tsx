import { getTokenIdFromCoin } from "helper/token";
import { useMemo } from "react";
import useCoingeckoPrice from "hooks/useCoingeckoPrice";
import useAgTokenList from "./useAgTokenList";
import { SWRConfiguration } from "swr";

const useAgCgkPrices = (esdtIds: string[], swrConfig: SWRConfiguration = {}) => {
    const { data: agTokens } = useAgTokenList();
    const agTokensMap = useMemo(() => {
        return Object.fromEntries(agTokens?.map((t) => [t.id, t]) || []);
    }, [agTokens]);
    const pairCgkIds = useMemo(() => {
        return esdtIds
            .map((id) => getTokenIdFromCoin(id))
            .filter((id) => !!id)
            .map((id) => agTokensMap[id!]?.coingeckoId)
            .filter((id) => !!id) as string[];
    }, [agTokensMap, esdtIds]);
    const { data: coingeckoPrices } = useCoingeckoPrice(pairCgkIds, ['usd'], swrConfig);
    const prices = useMemo(() => {
        return Object.fromEntries(
            esdtIds.map((_id) => {
                const id = getTokenIdFromCoin(_id);
                return [
                    _id,
                    id && agTokensMap[id] && coingeckoPrices
                        ? coingeckoPrices[agTokensMap[id]?.coingeckoId || ""]
                              ?.usd || 0
                        : 0,
                ];
            })
        );
    }, [agTokensMap, coingeckoPrices, esdtIds]);
    return prices;
};

export default useAgCgkPrices;
