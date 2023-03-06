import { TokenPayment, Transaction } from "@multiversx/sdk-core/out";
import { accIsLoggedInState } from "atoms/dappState";
import { govUnlockTSSelector } from "atoms/govState";
import BigNumber from "bignumber.js";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { ASH_TOKEN } from "const/tokens";
import { toEGLD } from "helper/balance";
import VotingEscrowContract from "helper/contracts/votingEscrowContract";
import useSendTxsWithTrackStatus from "hooks/useSendTxsWithTrackStatus";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import moment from "moment";
import { useRecoilCallback } from "recoil";

const useGovLockMore = (trackStatus = false) => {
    const { sendTransactions, trackingData, sessionId } =
        useSendTxsWithTrackStatus(trackStatus);
    const lockMoreASH = useRecoilCallback(
        ({ snapshot, set }) =>
            async ({
                weiAmt,
                unlockTimestamp,
            }: { weiAmt?: BigNumber; unlockTimestamp?: BigNumber } = {}) => {
                const loggedIn = await snapshot.getPromise(accIsLoggedInState);
                const unlockTS = await snapshot.getPromise(govUnlockTSSelector);

                if (!loggedIn) return { sessionId: "" };
                let txs: Transaction[] = [];
                const veContract = new VotingEscrowContract(
                    ASHSWAP_CONFIG.dappContract.voteEscrowedContract
                );

                if (weiAmt && weiAmt.gt(0)) {
                    const tokenPayment = TokenPayment.fungibleFromBigInteger(
                        ASH_TOKEN.identifier,
                        weiAmt,
                        ASH_TOKEN.decimals
                    );
                    const increaseAmtTx = await veContract.increaseAmount(
                        tokenPayment
                    );
                    txs.push(increaseAmtTx);
                }
                if (unlockTimestamp && unlockTimestamp.gt(unlockTS)) {
                    const increaseLockTSTx =
                        await veContract.increaseUnlockTime(
                            unlockTimestamp.toNumber()
                        );
                    txs.push(increaseLockTSTx);
                }
                if (!txs.length) return { sessionId: "" };

                const payload: DappSendTransactionsPropsType = {
                    transactions: txs,
                    transactionsDisplayInfo: {
                        successMessage: `Lock succeed ${toEGLD(
                            ASH_TOKEN,
                            weiAmt?.toString() || "0"
                        )} ${ASH_TOKEN.symbol}, unlock on ${moment
                            .unix(
                                unlockTimestamp?.toNumber() ||
                                    unlockTS?.toNumber()
                            )
                            .format("DD MMM, yyyy")}`,
                    },
                };
                return await sendTransactions(payload);
            },
        [sendTransactions]
    );
    return { lockMoreASH, trackingData, sessionId };
};

export default useGovLockMore;
