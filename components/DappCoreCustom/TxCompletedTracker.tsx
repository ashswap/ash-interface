import { completedTxsAtom } from "atoms/transactions";
import { useSocket } from "context/socket";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";


export const TxCompletedTracker = () => {
    const socket = useSocket();
    const setCompletedTxs = useSetRecoilState(completedTxsAtom);
    useEffect(() => {
        if(!socket) return;
        const onTxCompleted = (hash: string) => {
            setCompletedTxs(txs => [...txs, hash]);
        }
        socket.on('transactionCompleted', onTxCompleted)
        return () => {socket.off('transactionCompleted', onTxCompleted)}
    }, [socket, setCompletedTxs]);
    return null;
}