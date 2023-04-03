import BigNumber from "bignumber.js";
import TextAmt from "components/TextAmt";
import { shortenString } from "helper/string";
import React, { memo } from "react";

type Props = {
    items?: Array<{address: string, power: BigNumber.Value, isSupport: boolean}>;
}
function DAOVoterTable({items = []}: Props) {
    return (
        <table className="w-full border border-collapse border-black">
            <thead>
                <tr>
                    <th className="w-5/12 px-6 py-3 border border-black font-bold text-sm text-stake-gray-500 text-left">
                        Voters
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
                                {shortenString(v.address)}
                            </td>
                            <td
                                className={`px-6 py-3 border border-black font-bold text-xs text-left ${v.isSupport ? "text-stake-green-500" : "text-ash-purple-500"}`}
                            >
                                {v.isSupport ? "Support": "Against"}
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
