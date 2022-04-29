import {
    getApiProvider,
    getProxyProvider,
    useGetAccountInfo,
    useGetLoginInfo,
} from "@elrondnetwork/dapp-core";
import {
    Address,
    ApiProvider,
    Nonce,
    ProxyProvider,
    TokenOfAccountOnNetwork,
    Transaction,
    TransactionHash,
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { blockTimeMs } from "const/dappConfig";
import pools from "const/pool";
import { ASH_TOKEN, TOKENS } from "const/tokens";
import { toWei } from "helper/balance";
import { arrayFetcher, emptyFunc } from "helper/common";
import { ITokenMap } from "interface/token";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import useSWR from "swr";
export interface State {
    isOpenConnectWalletModal: boolean;
    setIsOpenConnectWalletModal: (val: boolean) => void;
    fetchBalances: () => void;
    balances: Record<string, TokenOfAccountOnNetwork>;
    tokens: ITokenMap;
    lpTokens: ITokenMap;
    tokenPrices: any;
    connectWallet: (token?: string) => void;
    insufficientEGLD: boolean;
}

const emptyTx = new Transaction({
    nonce: new Nonce(0),
    receiver: new Address(),
});

const emptyTxHash = new TransactionHash("");

export const initState: State = {
    isOpenConnectWalletModal: false,
    setIsOpenConnectWalletModal: emptyFunc,
    fetchBalances: emptyFunc,
    balances: {},
    tokens: {},
    lpTokens: {},
    tokenPrices: {},
    connectWallet: emptyFunc,
    insufficientEGLD: true,
};

export const WalletContext = createContext<State>(initState);
export function useWallet() {
    return useContext(WalletContext);
}

interface Props {
    children: any;
}
export function WalletProvider({ children }: Props) {
    // start copy from dappContext
    const { isLoggedIn: loggedIn } = useGetLoginInfo();
    const { account, address } = useGetAccountInfo();
    const proxy: ProxyProvider = getProxyProvider();
    const apiProvider: ApiProvider = getApiProvider();
    // end
    const [lpTokens, setLpTokens] = useState<ITokenMap>({});
    const [balances, setBalances] = useState<
        Record<string, TokenOfAccountOnNetwork>
    >(initState.balances);
    const [isOpenConnectWalletModal, setIsOpenConnectWalletModal] =
        useState(false);

    const insufficientEGLD = useMemo(
        () => account.balance === "0",
        [account.balance]
    );

    const tokens = useMemo(() => {
        let tokens: ITokenMap = {};
        pools.map((p) => {
            p.tokens.forEach((t) => {
                if (!Object.prototype.hasOwnProperty.call(tokens, t.id)) {
                    tokens[t.id] = t;
                }
            });
        });

        return tokens;
    }, []);

    const { data: priceEntries } = useSWR(
        TOKENS.map((token) =>
            token.id
                ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/token/${token.id}/price`
                : null
        ),
        arrayFetcher,
        { refreshInterval: 60000 }
    );

    const tokenPrices = useMemo(() => {
        const map = Object.fromEntries(
            TOKENS.map((t, i) => [
                t.id,
                priceEntries?.[i] || 0,
            ])
        );
        // dummy ash price = 1$ - TODO: get ash price from maiar after launching pool ash-usdt on maiar exchange
        // map[ASH_TOKEN.id] = 1;
        return map;
    }, [priceEntries]);

    // const lpTokens = useMemo(() => {
    //     console.log('change lp tokens');

    //     let tokens: ITokenMap = {};
    //     pools.map(p => {
    //         if (!Object.prototype.hasOwnProperty.call(tokens, p.lpToken.id)) {
    //             tokens[p.lpToken.id] = p.lpToken;
    //         }
    //     });

    //     let promiseLpSupply: any[] = [];
    //     let tokenIds: any[] = [];
    //     for (const tokenId in tokens) {
    //         if (Object.prototype.hasOwnProperty.call(tokens, tokenId)) {
    //             const lpToken = tokens[tokenId];
    //             tokenIds.push(tokenId);
    //             promiseLpSupply.push(
    //                 dapp.dapp.proxy.queryContract(
    //                     new Query({
    //                         address: new Address(
    //                             "erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u"
    //                         ),
    //                         func: new ContractFunction("getTokenProperties"),
    //                         args: [
    //                             new TokenIdentifierValue(Buffer.from(tokenId))
    //                         ]
    //                     })
    //                 )
    //             );
    //         }
    //     }

    //     Promise.all(promiseLpSupply).then(results =>
    //         results.map((r: any, i: number) => {
    //             tokens[tokenIds[i]].totalSupply = new BigNumber(
    //                 Buffer.from(r.returnData[3], "base64").toString("hex")
    //             );
    //         })
    //     );

    //     return tokens;
    // }, [dapp.dapp.proxy]);

    useEffect(() => {
        let tokens: ITokenMap = {};
        pools.map((p) => {
            if (!Object.prototype.hasOwnProperty.call(tokens, p.lpToken.id)) {
                tokens[p.lpToken.id] = p.lpToken;
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
                tokens[tokenIds[i]].totalSupply = toWei(
                    tokens[tokenIds[i]],
                    supply || "0"
                );
            });
            setLpTokens(tokens);
        });
    }, [apiProvider]);

    const fetchBalances = useCallback(() => {
        if (!loggedIn) {
            setBalances({});
            return;
        }
        proxy.getAddressEsdtList(new Address(address)).then((resp) => {
            let tokenBalancesEntries: [string, TokenOfAccountOnNetwork][] = (
                resp || []
            ).map((val) => [val.tokenIdentifier, val]);
            setBalances(Object.fromEntries(tokenBalancesEntries));
        });
    }, [loggedIn, proxy, address]);
    // fetch token balance
    useEffect(() => {
        fetchBalances();
        let interval = setInterval(fetchBalances, blockTimeMs);
        return () => {
            clearInterval(interval);
        };
    }, [fetchBalances]);

    const historyQuery = useMemo(() => {
        if (!loggedIn) {
            return "";
        }

        const parrams = new URLSearchParams();
        parrams.append("sender", address);
        parrams.append("size", "12");

        const condition = {
            query: {
                bool: {
                    should: pools.map((pool) => ({
                        term: {
                            receiver: pool.address,
                        },
                    })),
                },
            },
        };

        parrams.append("condition", JSON.stringify(condition));

        return parrams.toString();
    }, [loggedIn, address]);

    // useEffect(() => {
    //     !dapp.loggedIn && isMobileOS && walletConnectInit()
    // }, [isMobileOS, dapp.loggedIn]);
    const connectWallet = useCallback(
        (token?: string) => {
            if (loggedIn) return;
            // open connect wallet option modal
            setIsOpenConnectWalletModal(true);
        },
        [loggedIn]
    );

    /**
     * Connect directly to maiar on mobile use URI - on android and IOS only
     */
    // const connectAppMaiarOnMobile = useCallback(
    //     (token?: string) => {
    //         if (isMobileOS) {
    //             // try to generate uri and then open it up
    //             if (walletConnect) {
    //                 walletConnect.login().then((walletConectUri) => {
    //                     let uri = "";
    //                     if (token) {
    //                         uri = `${walletConectUri}&token=${token}`;
    //                         dispatch({
    //                             type: "setTokenLogin",
    //                             tokenLogin: {
    //                                 loginToken: token,
    //                             },
    //                         });
    //                     } else {
    //                         uri = walletConectUri;
    //                     }
    //                     if (typeof window !== "undefined") {
    //                         window.open(
    //                             `${
    //                                 dapp.walletConnectDeepLink
    //                             }?wallet-connect=${encodeURIComponent(uri)}`,
    //                             "_blank"
    //                         );
    //                     }
    //                 });
    //             }
    //         }
    //     },
    //     [isMobileOS, walletConnect, dispatch, dapp.walletConnectDeepLink]
    // );

    const value: State = {
        ...initState,
        tokens,
        balances,
        lpTokens,
        tokenPrices,
        insufficientEGLD,
        fetchBalances,
        isOpenConnectWalletModal,
        setIsOpenConnectWalletModal,
        connectWallet,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}
