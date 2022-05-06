import {
    getApiProvider,
    getProxyProvider,
    sendTransactions,
    useGetAccountInfo,
    useGetLoginInfo,
} from "@elrondnetwork/dapp-core";
import { SendTransactionReturnType } from "@elrondnetwork/dapp-core/dist/services/transactions";
import {
    Address,
    AddressValue,
    ApiProvider,
    BigUIntValue,
    ContractFunction,
    GasLimit,
    ProxyProvider,
    Query,
    TokenIdentifierValue,
    Transaction,
    U64Value,
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { blockTimeMs, gasLimit } from "const/dappConfig";
import { ENVIRONMENT } from "const/env";
import pools from "const/pool";
import { ASH_TOKEN } from "const/tokens";
import useContracts from "context/contracts";
import { toEGLD, toEGLDD, toWei } from "helper/balance";
import { queryContractParser } from "helper/serializer";
import { useCreateTransaction } from "helper/transactionMethods";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import IPool from "interface/pool";
import moment from "moment";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
const estimateVeASH = (weiAmt: BigNumber, lockSeconds: number) => {

    if(ENVIRONMENT.NETWORK === "devnet"){
        // ratio: lock 1 ASH in 2 weeks(14 days) -> 1 veASH
        const veASHPerS = toEGLDD(ASH_TOKEN.decimals, weiAmt).multipliedBy(new BigNumber(1).div(2 * 7 * 24 * 60 * 60));
        return toWei(ASH_TOKEN, veASHPerS.multipliedBy(lockSeconds).toString());
    }
    // ratio: lock 1 ASH in 1 year(365 days) -> 0.25 veASH
    const veASHPerSecond = toEGLDD(ASH_TOKEN.decimals, weiAmt).multipliedBy(
        new BigNumber(0.25).div(365 * 24 * 60 * 60)
    );
    return toWei(ASH_TOKEN, veASHPerSecond.multipliedBy(lockSeconds).toString());
};
const emptySendTxsReturn: SendTransactionReturnType = { sessionId: "" };
type GovStakeState = {
    lockASH: (
        weiAmt: BigNumber,
        unlockTimestamp: BigNumber
    ) => Promise<SendTransactionReturnType>;
    lockMoreASH: ({
        weiAmt,
        unlockTimestamp,
    }: {
        weiAmt?: BigNumber;
        unlockTimestamp?: BigNumber;
    }) => Promise<SendTransactionReturnType>;
    claimReward: () => Promise<SendTransactionReturnType>;
    unlockASH: () => Promise<SendTransactionReturnType>;
    estimateVeASH: (weiAmt: BigNumber, lockSeconds: number) => BigNumber;
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
    lockASH: () => Promise.resolve(emptySendTxsReturn),
    lockMoreASH: () => Promise.resolve(emptySendTxsReturn),
    claimReward: () => Promise.resolve(emptySendTxsReturn),
    unlockASH: () => Promise.resolve(emptySendTxsReturn),
    estimateVeASH,
    lockedAmt: new BigNumber(0),
    veASH: new BigNumber(0),
    unlockTS: new BigNumber(0),
    totalSupplyVeASH: new BigNumber(0),
    totalLockedAmt: new BigNumber(0),
    rewardLPAmt: new BigNumber(0),
    rewardValue: new BigNumber(0),
    totalLockedPct: 0,
};
const StakeGovContext = createContext(initState);
export const useStakeGov = () => {
    return useContext(StakeGovContext);
};
const StakeGovProvider = ({ children }: any) => {
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
    const { getLPValue } = useContracts();
    const createTransaction = useCreateTransaction();
    const { isLoggedIn: loggedIn } = useGetLoginInfo();
    const { address } = useGetAccountInfo();
    const proxy: ProxyProvider = getProxyProvider();
    const apiProvider: ApiProvider = getApiProvider();

    useEffect(() => {
        if (!loggedIn) {
            setLockedAmt(new BigNumber(0));
            setVEASH(new BigNumber(0));
            setUnlockTS(new BigNumber(0));
            setRewardLPAmt(new BigNumber(0));
            setRewardValue(new BigNumber(0));
        }
    }, [loggedIn]);

    const lockASH: GovStakeState["lockASH"] = useCallback(
        async (weiAmt: BigNumber, unlockTimestamp: BigNumber) => {
            try {
                const payload: DappSendTransactionsPropsType = {
                    transactions: await createTransaction(
                        new Address(ASHSWAP_CONFIG.dappContract.voteEscrowedContract),
                        {
                            func: new ContractFunction("ESDTTransfer"),
                            gasLimit: new GasLimit(7_000_000),
                            args: [
                                new TokenIdentifierValue(
                                    Buffer.from(ASH_TOKEN.id)
                                ),
                                new BigUIntValue(weiAmt),
                                new TokenIdentifierValue(
                                    Buffer.from("create_lock")
                                ),
                                new U64Value(unlockTimestamp),
                            ],
                        }
                    ),
                    transactionsDisplayInfo: {
                        successMessage: `Lock succeed ${toEGLD(
                            ASH_TOKEN,
                            weiAmt?.toString() || "0"
                        )} ${ASH_TOKEN.name}, unlock on ${moment
                            .unix(unlockTimestamp.toNumber())
                            .format("DD MMM, yyyy")}`,
                    },
                };
                return sendTransactions(payload);
            } catch (error) {
                console.log(error);
                return emptySendTxsReturn;
            }
        },
        [createTransaction]
    );

    const getVEASHAmt = useCallback(() => {
        if (!loggedIn || !lockedAmt || lockedAmt.eq(0)) return;
        const ts = moment().unix();
        proxy
            .queryContract(
                new Query({
                    address: new Address(ASHSWAP_CONFIG.dappContract.voteEscrowedContract),
                    func: new ContractFunction("balanceOfAtTs"),
                    args: [
                        new AddressValue(new Address(address)),
                        new BigUIntValue(new BigNumber(ts)),
                    ],
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(returnData[0], "BigUint");
                setVEASH(values[0]?.valueOf() || new BigNumber(0));
            });
    }, [loggedIn, address, lockedAmt, proxy]);

    const getLockedAmt = useCallback(() => {
        if (!loggedIn) return;
        proxy
            .queryContract(
                new Query({
                    address: new Address(ASHSWAP_CONFIG.dappContract.voteEscrowedContract),
                    func: new ContractFunction("locked"),
                    args: [new AddressValue(new Address(address))],
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
    }, [loggedIn, proxy, address]);

    const getTotalSupplyVeASH = useCallback(() => {
        const ts = moment().unix();
        proxy
            .queryContract(
                new Query({
                    address: new Address(ASHSWAP_CONFIG.dappContract.voteEscrowedContract),
                    func: new ContractFunction("totalSupplyAtTs"),
                    args: [new BigUIntValue(new BigNumber(ts))],
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(returnData[0], "BigUint");
                setTotalSupplyVeASH(values[0]?.valueOf() || new BigNumber(0));
            });
    }, [proxy]);

    const getRewardAmt = useCallback(() => {
        if (!loggedIn) return;
        proxy
            .queryContract(
                new Query({
                    address: new Address(ASHSWAP_CONFIG.dappContract.feeDistributor),
                    func: new ContractFunction("getClaimableAmount"),
                    args: [new AddressValue(new Address(address))],
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(
                    returnData[returnData.length - 1],
                    "BigUint"
                );
                setRewardLPAmt(values[0]?.valueOf() || new BigNumber(0));
            });
    }, [loggedIn, proxy, address]);

    const getTotalLockedAmt = useCallback(() => {
        proxy
            .queryContract(
                new Query({
                    address: new Address(ASHSWAP_CONFIG.dappContract.voteEscrowedContract),
                    func: new ContractFunction("totalLock"),
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(returnData[0], "BigUint");
                setTotalLockedAmt(values[0]?.valueOf() || new BigNumber(0));
            });
    }, [proxy]);

    const lockMoreASH: GovStakeState["lockMoreASH"] = useCallback(
        async ({
            weiAmt,
            unlockTimestamp,
        }: { weiAmt?: BigNumber; unlockTimestamp?: BigNumber } = {}) => {
            if (!loggedIn) return emptySendTxsReturn;
            let txs: Transaction[] = [];
            if (weiAmt && weiAmt.gt(0)) {
                const increaseAmtTx = await createTransaction(
                    new Address(ASHSWAP_CONFIG.dappContract.voteEscrowedContract),
                    {
                        func: new ContractFunction("ESDTTransfer"),
                        gasLimit: new GasLimit(7_000_000),
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
                    new Address(ASHSWAP_CONFIG.dappContract.voteEscrowedContract),
                    {
                        func: new ContractFunction("increase_unlock_time"),
                        gasLimit: new GasLimit(7_000_000),
                        args: [new U64Value(unlockTimestamp)],
                    }
                );
                txs.push(increaseLockTSTx);
            }
            if (!txs.length) return emptySendTxsReturn;

            const payload: DappSendTransactionsPropsType = {
                transactions: txs,
                transactionsDisplayInfo: {
                    successMessage: `Lock succeed ${toEGLD(
                        ASH_TOKEN,
                        weiAmt?.toString() || "0"
                    )} ${ASH_TOKEN.name}, unlock on ${moment
                        .unix(
                            unlockTimestamp?.toNumber() || unlockTS?.toNumber()
                        )
                        .format("DD MMM, yyyy")}`,
                },
            };
            return await sendTransactions(payload);
        },
        [createTransaction, unlockTS, loggedIn]
    );

    const getRewardLPID = useCallback(() => {
        proxy
            .queryContract(
                new Query({
                    address: new Address(ASHSWAP_CONFIG.dappContract.feeDistributor),
                    func: new ContractFunction("token"),
                })
            )
            .then(({ returnData }) => {
                const tokenID = Buffer.from(returnData[0], "base64").toString(
                    "utf8"
                );
                setRewardLPToken(pools.find((p) => p.lpToken.id === tokenID));
            });
    }, [proxy]);

    const claimReward: GovStakeState["claimReward"] = useCallback(async () => {
        if (!loggedIn) return emptySendTxsReturn;
        try {
            const tx1 = await createTransaction(
                new Address(ASHSWAP_CONFIG.dappContract.feeDistributor),
                {
                    func: new ContractFunction("checkpoint_total_supply"),
                    gasLimit: new GasLimit(7_000_000),
                }
            );
            const tx2 = await createTransaction(
                new Address(ASHSWAP_CONFIG.dappContract.feeDistributor),
                {
                    func: new ContractFunction("claim"),
                    gasLimit: new GasLimit(500_000_000),
                    args: [new AddressValue(new Address(address))],
                }
            );
            const payload: DappSendTransactionsPropsType = {
                transactions: [tx1, tx2],
                transactionsDisplayInfo: {
                    successMessage: `Reward was sent to your wallet`,
                },
            };
            return await sendTransactions(payload);
        } catch (error) {
            console.log(error);
            return emptySendTxsReturn;
        }
    }, [createTransaction, address, loggedIn]);

    const unlockASH: GovStakeState["unlockASH"] = useCallback(async () => {
        if (!loggedIn || unlockTS.minus(moment().unix()).gt(0))
            return emptySendTxsReturn;
        try {
            const payload: DappSendTransactionsPropsType = {
                transactions: await createTransaction(
                    new Address(ASHSWAP_CONFIG.dappContract.voteEscrowedContract),
                    {
                        func: new ContractFunction("withdraw"),
                        gasLimit: new GasLimit(7_000_000),
                    }
                ),
                transactionsDisplayInfo: {
                    successMessage: `Unlock success ${toEGLDD(
                        ASH_TOKEN.decimals,
                        lockedAmt
                    )} ${ASH_TOKEN.name}`,
                },
            };
            return await sendTransactions(payload);
        } catch (error) {
            console.log(error);
            return emptySendTxsReturn;
        }
    }, [unlockTS, lockedAmt, loggedIn, createTransaction]);

    const getRewardValue = useCallback(async () => {
        if (!rewardLPAmt || rewardLPAmt.eq(0) || !rewardLPToken) {
            setRewardValue(new BigNumber(0));
            return;
        }
        const value = await getLPValue(rewardLPAmt, rewardLPToken);
        setRewardValue(value || new BigNumber(0));
    }, [rewardLPAmt, rewardLPToken, getLPValue]);

    const getASHTotalSupply = useCallback(() => {
        return apiProvider.getToken(ASH_TOKEN.id).then(({ supply }) => {
            return toWei(ASH_TOKEN, supply || "0");
        });
    }, [apiProvider]);

    const getTotalLockedASHPct = useCallback(async () => {
        const totalSupply = await getASHTotalSupply();
        if (totalSupply.eq(0)) setTotalLockedPct(0);
        return setTotalLockedPct(
            totalLockedAmt.multipliedBy(100).div(totalSupply).toNumber()
        );
    }, [getASHTotalSupply, totalLockedAmt]);

    useEffect(() => {
        getRewardValue();
    }, [getRewardValue]);

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
                totalLockedPct,
            }}
        >
            {children}
        </StakeGovContext.Provider>
    );
};

export default StakeGovProvider;
