import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useFCApplyWeight = (trackStatus: boolean) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);

    const applyRelativeWeight = useRecoilCallback(() => async () => {
        const tx = await ContractManager.getFarmControllerContract(
            ASHSWAP_CONFIG.dappContract.farmController
        ).applyRelativeWeight();
        sendTransactions({
            transactions: [tx],
        });
    });

    return { applyRelativeWeight, sessionId, trackingData };
};

export default useFCApplyWeight;
