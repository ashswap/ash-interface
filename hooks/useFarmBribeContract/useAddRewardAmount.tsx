import { Address, TokenPayment } from "@elrondnetwork/erdjs/out";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useAddRewardAmount = (trackStatus = false) => {
    const {sendTransactions, sessionId, trackingData} = useSendTxsWithTrackStatus(trackStatus);
    const addRewardAmount = useRecoilCallback(({snapshot, set}) => async (farmAddress: Address, tokenPayments: TokenPayment[]) => {
        const tx = await ContractManager.getFarmBribeContract(ASHSWAP_CONFIG.dappContract.farmBribe).addRewardAmount(farmAddress, tokenPayments);
        await sendTransactions({
            transactions: [tx],
            transactionsDisplayInfo: {
                successMessage: "Create Bribe success!"
            }
        });
    }, [sendTransactions]);

    return {addRewardAmount, sessionId, trackingData};
}

export default useAddRewardAmount;