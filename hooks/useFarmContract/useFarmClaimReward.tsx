import { TokenTransfer } from "@multiversx/sdk-core/out";
import { farmNumberOfAdditionalRewards, farmQuery, farmSessionIdMapState } from "atoms/farmsState";
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
                const numberOfAdditionalRewards = await snapshot.getPromise(
                    farmNumberOfAdditionalRewards(farm.farm_address)
                );

                if (!farmRecord || !farmRecord.stakedData)
                    return { sessionId: "" };

                const { stakedData } = farmRecord;
                const tokenPayments = stakedData.farmTokens.map((t) =>
                    TokenTransfer.metaEsdtFromBigInteger(
                        t.collection,
                        t.nonce.toNumber(),
                        t.balance,
                        farm.farm_token_decimal
                    )
                );
                const txs = await ContractManager.getFarmContract(
                    farm.farm_address
                )
                    .withContext({lastRewardBlockTs: farmRecord.lastRewardBlockTs, numberOfAdditionalRewards})
                    .claimRewards(tokenPayments, false);
                const payload: DappSendTransactionsPropsType = {
                    transactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Claim rewards succeed`,
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
