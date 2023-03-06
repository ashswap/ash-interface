import { Address } from "@multiversx/sdk-core/out";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { useRecoilCallback } from "recoil";

const useGovClaimReward = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const claimReward = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const address = await snapshot.getPromise(accAddressState);

                if (!loggedIn) return { sessionId: "" };
                try {
                    const fdContract =
                        ContractManager.getFeeDistributorContract(
                            ASHSWAP_CONFIG.dappContract.feeDistributor
                        );
                    const tx = await fdContract.claim(new Address(address));
                    const payload: DappSendTransactionsPropsType = {
                        transactions: tx,
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

    return { claimReward, trackingData, sessionId };
};

export default useGovClaimReward;
