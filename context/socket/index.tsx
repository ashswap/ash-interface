import { accAddressState } from "atoms/dappState";
import { ENVIRONMENT } from "const/env";
import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { io } from "socket.io-client";

export const SocketContext = createContext<ReturnType<typeof io> | undefined>(
    undefined
);
export const SocketProvider = ({ children }: { children: any }) => {
    const [socket, setSocket] = useState<ReturnType<typeof io> | undefined>();
    const accAddress = useRecoilValue(accAddressState);

    useEffect(() => {
        const socket = io(ENVIRONMENT.ASH_SOCKET, {
            query: { address: accAddress },
        });
        setSocket(socket);
        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [accAddress]);
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
export const useSocket = () => {
    return useContext(SocketContext)!;
};
