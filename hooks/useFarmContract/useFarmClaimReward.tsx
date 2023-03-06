import { TokenPayment } from "@multiversx/sdk-core/out";
import { farmQuery, farmSessionIdMapState } from "atoms/farmsState";
import { ASH_TOKEN } from "const/tokens";

import { toEGLDD } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { IFarm } from "interface/farm";
import { useRecoilCallback } from "recoil";

const useFarmClaimReward = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);

    const claimReward = useRecoilCallback(
        ({ snapshot, set }) =>
            async (farm: IFarm) => {
                const farmRecord = await snapshot.getPromise(
                    farmQuery(farm.farm_address)
                );

                if (!farmRecord || !farmRecord.stakedData)
                    return { sessionId: "" };

                const { stakedData } = farmRecord;
                const tokenPayments = stakedData.farmTokens.map((t) =>
                    TokenPayment.metaEsdtFromBigInteger(
                        t.collection,
                        t.nonce.toNumber(),
                        t.balance,
                        farm.farm_token_decimal
                    )
                );
                const txs = await ContractManager.getFarmContract(
                    farm.farm_address
                )
                    .withLastRewardBlockTs(farmRecord.lastRewardBlockTs)
                    .claimRewards(tokenPayments, false);
                const payload: DappSendTransactionsPropsType = {
                    transactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Claim succeed ${toEGLDD(
                            ASH_TOKEN.decimals,
                            stakedData.totalRewardAmt
                        )} ${ASH_TOKEN.symbol}`,
                    },
                };
                const result = await sendTransactions(payload);
                if (result.sessionId)
                    set(farmSessionIdMapState, (val) => ({
                        ...val,
                        [farm.farm_address]: [
                            ...(val[farm.farm_address] || []),
                            result.sessionId!,
                        ],
                    }));
            },
        [sendTransactions]
    );

    return {
        claimReward,
        trackingData,
        sessionId,
    };
};

export default useFarmClaimReward;
