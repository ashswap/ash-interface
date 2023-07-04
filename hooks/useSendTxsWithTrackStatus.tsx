import { useGetSignedTransactions, useTrackTransactionStatus } from "@multiversx/sdk-dapp/hooks";
import { collapseModalState } from "atoms/collapseState";
import { sendTransactions } from "helper/transactionMethods";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

const useSendTxsWithTrackStatus = (trackStatus = false) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const _trackingData = useTrackTransactionStatus({
        transactionId: sessionId,
    });
    const {signedTransactions} = useGetSignedTransactions();
    const [isClickedCollapse, setIsClickedCollapse] =
        useRecoilState(collapseModalState);
    const func = useCallback(
        async (payload: DappSendTransactionsPropsType) => {
            setIsSending(true);
            const result = await sendTransactions(payload);
            setSessionId(trackStatus ? result.sessionId : null);
            setIsClickedCollapse(false);
            return result;
        },
        [trackStatus]
    );
    const isSigned = useMemo(() => {
        return !!signedTransactions[sessionId]
    }, [signedTransactions, sessionId]);
    const isCompleted = useMemo(() => {
        return _trackingData.isCancelled || _trackingData.isFailed || _trackingData.isSuccessful;
    }, [_trackingData.isCancelled, _trackingData.isFailed, _trackingData.isSuccessful]);
    const trackingData = useMemo(() => {
        return {..._trackingData, isSigned, isCompleted, isSending};
    }, [_trackingData, isSigned, isCompleted, isSending]);
    useEffect(() => {
        if (isCompleted) {
            setIsSending(false);
        }
    }, [isCompleted]);
    return { trackingData, sessionId, sendTransactions: func };
};

export default useSendTxsWithTrackStatus;
