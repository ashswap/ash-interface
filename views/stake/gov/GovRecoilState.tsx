import {
    getApiProvider,
    getProxyProvider
} from "@elrondnetwork/dapp-core";
import {
    Address,
    AddressValue,
    ApiProvider,
    BigUIntValue,
    ContractFunction, ProxyProvider,
    Query
} from "@elrondnetwork/erdjs";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import {
    govLockedAmtState,
    govRewardLPAmtState,
    govRewardLPTokenState,
    govRewardLPValueState,
    govTotalLockedAmtState,
    govTotalLockedPctState,
    govTotalSupplyVeASH,
    govUnlockTSState,
    govVeASHAmtState
} from "atoms/govState";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { blockTimeMs } from "const/dappConfig";
import pools from "const/pool";
import { ASH_TOKEN } from "const/tokens";
import { toWei } from "helper/balance";
import { queryContractParser } from "helper/serializer";
import useLPValue from "hooks/useLPValue";
import moment from "moment";
import {
    useCallback, useEffect
} from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const GovState = () => {
    const loggedIn = useRecoilValue(accIsLoggedInState);
    const address = useRecoilValue(accAddressState);
    const setVEASH = useSetRecoilState(govVeASHAmtState);
    const setTotalSupplyVeASH = useSetRecoilState(govTotalSupplyVeASH);
    const setRewardValue = useSetRecoilState(govRewardLPValueState);
    const setTotalLockedPct = useSetRecoilState(govTotalLockedPctState);
    const setUnlockTS = useSetRecoilState(govUnlockTSState);
    const [lockedAmt, setLockedAmt] = useRecoilState(govLockedAmtState);
    const [totalLockedAmt, setTotalLockedAmt] = useRecoilState(
        govTotalLockedAmtState
    );
    const [rewardLPAmt, setRewardLPAmt] = useRecoilState(govRewardLPAmtState);
    const [rewardLPToken, setRewardLPToken] = useRecoilState(
        govRewardLPTokenState
    );

    const getLPValue = useLPValue();

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
    }, [
        loggedIn,
        setLockedAmt,
        setVEASH,
        setUnlockTS,
        setRewardLPAmt,
        setRewardValue,
    ]);

    const getVEASHAmt = useCallback(() => {
        if (!loggedIn || !lockedAmt || lockedAmt.eq(0)) return;
        const ts = moment().unix();
        proxy
            .queryContract(
                new Query({
                    address: new Address(
                        ASHSWAP_CONFIG.dappContract.voteEscrowedContract
                    ),
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
    }, [loggedIn, address, lockedAmt, proxy, setVEASH]);

    const getLockedAmt = useCallback(() => {
        if (!loggedIn) return;
        proxy
            .queryContract(
                new Query({
                    address: new Address(
                        ASHSWAP_CONFIG.dappContract.voteEscrowedContract
                    ),
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
    }, [loggedIn, proxy, address, setLockedAmt, setUnlockTS]);

    const getTotalSupplyVeASH = useCallback(() => {
        const ts = moment().unix();
        proxy
            .queryContract(
                new Query({
                    address: new Address(
                        ASHSWAP_CONFIG.dappContract.voteEscrowedContract
                    ),
                    func: new ContractFunction("totalSupplyAtTs"),
                    args: [new BigUIntValue(new BigNumber(ts))],
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(returnData[0], "BigUint");
                setTotalSupplyVeASH(values[0]?.valueOf() || new BigNumber(0));
            });
    }, [proxy, setTotalSupplyVeASH]);

    const getRewardAmt = useCallback(() => {
        if (!loggedIn) return;
        proxy
            .queryContract(
                new Query({
                    address: new Address(
                        ASHSWAP_CONFIG.dappContract.feeDistributor
                    ),
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
    }, [loggedIn, proxy, address, setRewardLPAmt]);

    const getTotalLockedAmt = useCallback(() => {
        proxy
            .queryContract(
                new Query({
                    address: new Address(
                        ASHSWAP_CONFIG.dappContract.voteEscrowedContract
                    ),
                    func: new ContractFunction("totalLock"),
                })
            )
            .then(({ returnData }) => {
                const values = queryContractParser(returnData[0], "BigUint");
                setTotalLockedAmt(values[0]?.valueOf() || new BigNumber(0));
            });
    }, [proxy, setTotalLockedAmt]);

    const getRewardLPID = useCallback(() => {
        proxy
            .queryContract(
                new Query({
                    address: new Address(
                        ASHSWAP_CONFIG.dappContract.feeDistributor
                    ),
                    func: new ContractFunction("token"),
                })
            )
            .then(({ returnData }) => {
                const tokenID = Buffer.from(returnData[0], "base64").toString(
                    "utf8"
                );
                const p = pools.find((p) => p.lpToken.id === tokenID);
                if (p) {
                    setRewardLPToken(p);
                }
            });
    }, [proxy, setRewardLPToken]);

    const getRewardValue = useCallback(async () => {
        if (!rewardLPAmt || rewardLPAmt.eq(0) || !rewardLPToken) {
            setRewardValue(new BigNumber(0));
            return;
        }
        const value = await getLPValue(rewardLPAmt, rewardLPToken);
        setRewardValue(value || new BigNumber(0));
    }, [rewardLPAmt, rewardLPToken, getLPValue, setRewardValue]);

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
    }, [getASHTotalSupply, totalLockedAmt, setTotalLockedPct]);

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

    return null;
};

export default GovState;
