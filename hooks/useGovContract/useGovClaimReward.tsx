import {
    Address
} from "@elrondnetwork/erdjs/out";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import FeeDistributorContract from "helper/contracts/feeDistributorContract";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { useRecoilCallback } from "recoil";

const useGovClaimReward = (trackStatus = false) => {
    const {sendTransactions, trackingData, sessionId} = useSendTxsWithTrackStatus(trackStatus);
    const claimReward = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const address = await snapshot.getPromise(accAddressState);

                if (!loggedIn) return { sessionId: "" };
                try {
                    const fdContract = new FeeDistributorContract(ASHSWAP_CONFIG.dappContract.feeDistributor);
                    const tx1 = await fdContract.checkpointTotalSupply();
                    const tx2 = await fdContract.claim(new Address(address));
                    const payload: DappSendTransactionsPropsType = {
                        transactions: [tx1, tx2],
                        transactionsDisplayInfo: {
                            successMessage: `Reward was sent to your wallet`,
                        },
                    };
                    return await sendTransactions(payload);
                } catch (error) {
                    console.error(error);
                    return { sessionId: "" };
                }
            },
        [sendTransactions]
    );

    return {claimReward, trackingData, sessionId};
};

export default useGovClaimReward;
