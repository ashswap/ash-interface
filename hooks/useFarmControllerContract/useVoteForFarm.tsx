import { Address } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useVoteForFarm = (trackStatus: boolean) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);

    const voteFarmWeight = useRecoilCallback(
        ({ snapshot, set }) =>
            async (farmAddress: string, weight: number) => {
                const tx = await ContractManager.getFarmControllerContract(
                    ASHSWAP_CONFIG.dappContract.farmController
                ).voteForFarmWeights(
                    new Address(farmAddress),
                    new BigNumber(weight)
                );
                sendTransactions({
                    interactions: [tx],
                    transactionsDisplayInfo: {
                        successMessage: `Success to vote for the farm`,
                    },
                });
            },
        [sendTransactions]
    );

    return { voteFarmWeight, sessionId, trackingData };
};

export default useVoteForFarm;
