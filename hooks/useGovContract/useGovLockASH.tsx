import { TokenTransfer } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ASH_TOKEN } from "const/tokens";
import { toEGLD } from "helper/balance";
import VotingEscrowContract from "helper/contracts/votingEscrowContract";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import moment from "moment";
import { useRecoilCallback } from "recoil";

const useGovLockASH = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const createLock = useRecoilCallback(
        () => async (weiAmt: BigNumber, unlockTimestamp: BigNumber) => {
            const veContract = new VotingEscrowContract(
                ASHSWAP_CONFIG.dappContract.voteEscrowedContract
            );
            const tokenPayment = TokenTransfer.fungibleFromBigInteger(
                ASH_TOKEN.identifier,
                weiAmt,
                ASH_TOKEN.decimals
            );
            const tx = await veContract.createLock(
                tokenPayment,
                unlockTimestamp.toNumber()
            );
            return await sendTransactions({
                transactions: tx,
                transactionsDisplayInfo: {
                    successMessage: `Lock succeed ${toEGLD(
                        ASH_TOKEN,
                        weiAmt?.toString() || "0"
                    )} ${ASH_TOKEN.symbol}, unlock on ${moment
                        .unix(unlockTimestamp.toNumber())
                        .format("DD MMM, yyyy")}`,
                },
            });
        },
        [sendTransactions]
    );
    return { createLock, trackingData, sessionId };
};
export default useGovLockASH;
