import {
    Address,
    CallArguments,
    ChainID,
    ContractFunction,
    GasLimit,
    GasPrice,
    Nonce,
    Query,
    SmartContract,
    TokenIdentifierValue,
    Transaction,
    TransactionHash,
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import { gasLimit, gasPrice, network } from "const/network";
import pools from "const/pool";
import { ASH_TOKEN } from "const/tokens";
import { useDappContext, useDappDispatch } from "context/dapp";
import { emptyFunc, fetcher } from "helper/common";
import useInitWalletConnect from "hooks/useInitWalletConnect";
import { usePlatform } from "hooks/usePlatform";
import { ITokenMap } from "interface/token";
import { TokenBalancesMap } from "interface/tokenBalance";
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
    callContract: (
        addr: Address,
        arg: CallArguments
    ) => Promise<TransactionHash>;
    createTransaction: (
        addr: Address,
        arg: CallArguments
    ) => Promise<Transaction>;
    balances: TokenBalancesMap;
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
    callContract: (addr: Address, arg: CallArguments) =>
        Promise.resolve(emptyTxHash),
    createTransaction: (addr: Address, arg: CallArguments) =>
        Promise.resolve(emptyTx),
    balances: {},
    tokens: {},
    lpTokens: {},
    tokenPrices: {},
    connectWallet: emptyFunc,
    insufficientEGLD: true
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
    const dapp = useDappContext();
    // end
    const [lpTokens, setLpTokens] = useState<ITokenMap>({});
    const [balances, setBalances] = useState<TokenBalancesMap>(
        initState.balances
    );
    const [isOpenConnectWalletModal, setIsOpenConnectWalletModal] = useState(
        false
    );
    const { isMobileOS } = usePlatform();
    const dispatch = useDappDispatch();
    const { walletConnect, walletConnectInit } = useInitWalletConnect();

    const insufficientEGLD = useMemo(() => dapp.account.balance === "0", [dapp.account.balance])

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
    }, []);

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
                    dapp.dapp.proxy.queryContract(
                        new Query({
                            address: new Address(
                                "erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u"
                            ),
                            func: new ContractFunction("getTokenProperties"),
                            args: [
                                new TokenIdentifierValue(Buffer.from(tokenId)),
                            ],
                        })
                    )
                );
            }
        }

        Promise.all(promiseLpSupply).then(results => {
            results.map((r: any, i: number) => {
                const data = r.returnData[3];
                if(data && data.length > 0){
                    
                    tokens[tokenIds[i]].totalSupply = new BigNumber(
                        Buffer.from(r.returnData[3], "base64").toString("hex")
                    );
                }
            });
            setLpTokens(tokens);
        });
    }, [dapp.dapp.proxy]);

    const fetchBalances = useCallback(() => {
        if (!dapp.loggedIn) {
            return;
        }

        dapp.dapp.proxy
            .getAddressEsdtList(new Address(dapp.address))
            .then(resp => {
                let tokenBalances: TokenBalancesMap = {};

                for (const tokenId in resp) {
                    tokenBalances[tokenId] = {
                        balance: new BigNumber(resp[tokenId].balance),
                        token: tokenId === ASH_TOKEN.id ? ASH_TOKEN : tokens[tokenId],
                    };
                }
                setBalances(tokenBalances);
            });
    }, [tokens, dapp.loggedIn, dapp.dapp.proxy, dapp.address]);

    // fetch token balance
    useEffect(() => {
        let interval = setInterval(fetchBalances, 2000);
        return () => {
            clearInterval(interval);
        };
    }, [fetchBalances]);

    const callContract = useCallback(
        async (address: Address, arg: CallArguments) => {
            if (!dapp.address || !dapp.dapp.proxy || !dapp.dapp.provider) {
                return emptyTxHash;
            }

            let account = await dapp.dapp.proxy.getAccount(
                new Address(dapp.address)
            );

            let contract = new SmartContract({
                address,
            });

            let tx = contract.call(arg);
            tx = new Transaction({
                chainID: new ChainID(network.id),
                nonce: account.nonce,
                data: tx.getData(),
                receiver: address,
                gasPrice: new GasPrice(gasPrice),
                gasLimit: new GasLimit(gasLimit),
                version: tx.getVersion(),
            });
            const signedTx = await dapp.dapp.provider.signTransaction(tx);
            return await dapp.dapp.proxy.sendTransaction(signedTx);
        },
        [dapp.address, dapp.dapp.proxy, dapp.dapp.provider]
    );

    const createTransaction = useCallback(
        async (address: Address, arg: CallArguments) => {
            if (!dapp.address || !dapp.dapp.proxy || !dapp.dapp.provider) {
                return emptyTx;
            }

            let account = await dapp.dapp.proxy.getAccount(
                new Address(dapp.address)
            );

            let contract = new SmartContract({
                address,
            });

            let tx = contract.call(arg);
            tx = new Transaction({
                chainID: new ChainID(network.id),
                nonce: account.nonce,
                data: tx.getData(),
                receiver: address,
                gasPrice: new GasPrice(gasPrice),
                gasLimit: new GasLimit(gasLimit),
                version: tx.getVersion(),
            });
            return tx;
        },
        [dapp.address, dapp.dapp.proxy, dapp.dapp.provider]
    );

    const historyQuery = useMemo(() => {
        if (!dapp.loggedIn) {
            return "";
        }

        const parrams = new URLSearchParams();
        parrams.append("sender", dapp.address);
        parrams.append("size", "12");

        const condition = {
            query: {
                bool: {
                    should: pools.map(pool => ({
                        term: {
                            receiver: pool.address,
                        },
                    })),
                },
            },
        };

        parrams.append("condition", JSON.stringify(condition));

        return parrams.toString();
    }, [dapp.loggedIn, dapp.address]);

    // useEffect(() => {
    //     !dapp.loggedIn && isMobileOS && walletConnectInit()
    // }, [isMobileOS, dapp.loggedIn]);
    const connectWallet = useCallback(
        (token?: string) => {
            if (dapp.loggedIn) return;
            // open connect wallet option modal
            setIsOpenConnectWalletModal(true);
        },
        [dapp.loggedIn]
    );

    /**
     * Connect directly to maiar on mobile use URI - on android and IOS only
     */
    const connectAppMaiarOnMobile = useCallback(
        (token?: string) => {
            if (isMobileOS) {
                // try to generate uri and then open it up
                if (walletConnect) {
                    walletConnect.login().then(walletConectUri => {
                        let uri = "";
                        if (token) {
                            uri = `${walletConectUri}&token=${token}`;
                            dispatch({
                                type: "setTokenLogin",
                                tokenLogin: {
                                    loginToken: token,
                                },
                            });
                        } else {
                            uri = walletConectUri;
                        }
                        if (typeof window !== "undefined") {
                            window.open(
                                `${
                                    dapp.walletConnectDeepLink
                                }?wallet-connect=${encodeURIComponent(uri)}`,
                                "_blank"
                            );
                        }
                    });
                }
            }
        },
        [isMobileOS, walletConnect, dispatch, dapp.walletConnectDeepLink]
    );

    const value: State = {
        ...initState,
        tokens,
        balances,
        lpTokens,
        tokenPrices,
        insufficientEGLD,
        fetchBalances,
        callContract,
        createTransaction,
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
