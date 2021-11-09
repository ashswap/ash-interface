import { ExtensionProvider } from "@elrondnetwork/erdjs";
import { createContext, useCallback, useContext, useState } from "react";

export interface State {
    provider?: ExtensionProvider
    slippage: number
    connectExtension: () => void
    setSlippage: (slippage: number) => void
}

export const initState: State = {
    slippage: 0.001,
    connectExtension: () => {},
    setSlippage: () => {},
}

export const WalletContext = createContext<State>(initState);
export function useWallet() {
    return useContext(WalletContext);
}

interface Props {
    children: any;
}
export function WalletProvider({children}: Props) {
    const [provider, setProvider] = useState<ExtensionProvider | undefined>(undefined);
    const [slippage, setSlippage] = useState<number>(initState.slippage);

    const connectExtension = useCallback(() => {
        if (provider) {
            return;
        }

        const newProvider = ExtensionProvider.getInstance();
        newProvider
            .init()
            .then(async initialised => {
                if (initialised) {
                    await newProvider.login({
                        callbackUrl: encodeURIComponent(
                            `${window.location.origin}`
                        )
                    });

                    setProvider(newProvider);

                    const { signature, address } = newProvider.account;
                } else {
                    console.warn(
                        "Something went wrong trying to redirect to wallet login.."
                    );
                }
            })
            .catch(err => {
                console.warn(err);
            });
    }, [provider]);

    const value: State = {
        provider,
        slippage,
        setSlippage,
        connectExtension,
    }
    
    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    )
}