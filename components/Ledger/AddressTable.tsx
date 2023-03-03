import ICArrowLeft from "assets/svg/arrow-left.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import GlowingButton from "components/GlowingButton";

import { useEffect } from "react";

import { AddressRow } from "./AddressRow";

const LEDGER_WAITING_TEXT = "Waiting for device";
const ADDRESSES_PER_PAGE = 10;

export interface AddressTablePropsType {
    loading: boolean;
    accounts: string[];
    startIndex: number;
    selectedAddress?: string;
    onSelectAddress: (
        address: { address: string; index: number } | null
    ) => void;
    onGoToPrevPage: () => void;
    onGoToNextPage: () => void;
    onConfirmSelectedAddress: () => void;
}

export const AddressTable = ({
    loading,
    accounts,
    startIndex,
    selectedAddress,
    onGoToPrevPage,
    onGoToNextPage,
    onConfirmSelectedAddress,
    onSelectAddress,
}: AddressTablePropsType) => {
    useEffect(() => {
        const isAccountsLoaded = accounts.length > 0 && !loading;

        const isFirstPageAndNoAddressSelected =
            !selectedAddress && startIndex === 0;

        const shouldSelectFirstAddress =
            isAccountsLoaded && isFirstPageAndNoAddressSelected;
        if (shouldSelectFirstAddress) {
            const index = 0;
            const address = accounts[index];
            onSelectAddress({ address, index });
        }
    }, [accounts, selectedAddress, loading, startIndex, onSelectAddress]);

    if (loading) {
        return <></>;
    }
    return (
        <>
            <div>
                <div className="">
                    <div className="">
                        <div className="overflow-auto">
                            <table className="w-full">
                                <thead className="bg-ash-dark-600 h-12 px-4">
                                    <tr className="text-ash-gray-600 font-medium">
                                        <th className="px-4 text-left">
                                            Address
                                        </th>
                                        <th className="px-4 text-right">
                                            Balance
                                        </th>
                                        <th className="px-4">#</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {accounts.map((address, index) => {
                                        const key =
                                            index +
                                            startIndex * ADDRESSES_PER_PAGE;

                                        return (
                                            <AddressRow
                                                key={key}
                                                address={address}
                                                index={key}
                                                selectedAddress={
                                                    selectedAddress
                                                }
                                                onSelectAddress={
                                                    onSelectAddress
                                                }
                                                className="bg-ash-dark-600 border-b border-b-ash-dark-400 h-12 "
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="h-12 bg-ash-dark-600 flex justify-center items-center">
                            <button
                                type="button"
                                className="inline-flex disabled:text-white/20 text-pink-600"
                                onClick={onGoToPrevPage}
                                data-testid="prevBtn"
                                disabled={startIndex === 0}
                            >
                                <ICArrowLeft />
                            </button>
                            <div className="text-white px-7">
                                {startIndex + 1}
                            </div>
                            <button
                                type="button"
                                className="inline-flex text-pink-600"
                                onClick={onGoToNextPage}
                                data-testid="nextBtn"
                            >
                                <ICArrowRight />
                            </button>
                        </div>

                        <div className="flex justify-center mt-10">
                            <GlowingButton
                                theme="pink"
                                className="px-12 h-12 font-bold text-sm disabled:bg-ash-dark-700"
                                disabled={!selectedAddress}
                                onClick={onConfirmSelectedAddress}
                            >
                                Confirm
                            </GlowingButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
