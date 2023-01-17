import {
    useGetAccountInfo,
    useLedgerLogin
} from "@elrondnetwork/dapp-core/hooks";
import { UseLedgerLoginPropsType } from "@elrondnetwork/dapp-core/hooks/login/useLedgerLogin";
import { } from "@elrondnetwork/dapp-core/types/login.types";
import { AddressTable } from "./AddressTable";
import { ConfirmAddress } from "./ConfirmAddress";
import { LedgerConnect } from "./LedgerConnect";

const ledgerWaitingText = "Waiting for device";

export interface LedgerLoginContainerPropsType extends UseLedgerLoginPropsType {
    wrapContentInsideModal?: boolean;
    onClose?: () => void;
    nativeAuth?: boolean;
}

export const LedgerLogin = ({
    callbackRoute,
    wrapContentInsideModal = true,
    onClose,
    onLoginRedirect,
    token,
    nativeAuth,
}: LedgerLoginContainerPropsType) => {

    const { ledgerAccount } = useGetAccountInfo();
    const [
        onStartLogin,
        { error, isLoading },
        {
            showAddressList,
            accounts,
            onGoToPrevPage,
            onGoToNextPage,
            onSelectAddress,
            onConfirmSelectedAddress,
            startIndex,
            selectedAddress,
        },
    ] = useLedgerLogin({ callbackRoute, token, onLoginRedirect });//nativeAuth

    function getContent() {
        if (isLoading) {
            return <div className="flex flex-col items-center py-10">
                <div className="w-10 h-10 mb-10 rounded-full border-4 border-t-transparent border-pink-600 animate-spin">
                </div>
                {ledgerWaitingText}
            </div>;
        }
        if (ledgerAccount != null && !error) {
            return <ConfirmAddress token={token} />;
        }

        if (showAddressList && !error) {
            return (
                <AddressTable
                    accounts={accounts}
                    loading={isLoading}
                    onGoToNextPage={onGoToNextPage}
                    onGoToPrevPage={onGoToPrevPage}
                    onSelectAddress={onSelectAddress}
                    startIndex={startIndex}
                    selectedAddress={selectedAddress?.address}
                    onConfirmSelectedAddress={onConfirmSelectedAddress}
                />
            );
        }

        return <LedgerConnect onClick={onStartLogin} error={error} />;
    }

    return getContent();
};
