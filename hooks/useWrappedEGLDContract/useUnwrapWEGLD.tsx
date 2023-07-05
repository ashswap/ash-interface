import { TokenTransfer } from "@multiversx/sdk-core/out";
import { accInfoState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { ContractManager } from "helper/contracts/contractManager";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useUnwrapWEGLD = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const unwrapWEGLD = useRecoilCallback(
        ({ snapshot }) =>
            async (tokenAmount: TokenAmount) => {
                const shard = (await snapshot.getPromise(accInfoState)).shard;
                const tx = await ContractManager.getWrappedEGLDContract(
                    WRAPPED_EGLD.wegldContracts[shard || 0]
                ).unwrapEgld(
                    TokenTransfer.fungibleFromBigInteger(
                        tokenAmount.token.identifier,
                        tokenAmount.raw,
                        tokenAmount.token.decimals
                    )
                );
                return await sendTransactions({
                    transactions: tx,
                    transactionsDisplayInfo: {
                        successMessage: `Unwrap ${formatAmount(
                            tokenAmount.egld
                        )} wEGLD successfully`,
                    },
                });
            },
        [sendTransactions]
    );
    return { unwrapWEGLD, trackingData, sessionId };
};
export default useUnwrapWEGLD;
