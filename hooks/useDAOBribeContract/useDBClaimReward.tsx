import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useDBClaimReward = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);
    const dbClaimReward = useRecoilCallback(
        ({ snapshot, set }) =>
            async (proposalID: number, tokenIDs: string[]) => {
                const tx = await ContractManager.getDAOBribeContract(
                    ASHSWAP_CONFIG.dappContract.daoBribe
                ).claimReward(proposalID, tokenIDs);
                await sendTransactions({
                    transactions: [tx],
                    transactionsDisplayInfo: {
                        successMessage: `Claim rewards from proposal #${proposalID} success!`,
                    },
                });
            },
        [sendTransactions]
    );

    return { dbClaimReward, sessionId, trackingData };
};

export default useDBClaimReward;
