import {
    Address,
    GasLimit,
    ContractFunction,
    TokenIdentifierValue,
    BigUIntValue,
    U64Value,
    TransactionHash,
    Query,
    AddressValue,
    TypeExpressionParser,
    TypeMapper,
    ArgSerializer,
    EndpointParameterDefinition,
    Transaction,
    Nonce,
} from "@elrondnetwork/erdjs";
import { notification } from "antd";
import BigNumber from "bignumber.js";
import {
    blockTimeMs,
    dappContract,
    gasLimit,
    network,
    shardId,
} from "const/network";
import { ASH_TOKEN } from "const/tokens";
import { useWallet } from "context/wallet";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import IconNewTab from "assets/svg/new-tab-green.svg";
import { toEGLD } from "helper/balance";
import { emptyFunc } from "helper/common";
import { TokenBalance } from "interface/tokenBalance";
import { useDappContext } from "context/dapp";
import moment from "moment";
import { queryContractParser } from "helper/serializer";
import { IToken } from "interface/token";
import IPool from "interface/pool";
import pools from "const/pool";
type GovStakeState = {
    lockASH: (
        weiAmt: BigNumber,
        unlockTimestamp: BigNumber
    ) => Promise<TransactionHash | null>;
    lockMoreASH: ({weiAmt, unlockTimestamp}: {weiAmt?: BigNumber, unlockTimestamp?: BigNumber}) => Promise<any>
    lockedAmt: BigNumber;
    veASH: BigNumber;
    unlockTS: BigNumber;
    totalSupplyVeASH: BigNumber;
    totalLockedAmt: BigNumber;
    rewardLPAmt: BigNumber;
    rewardLPToken?: IPool;
    claimReward: () => Promise<TransactionHash | null>
};
const initState: GovStakeState = {
    lockASH: (amt, unlock) => Promise.resolve(null),
    lockMoreASH: () => Promise.resolve(null),
    lockedAmt: new BigNumber(0),
    veASH: new BigNumber(0),
    unlockTS: new BigNumber(0),
    totalSupplyVeASH: new BigNumber(0),
    totalLockedAmt: new BigNumber(0),
    rewardLPAmt: new BigNumber(0),
    claimReward: () => Promise.resolve(null)
};
const StakeGovContext = createContext(initState);
export const useStakeGov = () => {
    return useContext(StakeGovContext);
};
const StakeGovProvider = ({ children }: any) => {
    const [currentBlock, setCurrentBlock] = useState<number>();
    const [lockedAmt, setLockedAmt] = useState<BigNumber>(new BigNumber(0));
    const [totalLockedAmt, setTotalLockedAmt] = useState<BigNumber>(new BigNumber(0));
    const [veASH, setVEASH] = useState<BigNumber>(new BigNumber(0));
    const [unlockTS, setUnlockTS] = useState<BigNumber>(new BigNumber(0));
    const [totalSupplyVeASH, setTotalSupplyVeASH] = useState<BigNumber>(new BigNumber(0));
    const [rewardLPAmt, setRewardLPAmt] = useState<BigNumber>(new BigNumber(0));
    const [rewardLPToken, setRewardLPToken] = useState<IPool>();
    const { callContract, createTransaction, balances, lpTokens } = useWallet();
    const dapp = useDappContext();

    const lockASH = useCallback(
        async (weiAmt: BigNumber, unlockTimestamp: BigNumber) => {
            try {
                const tx = await callContract(
                    new Address(dappContract.voteEscrowedContract),
                    {
                        func: new ContractFunction("ESDTTransfer"),
                        gasLimit: new GasLimit(gasLimit),
                        args: [
                            new TokenIdentifierValue(Buffer.from(ASH_TOKEN.id)),
                            new BigUIntValue(weiAmt),
                            new TokenIdentifierValue(
                                Buffer.from("create_lock")
                            ),
                            new U64Value(unlockTimestamp),
                        ],
                    }
                );
                notification.open({
                    message: `Lock succeed ${toEGLD(
                        ASH_TOKEN,
                        weiAmt?.toString() || "0"
                    )} ${ASH_TOKEN.name}, unlock on ${moment.unix(unlockTimestamp.toNumber()).format("DD MMM, yyyy")}`,
                    icon: <IconNewTab />,
                    onClick: () =>
                        window.open(
                            network.explorerAddress +
                                "/transactions/" +
                                tx.toString(),
                            "_blank"
                        ),
                });
                return tx;
            } catch (error) {
                console.log(error);
                return null;
            }
        },
        [callContract]
    );

    const getNetworkStatus = useCallback(() => {
        dapp.dapp.apiProvider
            .doGetGeneric(`network/status/${shardId}`, (res) => res.data)
            .then((val) => {
                setCurrentBlock(val?.status?.erd_nonce);
            });
    }, [dapp.dapp.apiProvider]);

    const getVEASHAmt = useCallback(() => {
        if (!dapp.loggedIn || !lockedAmt || lockedAmt.eq(0)) return;
        const ts = moment().unix();
        dapp.dapp.proxy
            .queryContract(
                new Query({
                    address: new Address(dappContract.voteEscrowedContract),
                    func: new ContractFunction("balanceOfAtTs"),
                    args: [
                        new AddressValue(new Address(dapp.address)),
                        new BigUIntValue(new BigNumber(ts)),
                    ],
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(
                    returnData,
                    "BigUint"
                );
                setVEASH(values[0]?.valueOf() || new BigNumber(0))
            });
    }, [dapp.loggedIn, dapp.dapp, dapp.address, lockedAmt]);

    const getLockedAmt = useCallback(() => {
        if (!dapp.loggedIn) return;
        dapp.dapp.proxy
            .queryContract(
                new Query({
                    address: new Address(dappContract.voteEscrowedContract),
                    func: new ContractFunction("locked"),
                    args: [new AddressValue(new Address(dapp.address))],
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(
                    returnData,
                    "tuple2<BigUint,U64>"
                );
                setLockedAmt(values[0]?.valueOf().field0 || new BigNumber(0));
                setUnlockTS(values[0]?.valueOf().field1 || new BigNumber(0));
            });
    }, [dapp.loggedIn, dapp.dapp, dapp.address]);

    const getTotalSupplyVeASH = useCallback(() => {
        if(!dapp.loggedIn) return;
        const ts = moment().unix();
        dapp.dapp.proxy.queryContract(
            new Query({
                address: new Address(dappContract.voteEscrowedContract),
                func: new ContractFunction("totalSupplyAtTs"),
                args: [
                    new BigUIntValue(new BigNumber(ts))
                ]
            })
        ).then(({returnData}) => {
            const values = queryContractParser(returnData, "BigUint");
            setTotalSupplyVeASH(values[0]?.valueOf() || new BigNumber(0))
        })
    }, [dapp.loggedIn, dapp.dapp]);

    const getRewardAmt = useCallback(() => {
        if(!dapp.loggedIn) return;
        dapp.dapp.proxy.queryContract(
            new Query({
                address: new Address(dappContract.feeDistributor),
                func: new ContractFunction("getClaimableAmount"),
                args: [
                    new AddressValue(new Address(dapp.address))
                ]
            })
        ).then(({returnData}) => {
            const values = queryContractParser(returnData, "BigUint");
            setRewardLPAmt(values[0]?.valueOf() || new BigNumber(0));
        })
    }, [dapp.loggedIn, dapp.dapp, dapp.address]);

    const getTotalLockedAmt = useCallback(() => {
        dapp.dapp.proxy.queryContract(
            new Query({
                address: new Address(dappContract.voteEscrowedContract),
                func: new ContractFunction("totalLock")
            })
        ).then(({returnData}) => {
            const values = queryContractParser(returnData, "BigUint");
            setTotalLockedAmt(values[0]?.valueOf() || new BigNumber(0));
        })
    }, [dapp.dapp]);

    const lockMoreASH = useCallback(async ({weiAmt, unlockTimestamp}: {weiAmt?: BigNumber, unlockTimestamp?: BigNumber} = {}) => {
        let txs: Transaction[] = [];
        if(weiAmt && weiAmt.gt(0)){
            const increaseAmtTx = await createTransaction(new Address(dappContract.voteEscrowedContract),
        {
            func: new ContractFunction("ESDTTransfer"),
            gasLimit: new GasLimit(gasLimit),
            args: [
                new TokenIdentifierValue(Buffer.from(ASH_TOKEN.id)),
                new BigUIntValue(weiAmt),
                new TokenIdentifierValue(
                    Buffer.from("increase_amount")
                )
            ],
        });
        txs.push(increaseAmtTx);
        }
        if(unlockTimestamp && unlockTimestamp.gt(unlockTS)){
            const increaseLockTSTx = await createTransaction(new Address(dappContract.voteEscrowedContract), {
                func: new ContractFunction("increase_unlock_time"),
                gasLimit: new GasLimit(gasLimit),
                args: [
                    new U64Value(unlockTimestamp)
                ]
            });
            txs.push(increaseLockTSTx);
        }
        if(!txs.length) return [];
        let nonce = txs[0].getNonce();
        txs.forEach((tx, i) => {tx.setNonce(nonce); nonce = nonce.increment()});
        const signedTxs = await dapp.dapp.provider.signTransactions(txs);
        const data = await dapp.dapp.proxy.doPostGeneric(`transaction/send-multiple`, signedTxs.map(tx => tx.toPlainObject()), res => res?.txsHashes || []);
        
        let key = `open${Date.now()}`;
        notification.open({
            key,
            message: `Lock succeed ${toEGLD(
                ASH_TOKEN,
                weiAmt?.toString() || "0"
            )} ${ASH_TOKEN.name}, unlock on ${moment.unix(unlockTimestamp?.toNumber() || unlockTS?.toNumber()).format("DD MMM, yyyy")}`,
            icon: <IconNewTab />,

            onClick: () =>
                window.open(
                    network.explorerAddress +
                        "/transactions/" +
                        data[0].toString(),
                    "_blank"
                ),
        });
        setTimeout(() => {
            notification.close(key);
        }, 10000);
        return data;
    }, [createTransaction, dapp.dapp, unlockTS]);

    const getRewardLPID = useCallback(() => {
        dapp.dapp.proxy.queryContract(
            new Query({
                address: new Address(dappContract.feeDistributor),
                func: new ContractFunction("token")
            })
        ).then(({returnData}) => {
            const tokenID = Buffer.from(returnData[0], "base64").toString(
                "utf8"
            );
            setRewardLPToken(pools.find(p => p.lpToken.id === tokenID))
        })
    }, [dapp.dapp]);

    const claimReward = useCallback(async () => {
        if(!dapp.loggedIn) return null;
        try {
            const tx1 = await createTransaction(new Address(dappContract.feeDistributor), {
                func: new ContractFunction("checkpoint_total_supply_1"),
                gasLimit: new GasLimit(gasLimit)
            });
            const tx2 = await createTransaction(new Address(dappContract.feeDistributor), {
                func: new ContractFunction("checkpoint_total_supply_2"),
                gasLimit: new GasLimit(gasLimit)
            });
            tx2.setNonce(tx1.getNonce().increment());
            const tx3 = await createTransaction(new Address(dappContract.feeDistributor), {
                func: new ContractFunction("claim"),
                gasLimit: new GasLimit(gasLimit),
                args: [
                    new AddressValue(new Address(dapp.address))
                ]
            });
            tx3.setNonce(tx2.getNonce().increment());
            const signedTxs = await dapp.dapp.provider.signTransactions([tx1, tx2, tx3]);
            const txs = await dapp.dapp.proxy.doPostGeneric(`transaction/send-multiple`, signedTxs.map(tx => tx.toPlainObject()), res => res.txsHashes || []);
            let key = `open${Date.now()}`;
            notification.open({
                key,
                message: `Reward was sent to your wallet`,
                icon: <IconNewTab />,
                onClick: () =>
                    window.open(
                        network.explorerAddress +
                            "/transactions/" +
                            txs[2].toString(),
                        "_blank"
                    ),
            });
            return txs;
        } catch (error) {
            console.log(error)
            return null;
        }
    }, [dapp.dapp, createTransaction, dapp.address, dapp.loggedIn]);

    // update currentBlock every 6s
    useEffect(() => {
        getNetworkStatus();
        const interval = setInterval(() => {
            getNetworkStatus();
        }, blockTimeMs);
        return () => clearInterval(interval);
    }, [getNetworkStatus]);

    useEffect(() => {
        getVEASHAmt();
        const interval = setInterval(() => {
            getVEASHAmt();
        }, blockTimeMs);
        return () => clearInterval(interval);
    }, [getVEASHAmt]);

    useEffect(() => {
        getLockedAmt();
        const interval = setInterval(() => {
            getLockedAmt();
        }, blockTimeMs);
        return () => clearInterval(interval);
    }, [getLockedAmt]);

    useEffect(() => {
        getTotalSupplyVeASH();
        const interval = setInterval(() => {
            getTotalSupplyVeASH();
        }, blockTimeMs);
        return () => clearInterval(interval);
    }, [getTotalSupplyVeASH]);

    useEffect(() => {
        getRewardAmt();
        const interval = setInterval(() => {
            getRewardAmt();
        }, blockTimeMs);
        return () => clearInterval(interval);
    }, [getRewardAmt]);

    useEffect(() => {
        getTotalLockedAmt();
        const interval = setInterval(() => {
            getTotalLockedAmt();
        }, blockTimeMs);
        return () => clearInterval(interval);
    }, [getTotalLockedAmt]);

    useEffect(() => {
        getRewardLPID();
    }, [getRewardLPID]);



    return (
        <StakeGovContext.Provider
            value={{
                ...initState,
                lockASH,
                lockMoreASH,
                claimReward,
                lockedAmt,
                veASH,
                unlockTS,
                totalSupplyVeASH,
                totalLockedAmt,
                rewardLPAmt,
                rewardLPToken
            }}
        >
            {children}
        </StakeGovContext.Provider>
    );
};

export default StakeGovProvider;
