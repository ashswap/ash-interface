import { useGetSignedTransactions, useTrackTransactionStatus } from "@multiversx/sdk-dapp/hooks";
import { collapseModalState } from "atoms/collapseState";
import { sendTransactions } from "helper/transactionMethods";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { useCallback, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

const useSendTxsWithTrackStatus = (trackStatus = false) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const _trackingData = useTrackTransactionStatus({
        transactionId: sessionId,
    });
    const {signedTransactions} = useGetSignedTransactions();
    const [isClickedCollapse, setIsClickedCollapse] =
        useRecoilState(collapseModalState);
    const func = useCallback(
        async (payload: DappSendTransactionsPropsType) => {
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
    const trackingData = useMemo(() => {
        return {..._trackingData, isSigned};
    }, [_trackingData, isSigned]);
    return { trackingData, sessionId, sendTransactions: func, isSigned };
};

export default useSendTxsWithTrackStatus;
