import { ashswapBaseState } from "atoms/ashswap";
import { accAddressState } from "atoms/dappState";
import {
    lpTokenMapState,
    tokenMapState,
    tokensRefresherAtom,
} from "atoms/tokensState";
import { DAPP_CONFIG } from "const/dappConfig";
import { ASH_TOKEN, TOKENS } from "const/tokens";
import { fetcher } from "helper/common";
import { useEffect, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useSWR, { SWRConfiguration } from "swr";
import produce from "immer";
import { toEGLDD } from "helper/balance";
import pools from "const/pool";

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
                tokens.map(
                    (t) => draft[t.id] && (draft[t.id].price = t.price || 0)
                );
                data?.map(
                    (t) =>
                        draft[t.identifier] &&
                        (draft[t.identifier].balance = t.balance || "0")
                );
                TOKENS.map(
                    (t) =>
                        (draft[t.identifier].valueUsd = toEGLDD(
                            t.decimals,
                            draft[t.identifier].balance
                        )
                            .multipliedBy(draft[t.identifier].price)
                            .toNumber())
                );
            });
        });
    }, [data, tokens, setTokenMap]);
    useEffect(() => {
        setLPTokenMap((state) => {
            return produce(state, (draft) => {
                rawPools.map(
                    (p) =>
                        draft[p.lpToken.id] &&
                        (draft[p.lpToken.id].price = p.lpToken.price || 0)
                );
                data?.map(
                    (t) =>
                        draft[t.identifier] &&
                        (draft[t.identifier].balance = t.balance || "0")
                );
                pools.map(
                    ({ lpToken: t }) =>
                        draft[t.identifier] &&
                        (draft[t.identifier].valueUsd = toEGLDD(
                            t.decimals,
                            draft[t.identifier].balance
                        )
                            .multipliedBy(draft[t.identifier].price)
                            .toNumber())
                );
            });
        });
    }, [data, rawPools, setLPTokenMap]);

    useEffect(() => {
        setTokenRefresher(() => mutate);
    }, [setTokenRefresher, mutate]);
};

export default useGetTokens;
