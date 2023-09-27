import { lastCompletedTxHashAtom } from "atoms/transactions";
import { useSocket } from "context/socket";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const TxCompletedTracker = () => {
    const { socket } = useSocket();
    const setLastCompletedTxHash = useSetRecoilState(lastCompletedTxHashAtom);
    useEffect(() => {
        if (!socket) return;
        const onTxCompleted = (hash: string) => {
            // delay to get reliable transaction status
            setTimeout(() => {
                setLastCompletedTxHash(hash);
            }, 500);
        };
        socket.on("transactionCompleted", onTxCompleted);
        return () => {
            socket.off("transactionCompleted", onTxCompleted);
        };
    }, [socket, setLastCompletedTxHash]);

    return null;
};
