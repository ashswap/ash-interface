import BigNumber from "bignumber.js";
import TextAmt from "components/TextAmt";
import { DAPP_CONFIG } from "const/dappConfig";
import { shortenString } from "helper/string";
import Link from "next/link";
import React, { memo } from "react";

type Props = {
    items?: Array<{
        address: string;
        power: BigNumber.Value;
        isSupport: boolean;
    }>;
};
function DAOVoterTable({ items = [] }: Props) {
    return (
        <table className="w-full border border-collapse border-black">
            <thead>
                <tr>
                    <th className="w-5/12 px-6 py-3 border border-black font-bold text-sm text-stake-gray-500 text-left">
                        Voter
                    </th>
                    <th className="w-4/12 px-6 py-3 border border-black font-bold text-sm text-stake-gray-500 text-left">
                        Voting Type
                    </th>
                    <th className="w-3/12 px-6 py-3 border border-black font-bold text-sm text-stake-gray-500 text-right">
                        veASH
                    </th>
                </tr>
            </thead>
            <tbody>
                {items?.map((v, i) => {
                    return (
                        <tr key={i} className="">
                            <td className="px-6 py-3 border border-black font-bold text-xs text-white text-left">
                                <Link
                                    href={`${DAPP_CONFIG.explorerAddress}/accounts/${v.address}`}
                                    target="_blank"
                                >
                                    <span className="font-bold text-xs text-white">
                                        {shortenString(v.address)}
                                    </span>
                                </Link>
                            </td>
                            <td
                                className={`px-6 py-3 border border-black font-bold text-xs text-left ${
                                    v.isSupport
                                        ? "text-stake-green-500"
                                        : "text-ash-purple-500"
                                }`}
                            >
                                {v.isSupport ? "Support" : "Against"}
                            </td>
                            <td
                                className={`px-6 py-3 border border-black font-bold text-xs text-white text-right`}
                            >
                                <TextAmt number={v.power} />
                            </td>
                        </tr>
                    );
                })}
                <tr></tr>
            </tbody>
        </table>
    );
}

export default memo(DAOVoterTable);
