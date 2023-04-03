import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useDAOExecute = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);
    const execute = useRecoilCallback(
        ({ snapshot, set }) =>
            async (proposalID: number) => {
                const tx = await ContractManager.getDAOContract(
                    ASHSWAP_CONFIG.dappContract.dao
                ).execute(proposalID);
                await sendTransactions({
                    transactions: [tx],
                    transactionsDisplayInfo: {
                        successMessage: "Execute proposal success!",
                    },
                });
            },
        [sendTransactions]
    );

    return { execute, sessionId, trackingData };
};

export default useDAOExecute;
