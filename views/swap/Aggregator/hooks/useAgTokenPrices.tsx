import { ENVIRONMENT } from "const/env";
import { fetcher } from "helper/common";
import { getTokenIdFromCoin } from "helper/token";
import { useMemo } from "react";
import useSWR, { SWRConfiguration } from "swr";

const useAgTokenPrices = (esdtIds: string[], swrConfig: SWRConfiguration) => {
    const ids = useMemo(() => {
        return esdtIds
            .map((id) => getTokenIdFromCoin(id))
            .filter((id) => !!id)
            .join(",");
    }, [esdtIds]);
    return useSWR(
        esdtIds.length > 0
            ? [`${ENVIRONMENT.AG_API}/tokens/price?ids=${ids}`, esdtIds]
            : null,
        async ([url, esdtIds]) => {
            return fetcher([
                url,
                {
                    headers: { "authen-token": ENVIRONMENT.AG_TOKEN_SECRET },
                },
            ]).then((res: Array<{ token_id: string; price: number }>) => {
                const map = Object.fromEntries(
                    res.map((r) => [r.token_id, r.price])
                );
                esdtIds.map((id) => {
                    const _id = getTokenIdFromCoin(id);
                    if (_id) {
                        map[id] = map[_id];
                    }
                });
                return map;
            });
        },
        swrConfig
    );
};

export default useAgTokenPrices;
