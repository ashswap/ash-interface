import { useTrackTransactionStatus } from "@elrondnetwork/dapp-core/hooks";
import { TokenPayment } from "@elrondnetwork/erdjs/out";
import { accAddressState } from "atoms/dappState";
import { farmOwnerTokensQuery, FarmRecord, FarmToken } from "atoms/farmsState";
import {
    govLockedAmtState,
    govTotalSupplyVeASH,
    govUnlockTSState,
} from "atoms/govState";
import BigNumber from "bignumber.js";
import { ContractManager } from "helper/contracts/contractManager";
import {
    calcYieldBoost,
    calcYieldBoostFromFarmToken,
} from "helper/farmBooster";
import { sendTransactions } from "helper/transactionMethods";
import { FarmBoostInfo } from "interface/farm";
import moment from "moment";
import { useEffect, useState } from "react";
import { useRecoilCallback } from "recoil";
import useCalcBoost from "./useFarmContract/useCalcBoost";
import useGovGetLocked from "./useGovContract/useGovGetLocked";

export const useFarmBoostTransferState = (
    farmToken: FarmToken,
    farmData: FarmRecord
) => {
    const [boostId, setBoostId] = useState<string | null>(null);
    const { isPending: isBoosting } = useTrackTransactionStatus({
        transactionId: boostId,
    });
    const [currentFarmBoost, setCurrentFarmBoost] = useState<FarmBoostInfo>({
        veForBoost: new BigNumber(0),
        boost: 1,
    });
    const [maxFarmBoost, setMaxFarmBoost] = useState<FarmBoostInfo>({
        veForBoost: new BigNumber(0),
        boost: 2.5,
    });
    const getLocked = useGovGetLocked();
    const getCurrentBoost = useRecoilCallback(
        ({ snapshot }) =>
            async () => {
                const ownerAddress = farmToken.attributes.booster;
                const locked = await getLocked(ownerAddress);
                const veSupply = await snapshot.getPromise(govTotalSupplyVeASH);
                const unlockTs = new BigNumber(locked.end);

                const slope = farmToken.balance
                    .div(farmToken.attributes.initial_farm_amount)
                    .multipliedBy(farmToken.attributes.slope_used);
                const ve = slope.multipliedBy(unlockTs.minus(moment().unix()));
                setCurrentFarmBoost({
                    boost: calcYieldBoostFromFarmToken(
                        farmData.farmTokenSupply,
                        farmToken.balance,
                        farmToken.lpAmt,
                        farmData.farm
                    ),
                    veForBoost: ve,
                });

                const veForMaxBoost = farmToken.lpAmt
                    .multipliedBy(veSupply)
                    .div(farmData.lpLockedAmt);

                setMaxFarmBoost({
                    veForBoost: veForMaxBoost,
                    boost: calcYieldBoost(
                        farmToken.lpAmt,
                        farmData.lpLockedAmt,
                        veForMaxBoost,
                        veSupply,
                        farmData.farmTokenSupply,
                        farmToken.balance
                    ),
                });
            },
        [farmToken, getLocked, farmData]
    );

    const selfBoost = useRecoilCallback(
        ({ snapshot }) =>
            async () => {
                const ownerTokens = await snapshot.getPromise(
                    farmOwnerTokensQuery(farmData.farm.farm_address)
                );
                const tokens = [...ownerTokens, farmToken];
                const tokenPayments = tokens.map((t) =>
                    TokenPayment.metaEsdtFromBigInteger(
                        t.collection,
                        t.nonce.toNumber(),
                        t.balance
                    )
                );
                const tx = await ContractManager.getFarmContract(
                    farmData.farm.farm_address
                ).claimRewards(tokenPayments, true);
                const result = await sendTransactions({
                    transactions: tx,
                    transactionsDisplayInfo: {
                        successMessage: "Success to boost yourself",
                    },
                });
                const { sessionId, error } = result;
                setBoostId(sessionId);
                return result;
            },
        [farmData, farmToken]
    );

    useEffect(() => {
        getCurrentBoost();
    }, [getCurrentBoost]);

    return { currentFarmBoost, maxFarmBoost, selfBoost, boostId, isBoosting };
};

export const useFarmBoostOwnerState = (farmData: FarmRecord) => {
    const [expectedFarmBoost, setExpectedFarmBoost] = useState<FarmBoostInfo>({
        veForBoost: new BigNumber(0),
        boost: 1,
    });
    const [currentFarmBoost, setCurrentFarmBoost] = useState<FarmBoostInfo>({
        veForBoost: new BigNumber(0),
        boost: 1,
    });
    const [maxFarmBoost, setMaxFarmBoost] = useState<FarmBoostInfo>({
        veForBoost: new BigNumber(0),
        boost: 2.5,
    });
    const [availableVe, setAvailableVe] = useState<BigNumber>(new BigNumber(0));
    const calcBoost = useCalcBoost();
    const calcBoostOwner = useRecoilCallback(
        ({ snapshot }) =>
            async () => {
                const address = await snapshot.getPromise(accAddressState);
                const veSupply = await snapshot.getPromise(govTotalSupplyVeASH);
                const lockedAshAmt = await snapshot.getPromise(
                    govLockedAmtState
                );
                const unlockTs = await snapshot.getPromise(govUnlockTSState);
                const ownerTokens =
                    farmData.stakedData?.farmTokens.filter(
                        (f) => f.attributes.booster === address
                    ) || [];
                const slopeRefill = ownerTokens.reduce((total, f) => {
                    const slope = f.balance
                        .div(f.attributes.initial_farm_amount)
                        .multipliedBy(f.attributes.slope_used);
                    return total.plus(slope);
                }, new BigNumber(0));
                const lpAmt = ownerTokens.reduce(
                    (total, f) => total.plus(f.balance.div(f.perLP)),
                    new BigNumber(0)
                );

                const slopeUsed = await ContractManager.getFarmContract(
                    farmData.farm.farm_address
                ).getSlopeBoosted(address);

                const farmBalance = ownerTokens.reduce(
                    (total, t) => total.plus(t.balance),
                    new BigNumber(0)
                );
                const boostInfo = await calcBoost(
                    slopeRefill,
                    lpAmt,
                    slopeUsed,
                    veSupply,
                    lockedAshAmt,
                    unlockTs,
                    farmData.lpLockedAmt,
                    farmData.farmTokenSupply,
                    farmBalance
                );
                setAvailableVe(
                    lockedAshAmt
                        .div(4 * 365 * 24 * 3600)
                        .minus(slopeUsed)
                        .multipliedBy(unlockTs.minus(moment().unix()))
                );
                setExpectedFarmBoost(boostInfo);

                const veForMaxBoost = lpAmt
                    .multipliedBy(veSupply)
                    .div(farmData.lpLockedAmt);

                setMaxFarmBoost({
                    veForBoost: veForMaxBoost,
                    boost: calcYieldBoost(
                        lpAmt,
                        farmData.lpLockedAmt,
                        veForMaxBoost,
                        veSupply,
                        farmData.farmTokenSupply,
                        farmBalance
                    ),
                });
            },
        [calcBoost, farmData]
    );
    const getCurrentBoost = useRecoilCallback(
        ({ snapshot }) =>
            async () => {
                const ownerAddress = await snapshot.getPromise(accAddressState);
                const unlockTs = await snapshot.getPromise(govUnlockTSState);
                const ownerTokens =
                    farmData.stakedData?.farmTokens.filter(
                        (f) => f.attributes.booster === ownerAddress
                    ) || [];
                const totalLP = ownerTokens.reduce(
                    (total, f) => total.plus(f.balance.div(f.perLP)),
                    new BigNumber(0)
                );
                const slope = ownerTokens.reduce(
                    (total, f) =>
                        total.plus(
                            f.balance
                                .div(f.attributes.initial_farm_amount)
                                .multipliedBy(f.attributes.slope_used)
                        ),
                    new BigNumber(0)
                );
                const farmBalance = ownerTokens.reduce(
                    (total, t) => total.plus(t.balance),
                    new BigNumber(0)
                );
                const ve = slope.multipliedBy(unlockTs.minus(moment().unix()));
                setCurrentFarmBoost({
                    boost: calcYieldBoostFromFarmToken(
                        farmData.farmTokenSupply,
                        farmBalance,
                        totalLP,
                        farmData.farm
                    ),
                    veForBoost: BigNumber.max(ve, 0),
                });
            },
        [farmData]
    );

    useEffect(() => {
        calcBoostOwner();
    }, [calcBoostOwner]);
    useEffect(() => {
        getCurrentBoost();
    }, [getCurrentBoost]);

    return { expectedFarmBoost, currentFarmBoost, maxFarmBoost, availableVe };
};
