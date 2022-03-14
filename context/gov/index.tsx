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
type GovStakeState = {
    lockASH: (
        weiAmt: BigNumber,
        unlockTimestamp: BigNumber
    ) => Promise<TransactionHash | null>;
    lockedAmt: BigNumber;
    veASH: BigNumber;
    unlockTS: BigNumber;
};
const initState: GovStakeState = {
    lockASH: (amt, unlock) => Promise.resolve(null),
    lockedAmt: new BigNumber(0),
    veASH: new BigNumber(0),
    unlockTS: new BigNumber(0),

};
const StakeGovContext = createContext(initState);
export const useStakeGov = () => {
    return useContext(StakeGovContext);
};
const StakeGovProvider = ({ children }: any) => {
    const [currentBlock, setCurrentBlock] = useState<number>();
    const [lockedAmt, setLockedAmt] = useState<BigNumber>(new BigNumber(0));
    const [veASH, setVEASH] = useState<BigNumber>(new BigNumber(0));
    const [unlockTS, setUnlockTS] = useState<BigNumber>(new BigNumber(0));
    const { callContract, balances } = useWallet();
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
                let key = `open${Date.now()}`;
                notification.open({
                    key,
                    message: `Lock succeed ${toEGLD(
                        ASH_TOKEN,
                        weiAmt.toString()
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
                setTimeout(() => {
                    notification.close(key);
                }, 10000);
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
        if (!dapp.loggedIn) return;
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
                    "tuple1<BigUint>"
                );
                setVEASH(values[0].valueOf().field0)
                console.log(`ts: ${ts}, veASH: ${values[0].valueOf().field0.toString()}`)
            });
    }, [dapp.loggedIn, dapp.dapp, dapp.address]);

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
                    "tuple1<BigUint>"
                );
                setLockedAmt(values[0].valueOf().field0);
            });
    }, [dapp.loggedIn, dapp.dapp, dapp.address]);

    const getUnlockTime = useCallback(() => {
        if (!dapp.loggedIn) return;
        dapp.dapp.proxy
            .queryContract(
                new Query({
                    address: new Address(dappContract.voteEscrowedContract),
                    func: new ContractFunction("lockedEnd"),
                    args: [new AddressValue(new Address(dapp.address))],
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(returnData, "tuple1<U64>");
                setUnlockTS(values[0].valueOf().field0);
            });
    }, [dapp.loggedIn, dapp.dapp, dapp.address]);

    // update currentBlock every 6s
    useEffect(() => {
        getNetworkStatus();
        const interval = setInterval(() => {
            getNetworkStatus();
        }, blockTimeMs);
        return () => clearInterval(interval);
    }, [getNetworkStatus]);

    useEffect(() => {
        getUnlockTime();
        const interval = setInterval(() => {
            getUnlockTime();
        }, blockTimeMs);
        return () => clearInterval(interval);
    }, [getUnlockTime]);

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

    return (
        <StakeGovContext.Provider
            value={{
                ...initState,
                lockASH,
                lockedAmt,
                veASH,
                unlockTS
            }}
        >
            {children}
        </StakeGovContext.Provider>
    );
};

export default StakeGovProvider;
