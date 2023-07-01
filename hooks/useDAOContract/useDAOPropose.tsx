import { Address, ArgSerializer, Interaction } from "@multiversx/sdk-core/out";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ContractManager } from "helper/contracts/contractManager";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useDAOPropose = (trackStatus = false) => {
    const { sendTransactions, sessionId, trackingData } =
        useSendTxsWithTrackStatus(trackStatus);
    const propose = useRecoilCallback(
        ({ snapshot, set }) =>
            async (meta: string, interactions: Interaction[]) => {
                const argSerializer = new ArgSerializer();
                const tx = await ContractManager.getDAOContract(
                    ASHSWAP_CONFIG.dappContract.dao
                ).propose(meta, interactions.map(interaction => ({
                    dest_address: new Address(interaction.getContractAddress().bech32()),
                    function_name: interaction.getFunction().toString(),
                    arguments: argSerializer.valuesToBuffers(interaction.getArguments()),
                })));
                await sendTransactions({
                    transactions: [tx],
                    transactionsDisplayInfo: {
                        successMessage: "Create proposal success!",
                    },
                });
            },
        [sendTransactions]
    );

    return { propose, sessionId, trackingData };
};

export default useDAOPropose;
