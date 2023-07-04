import { ENVIRONMENT } from "const/env";
import { fetcher } from "helper/common";
import useSWR, { SWRConfiguration } from "swr";

const useAgTokenList = (swrConfig: SWRConfiguration = {}) => {
    const res = useSWR<
        Array<{ id: string; decimal?: number; coingeckoId?: string }>
    >(
        `${ENVIRONMENT.AG_API}/tokens`,
        (url) =>
            fetcher(url, {
                headers: { "authen-token": ENVIRONMENT.AG_TOKEN_SECRET },
            }),
        swrConfig
    );
    return res;
};

export default useAgTokenList;
