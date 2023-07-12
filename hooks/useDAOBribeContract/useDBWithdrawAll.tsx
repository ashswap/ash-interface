import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useDBWithdrawAll = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);
    const dbWithdrawReward = useRecoilCallback(
        ({ snapshot, set }) =>
            async (proposalID: number) => {
                const tx = await ContractManager.getDAOBribeContract(
                    ASHSWAP_CONFIG.dappContract.daoBribe
                ).withdrawReward(proposalID);
                await sendTransactions({
                    interactions: [tx],
                    transactionsDisplayInfo: {
                        successMessage: `Withdraw from proposal #${proposalID} success!`,
                    },
                });
            },
        [sendTransactions]
    );

    return { dbWithdrawReward, sessionId, trackingData };
};

export default useDBWithdrawAll;
