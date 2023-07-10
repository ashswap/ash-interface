import { TokenTransfer } from "@multiversx/sdk-core/out";
import {
    farmNumberOfAdditionalRewards,
    farmQuery,
    FarmToken,
} from "atoms/farmsState";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { IFarm } from "interface/farm";
import { useRecoilCallback } from "recoil";

const useFarmBoost = () => {
    const { sendTransactions } = useSendTxsWithTrackStatus();
    const func = useRecoilCallback(
        ({ snapshot }) =>
            async (
                farm: IFarm,
                tokens: FarmToken[],
                selfBoost: boolean = false
            ) => {
                const farmRecord = await snapshot.getPromise(
                    farmQuery(farm.farm_address)
                );
                const numberOfAdditionalRewards = await snapshot.getPromise(
                    farmNumberOfAdditionalRewards(farm.farm_address)
                );
                const tokenPayments = tokens.map((t) =>
                    TokenTransfer.metaEsdtFromBigInteger(
                        t.collection,
                        t.nonce.toNumber(),
                        t.balance
                    )
                );
                return sendTransactions({
                    interactions: await ContractManager.getFarmContract(
                        farm.farm_address
                    )
                        .withContext({
                            lastRewardBlockTs: farmRecord.lastRewardBlockTs,
                            numberOfAdditionalRewards,
                        })
                        .claimRewards(tokenPayments, selfBoost),
                    transactionsDisplayInfo: {
                        successMessage: "Success to boost",
                    },
                });
            },
        [sendTransactions]
    );

    return func;
};

export default useFarmBoost;
