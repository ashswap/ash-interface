import { accIsLoggedInState } from "atoms/dappState";
import { govLockedAmtSelector, govUnlockTSSelector } from "atoms/govState";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ASH_TOKEN } from "const/tokens";
import { toEGLDD } from "helper/balance";
import VotingEscrowContract from "helper/contracts/votingEscrowContract";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import moment from "moment";
import { useRecoilCallback } from "recoil";

const useGovUnlockASH = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const unlockASH = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const unlockTS = await snapshot.getPromise(govUnlockTSSelector);
                const lockedAmt = await snapshot.getPromise(
                    govLockedAmtSelector
                );

                if (!loggedIn || unlockTS.minus(moment().unix()).gt(0))
                    return { sessionId: "" };
                const veContract = new VotingEscrowContract(
                    ASHSWAP_CONFIG.dappContract.voteEscrowedContract
                );
                const payload: DappSendTransactionsPropsType = {
                    transactions: await veContract.withdraw(),
                    transactionsDisplayInfo: {
                        successMessage: `Unlock success ${toEGLDD(
                            ASH_TOKEN.decimals,
                            lockedAmt
                        )} ${ASH_TOKEN.symbol}`,
                    },
                };
                return await sendTransactions(payload);
            },
        [sendTransactions]
    );

    return { unlockASH, trackingData, sessionId };
};

export default useGovUnlockASH;
