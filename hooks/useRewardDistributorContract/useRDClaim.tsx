import { Address } from "@elrondnetwork/erdjs/out";
import { accAddressState, accIsLoggedInState } from "atoms/dappState";
import { REWARD_DISTRIBUTOR_CONTRACT } from "const/mainnet";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { useRecoilCallback } from "recoil";

const useRDClaim = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const claim = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const address = await snapshot.getPromise(accAddressState);

                if (!loggedIn) return { sessionId: "" };
                try {
                    const rdContract =
                        ContractManager.getRewardDistributorContract(
                            REWARD_DISTRIBUTOR_CONTRACT
                        );
                    const tx = await rdContract.claim(new Address(address));
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

    return { claim, trackingData, sessionId };
};

export default useRDClaim;
