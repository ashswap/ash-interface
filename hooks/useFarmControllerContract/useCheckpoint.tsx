import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useFCCheckpoint = (trackStatus: boolean) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);

    const checkpoint = useRecoilCallback(() => async () => {
        const tx = await ContractManager.getFarmControllerContract(
            ASHSWAP_CONFIG.dappContract.farmController
        ).checkpoint();
        sendTransactions({
            transactions: [tx],
        });
    });

    return { checkpoint, sessionId, trackingData };
};

export default useFCCheckpoint;
