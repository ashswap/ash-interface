import { useTrackTransactionStatus } from "@elrondnetwork/dapp-core/hooks";
import { collapseModalState } from "atoms/collapseState";
import { sendTransactions } from "helper/transactionMethods";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";

const useSendTxsWithTrackStatus = (trackStatus = false) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const trackingData = useTrackTransactionStatus({transactionId: sessionId});
    const [isClickedCollapse, setIsClickedCollapse] = useRecoilState(collapseModalState);
    const func = useCallback(async (payload: DappSendTransactionsPropsType) => {
        const result = await sendTransactions(payload);
        setSessionId(trackStatus ? result.sessionId : null);
        setIsClickedCollapse(false);
        return result;
    }, [trackStatus]);
    return {trackingData, sessionId, sendTransactions: func};
}

export default useSendTxsWithTrackStatus;