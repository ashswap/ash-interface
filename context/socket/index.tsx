import { accAddressState } from "atoms/dappState";
import { ENVIRONMENT } from "const/env";
import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { io } from "socket.io-client";

type SocketContextType = {
    socket?: ReturnType<typeof io>;
    socketExtra?: ReturnType<typeof io>;
};
export const SocketContext = createContext<SocketContextType>({});
export const SocketProvider = ({ children }: { children: any }) => {
    const [socket, setSocket] = useState<ReturnType<typeof io> | undefined>();
    const [socketExtra, setSocketExtra] = useState<
        ReturnType<typeof io> | undefined
    >();
    const accAddress = useRecoilValue(accAddressState);

    useEffect(() => {
        const socket = io(ENVIRONMENT.ASH_SOCKET, {
            query: { address: accAddress },
        });
        const socketExtra = ENVIRONMENT.ASH_SOCKET_EXTRA ? io(ENVIRONMENT.ASH_SOCKET_EXTRA, {
            query: { address: accAddress },
        }) : undefined;
        setSocket(socket);
        setSocketExtra(socketExtra);
        return () => {
            socket.removeAllListeners();
            socket.disconnect();
            socketExtra?.removeAllListeners();
            socketExtra?.disconnect();
        };
    }, [accAddress]);
    return (
        <SocketContext.Provider value={{ socket, socketExtra }}>
            {children}
        </SocketContext.Provider>
    );
};
export const useSocket = () => {
    return useContext(SocketContext)!;
};
