import { useTrackTransactionStatus } from "@elrondnetwork/dapp-core/hooks";
import { sendTransactions } from "helper/transactionMethods";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { useCallback, useState } from "react";

const useSendTxsWithTrackStatus = (trackStatus = false) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const trackingData = useTrackTransactionStatus({transactionId: sessionId});
    const func = useCallback(async (payload: DappSendTransactionsPropsType) => {
        const result = await sendTransactions(payload);
        setSessionId(trackStatus ? result.sessionId : null);
        return result;
    }, [trackStatus]);
    return {trackingData, sessionId, sendTransactions: func};
}

export default useSendTxsWithTrackStatus;