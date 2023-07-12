import { Address } from "@multiversx/sdk-core/out";
import { fbAccountFarmSelector } from "atoms/farmBribeState";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useFBAllClaimRewards = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);
    const fbClaimAllRewards = useRecoilCallback(
        ({ snapshot, set }) =>
            async (farmAddress: string) => {
                const fbAccountFarm = await snapshot.getPromise(
                    fbAccountFarmSelector(farmAddress)
                );
                if (!fbAccountFarm) return;
                const farm = new Address(farmAddress);
                sendTransactions({
                    interactions: await Promise.all(
                        fbAccountFarm.rewards.map((r) =>
                            ContractManager.getFarmBribeContract(
                                ASHSWAP_CONFIG.dappContract.farmBribe
                            ).claimReward(farm, r.tokenId)
                        )
                    ),
                    transactionsDisplayInfo: {
                        successMessage: "Claim reward successfully!",
                    },
                });
            },
        [sendTransactions]
    );

    return { fbClaimAllRewards, sessionId, trackingData };
};

export default useFBAllClaimRewards;
