import { accInfoState } from "atoms/dappState";
import BigNumber from "bignumber.js";
import { WRAPPED_EGLD } from "const/wrappedEGLD";
import { ContractManager } from "helper/contracts/contractManager";
import { formatAmount } from "helper/number";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { useRecoilCallback } from "recoil";

const useWrapEGLD = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const wrapEGLD = useRecoilCallback(
        ({snapshot}) => async (weiAmt: BigNumber) => {
            const shard = (await snapshot.getPromise(accInfoState)).shard;
            const tx = await ContractManager.getWrappedEGLDContract(WRAPPED_EGLD.wegldContracts[shard || 0]).wrapEgld(weiAmt);
            return await sendTransactions({
                transactions: tx,
                transactionsDisplayInfo: {
                    successMessage: `Wrap ${formatAmount(weiAmt.div(10**18))} EGLD successfully`,
                },
            });
        },
        [sendTransactions]
    );
    return { wrapEGLD, trackingData, sessionId };
};
export default useWrapEGLD;
