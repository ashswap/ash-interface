import { ashswapBaseState } from "atoms/ashswap";
import { accAddressState } from "atoms/dappState";
import {
    lpTokenMapState,
    tokenMapState,
    tokensRefresherAtom
} from "atoms/tokensState";
import { DAPP_CONFIG } from "const/dappConfig";
import pools from "const/pool";
import { TOKENS } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { fetcher } from "helper/common";
import produce from "immer";
import { useEffect, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useSWR, { SWRConfiguration } from "swr";

const useGetTokens = (config?: SWRConfiguration) => {
    const accAddress = useRecoilValue(accAddressState);
    const { tokens, pools: rawPools } = useRecoilValue(ashswapBaseState);
    const setTokenMap = useSetRecoilState(tokenMapState);
    const setLPTokenMap = useSetRecoilState(lpTokenMapState);
    const setTokenRefresher = useSetRecoilState(tokensRefresherAtom);
    const tokenIds = useMemo(
        () => [
            ...TOKENS.map((t) => t.identifier),
            ...pools.map((p) => p.lpToken.identifier),
        ],
        []
    );
    const { data, mutate } = useSWR<{ balance: string; identifier: string }[]>(
        accAddress
            ? `${DAPP_CONFIG.apiAddress}/accounts/${accAddress}/tokens?identifiers=${tokenIds}&size=${tokenIds.length}`
            : null,
        fetcher,
        config
    );

    useEffect(() => {
        setTokenMap((state) => {
            return produce(state, (draft) => {
                const tokenMap = Object.fromEntries(
                    tokens.map((t) => [t.id, t])
                );
                const dataMap = Object.fromEntries(
                    data?.map((t) => [t.identifier, t]) || []
                );
                Object.keys(draft).map((id) => {
                    draft[id].price = tokenMap[id]?.price || 0;
                    draft[id].balance = dataMap[id]?.balance || "0";
                    draft[id].valueUsd = toEGLDD(
                        draft[id].decimals,
                        draft[id].balance
                    )
                        .multipliedBy(draft[id].price)
                        .toNumber();
                });
            });
        });
    }, [data, tokens, setTokenMap]);
    useEffect(() => {
        setLPTokenMap((state) => {
            return produce(state, (draft) => {
                const rawPoolMap = Object.fromEntries(
                    rawPools.map((p) => [p.lpToken.id, p])
                );
                const dataMap = Object.fromEntries(
                    data?.map((t) => [t.identifier, t]) || []
                );
                Object.keys(draft).map((id) => {
                    draft[id].balance = dataMap[id]?.balance || "0";
                    draft[id].price = rawPoolMap[id]?.lpToken?.price || 0;
                    draft[id].valueUsd = toEGLDD(
                        draft[id].decimals,
                        draft[id].balance
                    )
                        .multipliedBy(draft[id].price)
                        .toNumber();
                });
            });
        });
    }, [data, rawPools, setLPTokenMap]);

    useEffect(() => {
        setTokenRefresher(() => mutate);
    }, [setTokenRefresher, mutate]);
};

export default useGetTokens;
