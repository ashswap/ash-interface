import { tokenInfoOnNetworkAtom } from "atoms/tokensState";
import { ENVIRONMENT } from "const/env";
import { TOKENS_MAP } from "const/tokens";
import { getApiNetworkProvider } from "helper/proxy/util";
import { ChainId, IESDTInfo } from "helper/token/token";
import {
    useRecoilCallback
} from "recoil";
import useSWR from "swr";

const useGetESDTInfo = (identifier: string) => {
    const fetcher = useRecoilCallback(
        ({ snapshot, set }) =>
            async (identifier: string) => {
                const cached = await snapshot.getPromise(
                    tokenInfoOnNetworkAtom(identifier)
                );
                const result =
                    TOKENS_MAP[identifier] ??
                    cached ??
                    (await getApiNetworkProvider()
                        .getDefinitionOfFungibleToken(identifier)
                        .then((t) => {
                            const esdt: IESDTInfo = {
                                chainId:
                                    ENVIRONMENT.NETWORK === "mainnet"
                                        ? ChainId.Mainnet
                                        : ChainId.Devnet,
                                decimals: t.decimals,
                                identifier: t.identifier,
                                name: t.name,
                                symbol: t.ticker,
                                logoURI: t.assets?.pngUrl,
                                projectLink: t.assets?.website,
                            };
                            return esdt;
                        }));
                if (result) {
                    set(tokenInfoOnNetworkAtom(identifier), result);
                }
                return result;
            },
        []
    );
    const { data } = useSWR(identifier, fetcher, { revalidateOnFocus: false });
    return data;
};

export default useGetESDTInfo;
