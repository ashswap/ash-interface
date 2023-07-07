import { Address } from "@multiversx/sdk-core/out";
import {
    useGetSignedTransactions,
    useTrackTransactionStatus,
} from "@multiversx/sdk-dapp/hooks";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { SendTransactionsPropsType } from "@multiversx/sdk-dapp/types";
import { collapseModalState } from "atoms/collapseState";
import { accAddressState } from "atoms/dappState";
// import { sendTransactions } from "helper/transactionMethods";
import { DappSendTransactionsPropsType } from "interface/dappCore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";

const useSendTxsWithTrackStatus = (trackStatus = false) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const _trackingData = useTrackTransactionStatus({
        transactionId: sessionId,
    });
    const { signedTransactions } = useGetSignedTransactions();
    const [isClickedCollapse, setIsClickedCollapse] =
        useRecoilState(collapseModalState);
    const func = useRecoilCallback(
        ({ snapshot }) =>
            async (payload: DappSendTransactionsPropsType) => {
                const sender = await snapshot.getPromise(accAddressState);
                setIsSending(true);
                const sendPayload: SendTransactionsPropsType = {
                    signWithoutSending: false,
                    transactionsDisplayInfo: {},
                    ...payload,
                    transactions: payload.interactions.map((interaction) =>
                        interaction
                            .withSender(new Address(sender))
                            .check()
                            .buildTransaction()
                    ),
                };
                const result = await sendTransactions(sendPayload);
                setSessionId(trackStatus ? result.sessionId : null);
                setIsClickedCollapse(false);
                return result;
            },
        [trackStatus]
    );
    const isSigned = useMemo(() => {
        return !!signedTransactions[sessionId];
    }, [signedTransactions, sessionId]);
    const isCompleted = useMemo(() => {
        return (
            _trackingData.isCancelled ||
            _trackingData.isFailed ||
            _trackingData.isSuccessful
        );
    }, [
        _trackingData.isCancelled,
        _trackingData.isFailed,
        _trackingData.isSuccessful,
    ]);
    const trackingData = useMemo(() => {
        return { ..._trackingData, isSigned, isCompleted, isSending };
    }, [_trackingData, isSigned, isCompleted, isSending]);
    useEffect(() => {
        if (isCompleted) {
            setIsSending(false);
        }
    }, [isCompleted]);
    return { trackingData, sessionId, sendTransactions: func };
};

export default useSendTxsWithTrackStatus;
