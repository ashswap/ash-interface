import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import moment from "moment";
import IconNewTab from "assets/svg/new-tab-green.svg";
import {
    AccountInfoSliceNetworkType,
    getAddressFromDataField,
    getIsTransactionPending,
    getIsTransactionSuccessful,
    getIsTransactionTimedOut,
    isBatchTransactionPending,
    SignedTransactionsType,
    SignedTransactionType,
    TransactionBatchStatusesEnum,
    transactionServices,
    useGetNetworkConfig,
    useGetSignedTransactions,
    useGetTransactionDisplayInfo,
} from "@elrondnetwork/dapp-core";
import ToastProgress from "./ToastProgress";
import { notification } from "antd";
const averageTxDurationMs = 6000;
const crossShardRounds = 5;
interface TransactionToastPropsType {
    title?: string;
    toastId: string;
    className?: string;
    errorMessage?: string;
    withTxNonce?: boolean;
    successMessage?: string;
    endTimeProgress?: number;
    processingMessage?: string;
    startTimeProgress?: number;
    shouldRenderDefaultCss?: boolean;
    transactions: SignedTransactionType[];
    status: TransactionBatchStatusesEnum;
    lifetimeAfterSuccess?: number;
    onClose?: (toastId: string) => void;
}
export const TxToast = ({
    toastId,
    title = "",
    shouldRenderDefaultCss = true,
    className = "transaction-toast",
    withTxNonce = false,
    transactions,
    status,
    onClose,
    startTimeProgress,
    endTimeProgress,
    lifetimeAfterSuccess,
}: TransactionToastPropsType) => {
    const ref = useRef(null);
    const [shouldRender, setShouldRender] = useState(true);
    const transactionDisplayInfo = useGetTransactionDisplayInfo(toastId);
    const network: AccountInfoSliceNetworkType = useGetNetworkConfig().network;
    const {signedTransactions} = useGetSignedTransactions();
    // const accountShard = useGetAccountShard();

    const {
        errorMessage = "Transaction failed",
        timedOutMessage = "Transaction timed out",
        successMessage = "Transaction successful",
        processingMessage = "Processing transaction",
        transactionDuration = 10000,
    } = transactionDisplayInfo;

    // const isSameShard = useMemo(
    //     () =>
    //         transactions!.reduce(
    //             (
    //                 prevTxIsSameShard: boolean,
    //                 { receiver, data }: SignedTransactionType
    //             ) => {
    //                 const receiverAddress = getAddressFromDataField({
    //                     receiver,
    //                     data,
    //                 });
    //                 if (receiverAddress == null) {
    //                     return prevTxIsSameShard;
    //                 }
    //                 return (
    //                     prevTxIsSameShard &&
    //                     isCrossShardTransaction({
    //                         receiverAddress,
    //                         senderShard: accountShard,
    //                     })
    //                 );
    //             },
    //             true
    //         ),
    //     [transactions, accountShard]
    // );

    // const shardAdjustedDuration = isSameShard
    //     ? averageTxDurationMs
    //     : crossShardRounds * averageTxDurationMs;

    // const transactionDuration =
    //     transactionDisplayInfo?.transactionDuration|| shardAdjustedDuration;

    const [startTime, endTime] = useMemo(() => {
        const startTime = startTimeProgress || moment().unix();
        const endTime =
            endTimeProgress ||
            moment().add(Number(transactionDuration), "milliseconds").unix();
        return [startTime, endTime];
    }, []);

    const progress = { startTime, endTime };
    
    const isPending = useMemo(() => getIsTransactionPending(status), [status]);
    const isTimedOut = useMemo(
        () => getIsTransactionTimedOut(status),
        [status]
    );
    const isSuccess = useMemo(() => getIsTransactionSuccessful(status), [status])
    const done = useMemo(
        () => !isPending || isTimedOut,
        [isPending, isTimedOut]
    );

    const handleDeleteToast = useCallback(() => {
        setShouldRender(false);
        onClose?.(toastId);
    }, [onClose, toastId]);
    const expireTS = useMemo(() => {
        if (done) return moment().add(lifetimeAfterSuccess, "s").unix();
        return false;
    }, [done, lifetimeAfterSuccess]);

    useEffect(() => {
        let timeout: any;
        if (expireTS && typeof expireTS === "number") {
            const timeLeft = (expireTS - moment().unix()) * 1000;
            timeout = setTimeout(() => {
                handleDeleteToast();
            }, Math.max(timeLeft, 0));
        }
        return () => timeout && clearTimeout(timeout);
    }, [handleDeleteToast, lifetimeAfterSuccess, expireTS]);

    useEffect(() => {
        if(isPending) {
            notification.open({
                key: toastId,
                message: successMessage,
                icon: <IconNewTab />,
                duration: 30,
    
                onClick: () =>
                    window.open(
                        network.explorerAddress +
                            "/transactions/" +
                            transactions[0].hash.toString(),
                        "_blank"
                    ),
            });
        }
    }, [network.explorerAddress, successMessage, transactions, toastId, isPending])

    if (!shouldRender || transactions == null) {
        return null;
    }

    return null;
    return (
        <div>
            <ToastProgress
                key={toastId}
                id={toastId}
                progress={progress}
                done={done}
                expiresIn={lifetimeAfterSuccess}
            >
                <div>{transactions[0].hash}</div>
            </ToastProgress>
        </div>
    );
};

export default TxToast;
