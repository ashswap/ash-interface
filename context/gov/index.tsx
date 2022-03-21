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
import { toEGLD, toEGLDD, toWei } from "helper/balance";
import { emptyFunc } from "helper/common";
import { TokenBalance } from "interface/tokenBalance";
import { useDappContext } from "context/dapp";
import moment from "moment";
import { queryContractParser } from "helper/serializer";
import { IToken } from "interface/token";
import IPool from "interface/pool";
import pools from "const/pool";
import useContracts from "context/contracts";
const estimateVeASH = (weiAmt: BigNumber, lockDays: number) => {
    // ratio: lock 1 ASH in 1 year(365 days) -> 0.25 veASH
    const veASHPerDay = toEGLDD(ASH_TOKEN.decimals, weiAmt).multipliedBy(new BigNumber(0.25).div(365));
    return toWei(ASH_TOKEN, veASHPerDay.multipliedBy(lockDays).toString());
};
type GovStakeState = {
    lockASH: (
        weiAmt: BigNumber,
        unlockTimestamp: BigNumber
    ) => Promise<TransactionHash | null>;
    lockMoreASH: ({
        weiAmt,
        unlockTimestamp,
    }: {
        weiAmt?: BigNumber;
        unlockTimestamp?: BigNumber;
    }) => Promise<any>;
    claimReward: () => Promise<TransactionHash | null>;
    unlockASH: () => Promise<TransactionHash | null>;
    estimateVeASH: (weiAmt: BigNumber, lockDays: number) => BigNumber;
    lockedAmt: BigNumber;
    veASH: BigNumber;
    unlockTS: BigNumber;
    totalSupplyVeASH: BigNumber;
    totalLockedAmt: BigNumber;
    rewardLPAmt: BigNumber;
    rewardLPToken?: IPool;
    rewardValue: BigNumber;
    totalLockedPct: number;
};
const initState: GovStakeState = {
    lockASH: (amt, unlock) => Promise.resolve(null),
    lockMoreASH: () => Promise.resolve(null),
    claimReward: () => Promise.resolve(null),
    unlockASH: () => Promise.resolve(null),
    estimateVeASH,
    lockedAmt: new BigNumber(0),
    veASH: new BigNumber(0),
    unlockTS: new BigNumber(0),
    totalSupplyVeASH: new BigNumber(0),
    totalLockedAmt: new BigNumber(0),
    rewardLPAmt: new BigNumber(0),
    rewardValue: new BigNumber(0),
    totalLockedPct: 0
};
const StakeGovContext = createContext(initState);
export const useStakeGov = () => {
    return useContext(StakeGovContext);
};
const StakeGovProvider = ({ children }: any) => {
    const [currentBlock, setCurrentBlock] = useState<number>();
    const [lockedAmt, setLockedAmt] = useState<BigNumber>(new BigNumber(0));
    const [totalLockedAmt, setTotalLockedAmt] = useState<BigNumber>(
        new BigNumber(0)
    );
    const [veASH, setVEASH] = useState<BigNumber>(new BigNumber(0));
    const [unlockTS, setUnlockTS] = useState<BigNumber>(new BigNumber(0));
    const [totalSupplyVeASH, setTotalSupplyVeASH] = useState<BigNumber>(
        new BigNumber(0)
    );
    const [rewardLPAmt, setRewardLPAmt] = useState<BigNumber>(new BigNumber(0));
    const [rewardValue, setRewardValue] = useState<BigNumber>(new BigNumber(0));
    const [rewardLPToken, setRewardLPToken] = useState<IPool>();
    const [totalLockedPct, setTotalLockedPct] = useState(0);
    const { callContract, createTransaction, getLPValue } = useContracts();
    const dapp = useDappContext();

    useEffect(() => {
        if(!dapp.loggedIn){
            setLockedAmt(new BigNumber(0));
            setVEASH(new BigNumber(0));
            setUnlockTS(new BigNumber(0));
            setRewardLPAmt(new BigNumber(0));
            setRewardValue(new BigNumber(0));
        }
    }, [dapp.loggedIn])

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
                    )} ${ASH_TOKEN.name}, unlock on ${moment
                        .unix(unlockTimestamp.toNumber())
                        .format("DD MMM, yyyy")}`,
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
                const values = queryContractParser(returnData[0], "BigUint");
                setVEASH(values[0]?.valueOf() || new BigNumber(0));
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
                    returnData[0],
                    "tuple2<BigUint,U64>"
                );
                setLockedAmt(values[0]?.valueOf().field0 || new BigNumber(0));
                setUnlockTS(values[0]?.valueOf().field1 || new BigNumber(0));
            });
    }, [dapp.loggedIn, dapp.dapp, dapp.address]);

    const getTotalSupplyVeASH = useCallback(() => {
        if (!dapp.loggedIn) return;
        const ts = moment().unix();
        dapp.dapp.proxy
            .queryContract(
                new Query({
                    address: new Address(dappContract.voteEscrowedContract),
                    func: new ContractFunction("totalSupplyAtTs"),
                    args: [new BigUIntValue(new BigNumber(ts))],
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(returnData[0], "BigUint");
                setTotalSupplyVeASH(values[0]?.valueOf() || new BigNumber(0));
            });
    }, [dapp.loggedIn, dapp.dapp]);

    const getRewardAmt = useCallback(() => {
        if (!dapp.loggedIn) return;
        dapp.dapp.proxy
            .queryContract(
                new Query({
                    address: new Address(dappContract.feeDistributor),
                    func: new ContractFunction("getClaimableAmount"),
                    args: [new AddressValue(new Address(dapp.address))],
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(returnData[returnData.length - 1], "BigUint");
                setRewardLPAmt(values[0]?.valueOf() || new BigNumber(0));
            });
    }, [dapp.loggedIn, dapp.dapp, dapp.address]);

    const getTotalLockedAmt = useCallback(() => {
        dapp.dapp.proxy
            .queryContract(
                new Query({
                    address: new Address(dappContract.voteEscrowedContract),
                    func: new ContractFunction("totalLock"),
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(returnData[0], "BigUint");
                setTotalLockedAmt(values[0]?.valueOf() || new BigNumber(0));
            });
    }, [dapp.dapp]);

    const lockMoreASH = useCallback(
        async ({
            weiAmt,
            unlockTimestamp,
        }: { weiAmt?: BigNumber; unlockTimestamp?: BigNumber } = {}) => {
            let txs: Transaction[] = [];
            if (weiAmt && weiAmt.gt(0)) {
                const increaseAmtTx = await createTransaction(
                    new Address(dappContract.voteEscrowedContract),
                    {
                        func: new ContractFunction("ESDTTransfer"),
                        gasLimit: new GasLimit(gasLimit),
                        args: [
                            new TokenIdentifierValue(Buffer.from(ASH_TOKEN.id)),
                            new BigUIntValue(weiAmt),
                            new TokenIdentifierValue(
                                Buffer.from("increase_amount")
                            ),
                        ],
                    }
                );
                txs.push(increaseAmtTx);
            }
            if (unlockTimestamp && unlockTimestamp.gt(unlockTS)) {
                const increaseLockTSTx = await createTransaction(
                    new Address(dappContract.voteEscrowedContract),
                    {
                        func: new ContractFunction("increase_unlock_time"),
                        gasLimit: new GasLimit(gasLimit),
                        args: [new U64Value(unlockTimestamp)],
                    }
                );
                txs.push(increaseLockTSTx);
            }
            if (!txs.length) return [];
            let nonce = txs[0].getNonce();
            txs.forEach((tx, i) => {
                tx.setNonce(nonce);
                nonce = nonce.increment();
            });
            const signedTxs = await dapp.dapp.provider.signTransactions(txs);
            const data = await dapp.dapp.proxy.doPostGeneric(
                `transaction/send-multiple`,
                signedTxs.map((tx) => tx.toPlainObject()),
                (res) => res?.txsHashes || []
            );

            let key = `open${Date.now()}`;
            notification.open({
                key,
                message: `Lock succeed ${toEGLD(
                    ASH_TOKEN,
                    weiAmt?.toString() || "0"
                )} ${ASH_TOKEN.name}, unlock on ${moment
                    .unix(unlockTimestamp?.toNumber() || unlockTS?.toNumber())
                    .format("DD MMM, yyyy")}`,
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
        },
        [createTransaction, dapp.dapp, unlockTS]
    );

    const getRewardLPID = useCallback(() => {
        dapp.dapp.proxy
            .queryContract(
                new Query({
                    address: new Address(dappContract.feeDistributor),
                    func: new ContractFunction("token"),
                })
            )
            .then(({ returnData }) => {
                const tokenID = Buffer.from(returnData[0], "base64").toString(
                    "utf8"
                );
                setRewardLPToken(pools.find((p) => p.lpToken.id === tokenID));
            });
    }, [dapp.dapp]);

    const claimReward = useCallback(async () => {
        if (!dapp.loggedIn) return null;
        try {
            const tx1 = await createTransaction(
                new Address(dappContract.feeDistributor),
                {
                    func: new ContractFunction("checkpoint_total_supply_1"),
                    gasLimit: new GasLimit(gasLimit),
                }
            );
            const tx2 = await createTransaction(
                new Address(dappContract.feeDistributor),
                {
                    func: new ContractFunction("checkpoint_total_supply_2"),
                    gasLimit: new GasLimit(gasLimit),
                }
            );
            tx2.setNonce(tx1.getNonce().increment());
            const tx3 = await createTransaction(
                new Address(dappContract.feeDistributor),
                {
                    func: new ContractFunction("checkpoint_total_supply_2"),
                    gasLimit: new GasLimit(gasLimit),
                }
            );
            tx3.setNonce(tx2.getNonce().increment());
            const tx4 = await createTransaction(
                new Address(dappContract.feeDistributor),
                {
                    func: new ContractFunction("checkpoint_total_supply_2"),
                    gasLimit: new GasLimit(gasLimit),
                }
            );
            tx4.setNonce(tx3.getNonce().increment());
            const tx5 = await createTransaction(
                new Address(dappContract.feeDistributor),
                {
                    func: new ContractFunction("claim"),
                    gasLimit: new GasLimit(gasLimit),
                    args: [new AddressValue(new Address(dapp.address))],
                }
            );
            tx5.setNonce(tx4.getNonce().increment());
            const signedTxs = await dapp.dapp.provider.signTransactions([
                tx1,
                tx2,
                tx3,
                tx4,
                tx5
            ]);
            const txs = await dapp.dapp.proxy.doPostGeneric(
                `transaction/send-multiple`,
                signedTxs.map((tx) => tx.toPlainObject()),
                (res) => res.txsHashes || []
            );
            let key = `open${Date.now()}`;
            notification.open({
                key,
                message: `Reward was sent to your wallet`,
                icon: <IconNewTab />,
                onClick: () =>
                    window.open(
                        network.explorerAddress +
                            "/transactions/" +
                            txs[4].toString(),
                        "_blank"
                    ),
            });
            return txs;
        } catch (error) {
            console.log(error);
            return null;
        }
    }, [dapp.dapp, createTransaction, dapp.address, dapp.loggedIn]);

    const unlockASH = useCallback(async () => {
        if (unlockTS.minus(moment().unix()).gt(0)) return null;
        try {
            const tx = await callContract(
                new Address(dappContract.voteEscrowedContract),
                {
                    func: new ContractFunction("withdraw"),
                    gasLimit: new GasLimit(gasLimit),
                }
            );
            notification.open({
                message: `Unlock success ${toEGLDD(
                    ASH_TOKEN.decimals,
                    lockedAmt
                )} ${ASH_TOKEN.name}`,
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
    }, [unlockTS, lockedAmt, callContract]);

    const getRewardValue = useCallback(async () => {
        if (!rewardLPAmt || rewardLPAmt.eq(0) || !rewardLPToken){
            setRewardValue(new BigNumber(0));
            return;
        };
        const value = await getLPValue(rewardLPAmt, rewardLPToken);
        setRewardValue(value || new BigNumber(0));
    }, [rewardLPAmt, rewardLPToken, getLPValue]);

    const getASHTotalSupply = useCallback(() => {
        return dapp.dapp.proxy.queryContract(
            new Query({
                address: new Address(
                    "erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u"
                ),
                func: new ContractFunction("getTokenProperties"),
                args: [
                    new TokenIdentifierValue(Buffer.from(ASH_TOKEN.id)),
                ],
            })
        ).then(({returnData}) => {
            const data = returnData[3];
            if(data?.length > 0){
                return new BigNumber(
                    Buffer.from(data, "base64").toString("utf8")
                );
            }
            return new BigNumber(0);
        })
    }, [dapp.dapp]);

    const getTotalLockedASHPct = useCallback(async () => {
        const totalSupply = await getASHTotalSupply();
        if(totalSupply.eq(0)) setTotalLockedPct(0);
        return setTotalLockedPct(totalLockedAmt.multipliedBy(100).div(totalSupply).toNumber());
    }, [getASHTotalSupply, totalLockedAmt]);
    
    useEffect(() => {
        getRewardValue();
    }, [getRewardValue]);

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
        getTotalLockedASHPct();
        const interval = setInterval(() => {
            getTotalLockedASHPct();
        }, blockTimeMs);
        return () => clearInterval(interval);
    }, [getTotalLockedASHPct]);

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
                unlockASH,
                lockedAmt,
                veASH,
                unlockTS,
                totalSupplyVeASH,
                totalLockedAmt,
                rewardLPAmt,
                rewardLPToken,
                rewardValue,
                totalLockedPct
            }}
        >
            {children}
        </StakeGovContext.Provider>
    );
};

export default StakeGovProvider;
