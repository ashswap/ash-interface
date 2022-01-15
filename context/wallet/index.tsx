import {
    Address,
    ApiProvider,
    CallArguments,
    ChainID,
    ContractFunction,
    ExtensionProvider,
    GasLimit,
    GasPrice,
    Nonce,
    ProxyProvider,
    Query,
    SmartContract,
    TokenIdentifierValue,
    Transaction
} from "@elrondnetwork/erdjs";
import {
    createContext,
    useCallback,
    useContext,
    useState,
    useEffect,
    useMemo
} from "react";
import { gasLimit, gasPrice, network } from "const/network";
import BigNumber from "bignumber.js";
import pools from "const/pool";
import { ITokenMap } from "interface/token";
import { TokenBalancesMap } from "interface/tokenBalance";
import { emptyFunc, fetcher } from "helper/common";
import useSWR from "swr";

export interface State {
    provider?: ExtensionProvider;
    proxy: ProxyProvider;
    apiProvider: ApiProvider;
    connectExtension: () => void;
    disconnectExtension: () => void;
    fetchBalances: () => void;
    callContract: (addr: Address, arg: CallArguments) => Promise<Transaction>;
    balances: TokenBalancesMap;
    tokens: ITokenMap;
    transactionsHistory: any[];
    lpTokens: ITokenMap;
    tokenPrices: any;
}

const emptyTx = new Transaction({
    nonce: new Nonce(0),
    receiver: new Address()
});

export const initState: State = {
    proxy: new ProxyProvider(network.gatewayAddress, { timeout: 10000 }),
    apiProvider: new ApiProvider(network.apiAddress, { timeout: 10000 }),
    connectExtension: emptyFunc,
    disconnectExtension: emptyFunc,
    fetchBalances: emptyFunc,
    callContract: (addr: Address, arg: CallArguments) =>
        Promise.resolve(emptyTx),
    balances: {},
    tokens: {},
    lpTokens: {},
    transactionsHistory: [],
    tokenPrices: {}
};

export const WalletContext = createContext<State>(initState);
export function useWallet() {
    return useContext(WalletContext);
}

interface Props {
    children: any;
}
export function WalletProvider({ children }: Props) {
    const [provider, setProvider] = useState<ExtensionProvider | undefined>(
        undefined
    );
    const [balances, setBalances] = useState<TokenBalancesMap>(
        initState.balances
    );
    const [transactionsHistory, setTransactionsHistory] = useState<any>([]);

    const tokens = useMemo(() => {
        let tokens: ITokenMap = {};
        pools.map(p => {
            p.tokens.forEach(t => {
                if (!Object.prototype.hasOwnProperty.call(tokens, t.id)) {
                    tokens[t.id] = t;
                }
            });
        });

        return tokens;
    }, pools);

    let tokenPrices: any = {};
    for (const tokenId in tokens) {
        if (Object.prototype.hasOwnProperty.call(tokens, tokenId)) {
            const token = tokens[tokenId];
            const tokenPriceResponse = useSWR(
                tokens
                    ? "https://api.coingecko.com/api/v3/coins/" +
                          token.coingeckoId
                    : null,
                fetcher
            );
            if (tokenPriceResponse.data) {
                tokenPrices[tokenId] =
                    tokenPriceResponse.data.market_data.current_price.usd;
                tokenPrices = { ...tokenPrices };
            }
        }
    }

    const lpTokens = useMemo(() => {
        let tokens: ITokenMap = {};
        pools.map(p => {
            if (!Object.prototype.hasOwnProperty.call(tokens, p.lpToken.id)) {
                tokens[p.lpToken.id] = p.lpToken;
            }
        });

        let promiseLpSupply: any[] = [];
        let tokenIds: any[] = [];
        for (const tokenId in tokens) {
            if (Object.prototype.hasOwnProperty.call(tokens, tokenId)) {
                const lpToken = tokens[tokenId];
                tokenIds.push(tokenId);
                promiseLpSupply.push(
                    initState.proxy.queryContract(
                        new Query({
                            address: new Address(
                                "erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u"
                            ),
                            func: new ContractFunction("getTokenProperties"),
                            args: [
                                new TokenIdentifierValue(Buffer.from(tokenId))
                            ]
                        })
                    )
                );
            }
        }

        Promise.all(promiseLpSupply).then(results =>
            results.map((r: any, i: number) => {
                tokens[tokenIds[i]].totalSupply = new BigNumber(
                    Buffer.from(r.returnData[3], "base64").toString("hex")
                );
            })
        );

        return tokens;
    }, pools);

    const fetchBalances = useCallback(() => {
        if (!provider) {
            return;
        }

        initState.proxy
            .getAddressEsdtList(new Address(provider?.account.address))
            .then(resp => {
                let tokenBalances: TokenBalancesMap = {};

                for (const tokenId in resp) {
                    if (
                        Object.prototype.hasOwnProperty.call(resp, tokenId) &&
                        (tokens[tokenId] || lpTokens[tokenId])
                    ) {
                        tokenBalances[tokenId] = {
                            balance: new BigNumber(resp[tokenId].balance),
                            token: tokens[tokenId]
                        };
                    }
                }

                setBalances(tokenBalances);
            });
    }, [provider, tokens, lpTokens]);

    // fetch token balance
    useEffect(() => {
        fetchBalances();
    }, [provider, fetchBalances]);

    const connectExtension = useCallback(() => {
        if (provider) {
            return;
        }

        const newProvider = ExtensionProvider.getInstance();
        newProvider
            .init()
            .then(async initialised => {
                if (initialised) {
                    await newProvider.login({
                        callbackUrl: encodeURIComponent(
                            `${window.location.origin}`
                        )
                    });

                    setProvider(newProvider);

                    const { signature, address } = newProvider.account;
                } else {
                    console.warn(
                        "Something went wrong trying to redirect to wallet login.."
                    );
                }
            })
            .catch(err => {
                console.warn(err);
            });
    }, [provider]);

    const callContract = useCallback(
        async (address: Address, arg: CallArguments) => {
            if (!provider) {
                return emptyTx;
            }

            let account = await initState.proxy.getAccount(
                new Address(provider.account.address)
            );

            let contract = new SmartContract({
                address
            });

            let tx = contract.call(arg);
            tx = new Transaction({
                chainID: new ChainID(network.id),
                nonce: account.nonce,
                data: tx.getData(),
                receiver: address,
                gasPrice: new GasPrice(gasPrice),
                gasLimit: new GasLimit(gasLimit),
                version: tx.getVersion()
            });

            return await provider?.sendTransaction(tx);
        },
        [provider]
    );

    const disconnectExtension = useCallback(() => {
        provider?.logout();
        setProvider(undefined);
    }, [provider]);

    const historyQuery = useMemo(() => {
        if (!provider) {
            return "";
        }

        const parrams = new URLSearchParams();
        parrams.append("sender", provider.account.address);
        parrams.append("size", "12");

        const condition = {
            query: {
                bool: {
                    should: pools.map(pool => ({
                        term: {
                            receiver: pool.address
                        }
                    }))
                }
            }
        };

        parrams.append("condition", JSON.stringify(condition));

        return parrams.toString();
    }, [provider]);

    const { data } = useSWR(
        provider ? network.apiAddress + "/transactions?" + historyQuery : null,
        fetcher
    );

    useEffect(() => {
        if (data) {
            setTransactionsHistory(data);
        }
    }, [data]);

    const value: State = {
        ...initState,
        tokens,
        balances,
        provider,
        transactionsHistory,
        lpTokens,
        tokenPrices,
        connectExtension,
        disconnectExtension,
        fetchBalances,
        callContract
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}
