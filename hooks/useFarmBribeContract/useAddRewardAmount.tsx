import { Address, TokenTransfer } from "@multiversx/sdk-core/out";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useAddRewardAmount = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);
    const addRewardAmount = useRecoilCallback(
        ({ snapshot, set }) =>
            async (farmAddress: Address, tokenPayments: TokenTransfer[]) => {
                const tx = await ContractManager.getFarmBribeContract(
                    ASHSWAP_CONFIG.dappContract.farmBribe
                ).addRewardAmount(farmAddress, tokenPayments);
                await sendTransactions({
                    interactions: [tx],
                    transactionsDisplayInfo: {
                        successMessage: "Create Bribe success!",
                    },
                });
            },
        [sendTransactions]
    );

    return { addRewardAmount, sessionId, trackingData };
};

export default useAddRewardAmount;
