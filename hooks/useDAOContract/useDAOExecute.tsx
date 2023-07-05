import { TokenTransfer } from "@multiversx/sdk-core/out";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useDAOExecute = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);
    const execute = useRecoilCallback(
        ({ snapshot, set }) =>
            async (proposalID: number, egld?: TokenTransfer) => {
                const tx = await ContractManager.getDAOContract(
                    ASHSWAP_CONFIG.dappContract.dao
                ).execute(proposalID, egld);
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
