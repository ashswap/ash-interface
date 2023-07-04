import { ashswapBaseState } from "atoms/ashswap";
import { accAddressState, accBalanceState } from "atoms/dappState";
import {
    tokenMapState,
    tokensRefresherAtom
} from "atoms/tokensState";
import { DAPP_CONFIG } from "const/dappConfig";
import { TOKENS } from "const/tokens";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { toEGLDD } from "helper/balance";
import { fetcher } from "helper/common";
import produce from "immer";
import { useEffect, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useSWR, { SWRConfiguration } from "swr";

const useGetTokens = (config?: SWRConfiguration) => {
    const accAddress = useRecoilValue(accAddressState);
    const { tokens, pools: rawPoolsV1, poolsV2: rawPoolsV2 } = useRecoilValue(ashswapBaseState);
    const egldBalance = useRecoilValue(accBalanceState);
    const setTokenMap = useSetRecoilState(tokenMapState);
    const setTokenRefresher = useSetRecoilState(tokensRefresherAtom);
    const tokenIds = useMemo(
        () => [
            ...TOKENS.map((t) => t.identifier).filter(t => t !== "EGLD"),
            // ...pools.map((p) => p.lpToken.identifier),
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
            const map = produce(state, (draft) => {
                const tokenMap = Object.fromEntries(
                    tokens.map((t) => [t.id, t])
                );
                const dataMap = Object.fromEntries(
                    data?.map((t) => [t.identifier, t]) || []
                );
                Object.keys(draft).map((id) => {
                    draft[id].price = (id === "EGLD" ? tokenMap[WRAPPED_EGLD.wegld]?.price : tokenMap[id]?.price) || 0;
                    draft[id].balance = id === "EGLD" ? egldBalance.toString() : dataMap[id]?.balance || "0";
                    draft[id].valueUsd = toEGLDD(
                        draft[id].decimals,
                        draft[id].balance
                    )
                        .multipliedBy(draft[id].price)
                        .toNumber();
                });
            });
            return { ...map };
        });
    }, [data, tokens, setTokenMap, egldBalance]);

    useEffect(() => {
        setTokenRefresher(() => mutate);
    }, [setTokenRefresher, mutate]);
};

export default useGetTokens;
