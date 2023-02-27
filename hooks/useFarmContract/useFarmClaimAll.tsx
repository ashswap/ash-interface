import { Transaction, TokenPayment } from "@multiversx/sdk-core/out";
import {
    farmLoadingMapState,
    farmRecordsState,
    farmSessionIdMapState,
} from "atoms/farmsState";
import BigNumber from "bignumber.js";
import { ASH_TOKEN } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import produce from "immer";
import { useRecoilCallback } from "recoil";

const useFarmClaimAll = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const claimAllFarmsReward = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const farmRecords = await snapshot.getPromise(farmRecordsState);
                const loadingMap = await snapshot.getPromise(
                    farmLoadingMapState
                );
                let txs: Transaction[] = [];
                let totalASH = new BigNumber(0);
                const farmsAddress: string[] = [];

                for (let i = 0; i < farmRecords.length; i++) {
                    const val = farmRecords[i];
                    if (
                        val?.stakedData?.totalRewardAmt.gt(0) &&
                        !loadingMap[val.farm.farm_address]
                    ) {
                        const tokenPayments = val.stakedData.farmTokens.map(
                            (t) =>
                                TokenPayment.metaEsdtFromBigInteger(
                                    t.collection,
                                    t.nonce.toNumber(),
                                    t.balance,
                                    val.farm.farm_token_decimal
                                )
                        );
                        const temp = await ContractManager.getFarmContract(
                            val.farm.farm_address
                        )
                            .withLastRewardBlockTs(val.lastRewardBlockTs)
                            .claimRewards(tokenPayments, false);
                        txs = [...txs, ...temp];
                        totalASH = totalASH.plus(val.stakedData.totalRewardAmt);
                        farmsAddress.push(val.farm.farm_address);
                    }
                }
                const result = await sendTransactions({
                    transactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Claim succeed ${toEGLDD(
                            ASH_TOKEN.decimals,
                            totalASH
                        )} ${ASH_TOKEN.symbol}`,
                    },
                });

                if (result.sessionId)
                    set(farmSessionIdMapState, (state) => {
                        return produce(state, (draft) => {
                            farmsAddress.map((farm_address) => {
                                draft[farm_address] = [
                                    ...(draft[farm_address] || []),
                                    result.sessionId,
                                ];
                            });
                        });
                    });
            },
        [sendTransactions]
    );
    return { claimAllFarmsReward, trackingData, sessionId };
};

export default useFarmClaimAll;
