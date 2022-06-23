import {
    getApiProvider, useGetAccountInfo,
    useGetLoginInfo
} from "@elrondnetwork/dapp-core";
import {
    ApiProvider
} from "@elrondnetwork/erdjs";
import { accInfoState, accLoginInfoState } from "atoms/dappState";
import {
    walletLPMapState,
    walletTokenPriceState
} from "atoms/walletState";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { blockTimeMs } from "const/dappConfig";
import pools from "const/pool";
import { TOKENS } from "const/tokens";
import { toWei } from "helper/balance";
import { arrayFetcher } from "helper/common";
import { useFetchBalances } from "hooks/useFetchBalances";
import { ITokenMap } from "interface/token";
import {
    useEffect
} from "react";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";
import useInterval from "./useInterval";

export function useRecoilAdapter() {
    // start copy from dappContext
    const loginInfo = useGetLoginInfo();
    const accInfo = useGetAccountInfo();
    const apiProvider: ApiProvider = getApiProvider();
    // end

    // recoil
    const setLoginInfo = useSetRecoilState(accLoginInfoState);
    const setAccInfo = useSetRecoilState(accInfoState);
    const setTokenPrices = useSetRecoilState(walletTokenPriceState);
    const setLpTokens = useSetRecoilState(walletLPMapState);
    // end recoil

    const fetchBalances = useFetchBalances();

    // connect recoil state to dapp-core
    useEffect(() => {
        setAccInfo(accInfo);
    }, [accInfo, setAccInfo]);

    useEffect(() => {
        setLoginInfo(loginInfo);
    }, [loginInfo, setLoginInfo]);

    const { data: priceEntries } = useSWR<number[]>(
        TOKENS.map((token) =>
            token.id
                ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/token/${token.id}/price`
                : null
        ),
        arrayFetcher,
        { refreshInterval: 60000 }
    );

    useEffect(() => {
        const map = Object.fromEntries(
            TOKENS.map((t, i) => [t.id, priceEntries?.[i] || 0])
        );
        setTokenPrices(map);
    }, [setTokenPrices, priceEntries]);

    useEffect(() => {
        let tokens: ITokenMap = {};
        pools.map((p) => {
            if (!Object.prototype.hasOwnProperty.call(tokens, p.lpToken.id)) {
                tokens[p.lpToken.id] = {...p.lpToken};
            }
        });

        let promiseLpSupply: Promise<string>[] = [];
        let tokenIds: any[] = [];
        for (const tokenId in tokens) {
            if (Object.prototype.hasOwnProperty.call(tokens, tokenId)) {
                tokenIds.push(tokenId);
                promiseLpSupply.push(
                    apiProvider
                        .getToken(tokenId)
                        .then((val) => val.supply)
                        .catch(() => "0")
                );
            }
        }

        Promise.all(promiseLpSupply).then((results) => {
            results.map((supply, i) => {
                tokens[tokenIds[i]] = {
                    ...tokens[tokenIds[i]],
                    totalSupply: toWei(
                        tokens[tokenIds[i]],
                        supply || "0"
                    )
                };
            });
            setLpTokens(tokens);
        });
    }, [apiProvider, setLpTokens]);

    // fetch token balance every block
    useInterval(fetchBalances, blockTimeMs);
}
