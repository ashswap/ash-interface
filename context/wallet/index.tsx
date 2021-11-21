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

export interface State {
    provider?: ExtensionProvider;
    proxy: ProxyProvider;
    apiProvider: ApiProvider;
    slippage: number;
    connectExtension: () => void;
    disconnectExtension: () => void;
    setSlippage: (slippage: number) => void;
    fetchBalances: () => void;
    callContract: (addr: Address, arg: CallArguments) => Promise<Transaction>;
    balances: TokenBalancesMap;
    tokens: ITokenMap;
}

const emptyTx = new Transaction({
    nonce: new Nonce(0),
    receiver: new Address()
});

export const initState: State = {
    slippage: 0.001,
    proxy: new ProxyProvider(network.gatewayAddress, { timeout: 10000 }),
    apiProvider: new ApiProvider(network.apiAddress, { timeout: 10000 }),
    connectExtension: () => {},
    disconnectExtension: () => {},
    setSlippage: () => {},
    fetchBalances: () => {},
    callContract: (addr: Address, arg: CallArguments) =>
        Promise.resolve(emptyTx),
    balances: {},
    tokens: {}
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
    const [slippage, setSlippage] = useState<number>(initState.slippage);
    const [balances, setBalances] = useState<TokenBalancesMap>(
        initState.balances
    );

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
    }, [provider, tokens]);

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
    }, [provider])

    const value: State = {
        ...initState,
        tokens,
        balances,
        provider,
        slippage,
        setSlippage,
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
