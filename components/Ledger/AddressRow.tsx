import { getAccountBalance, getEgldLabel } from "@multiversx/sdk-dapp/utils";
import { formatAmount } from "helper/number";
import React, { useEffect, useState, SyntheticEvent, useCallback } from "react";
import ICHexagonDuo from "assets/svg/hexagon-duo.svg";
import ICCheck from "assets/svg/check.svg";
import { toEGLDD } from "helper/balance";
import { twMerge } from "tailwind-merge";

export interface AddressRowPropsType {
    selectedAddress?: string;
    index: number;
    address: string;
    onSelectAddress: (
        address: { address: string; index: number } | null
    ) => void;
    className?: string;
}

const noBalance = "...";
export const shortenString = (str: string, head = 6, tail?: number) => {
    const _tail = tail ?? head;
    if (head + _tail >= str.length) {
        return str;
    }
    return `${str.slice(0, head)}...${str.slice(-1 * _tail)}`;
};
export const AddressRow = ({
    address,
    index,
    selectedAddress,
    onSelectAddress,
    className,
}: AddressRowPropsType) => {
    const [balance, setBalance] = useState(noBalance);

    const handleChange = (event: SyntheticEvent) => {
        const { checked } = event.target as HTMLInputElement;

        if (checked) {
            onSelectAddress({ address, index });
        }
    };

    const fetchBalance = useCallback(async () => {
        try {
            const balance = await getAccountBalance(address);
            setBalance(balance);
        } catch (err) {
            console.error("error fetching balance", err, address);
        }
    }, [address]);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    return (
        <tr className={twMerge("transition-all duration-1000 ease", className)}>
            <td
                className="px-4 text-left cursor-pointer group"
                onClick={() => onSelectAddress({ address, index })}
            >
                <div className="flex items-center text-left">
                    <div className="mr-3 lg:mr-6 relative flex items-center justify-center">
                        <ICHexagonDuo
                            className={`transition-all duration-300 w-6 h-6  ${
                                selectedAddress === address
                                    ? "fill-pink-600/20 stroke-pink-600"
                                    : "stroke-white group-hover:stroke-pink-600"
                            }`}
                        />
                        <ICCheck
                            className={`transition-all absolute w-2.5 h-2.5 ${
                                selectedAddress === address
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                        />
                    </div>

                    <label
                        htmlFor={`check_${index}`}
                        role="button"
                        className="transition-all duration-300 font-bold text-xs md:text-sm text-ash-gray-500 group-hover:text-white"
                    >
                        <div className="">
                            <span>{shortenString(address, 8)}</span>
                        </div>
                    </label>
                </div>
            </td>

            <td className="px-4 min-w-[10rem]">
                <div className="bg-ash-dark-400 px-3 py-1.5 font-bold text-xs text-right">
                    {formatAmount(toEGLDD(18, balance).toNumber())}{" "}
                    {getEgldLabel()}
                </div>
            </td>

            <td className="px-4 text-center">{index}</td>
        </tr>
    );
};
