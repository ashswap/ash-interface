import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import { Percent } from "helper/fraction/percent";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useDAOVote = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);
    const vote = useRecoilCallback(
        ({ snapshot, set }) =>
            async (proposalID: number, yesPct: Percent, noPct: Percent) => {
                const tx = await ContractManager.getDAOContract(
                    ASHSWAP_CONFIG.dappContract.dao
                ).vote(
                    proposalID,
                    yesPct.multiply(1e18).quotient,
                    noPct.multiply(1e18).quotient
                );
                await sendTransactions({
                    interactions: [tx],
                    transactionsDisplayInfo: {
                        successMessage: "Vote for proposal success!",
                    },
                });
            },
        [sendTransactions]
    );

    return { vote, sessionId, trackingData };
};

export default useDAOVote;
