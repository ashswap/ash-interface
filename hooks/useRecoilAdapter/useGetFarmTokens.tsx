import { accAddressState } from "atoms/dappState";
import { farmTokensRefresherAtom } from "atoms/farmsState";
import { farmTokenMapState } from "atoms/tokensState";
import { DAPP_CONFIG } from "const/dappConfig";
import { FARMS } from "const/farms";
import { fetcher } from "helper/common";
import { IMetaESDT } from "interface/tokens";
import { useEffect, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useSWR, { SWRConfiguration } from "swr";

const useGetFarmTokens = (config?: SWRConfiguration) => {
    const accAddress = useRecoilValue(accAddressState);
    const setFarmTokenMap = useSetRecoilState(farmTokenMapState);
    const setFarmTokensRefresher = useSetRecoilState(farmTokensRefresherAtom);
    const collections = useMemo(() => FARMS.map((f) => f.farm_token_id), []);
    const { data, error, mutate } = useSWR<IMetaESDT[]>(
        accAddress
            ? `${DAPP_CONFIG.apiAddress}/accounts/${accAddress}/nfts?size=${collections.length * 2}&collections=${collections}&type=MetaESDT`
            : null,
        fetcher,
        config
    );
    useEffect(() => {
        if (!error && data && Array.isArray(data)) {
            const map: Record<string, IMetaESDT[]> = Object.fromEntries(
                FARMS.map((f) => [f.farm_token_id, []])
            );
            data.map((t) => {
                map[t.collection].push(t);
            });
            setFarmTokenMap(map);
        }
    }, [data, error, setFarmTokenMap]);

    useEffect(() => {
        setFarmTokensRefresher(() => mutate);
    }, [setFarmTokensRefresher, mutate]);
};

export default useGetFarmTokens;
