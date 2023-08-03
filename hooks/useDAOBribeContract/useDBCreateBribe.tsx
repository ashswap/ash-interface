import { TokenTransfer } from "@multiversx/sdk-core/out";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useDBCreateBribe = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);
    const dbCreateBribe = useRecoilCallback(
        ({ snapshot, set }) =>
            async (proposalID: number, payments: TokenTransfer[]) => {
                const tx = await ContractManager.getDAOBribeContract(
                    ASHSWAP_CONFIG.dappContract.daoBribe
                ).addRewardAmount(proposalID, payments);
                await sendTransactions({
                    interactions: [tx],
                    transactionsDisplayInfo: {
                        successMessage: `Bribe proposal #${proposalID} success!`,
                    },
                });
            },
        [sendTransactions]
    );

    return { dbCreateBribe, sessionId, trackingData };
};

export default useDBCreateBribe;
