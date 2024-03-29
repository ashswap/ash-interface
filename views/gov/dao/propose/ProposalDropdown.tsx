import BasePopover from "components/BasePopover";
import React, { memo, useMemo } from "react";
import ICChevronDown from "assets/svg/chevron-down.svg";
import { PROPOSALS_CONFIG, ProposalType } from "const/proposal";
import { ENVIRONMENT } from "const/env";
const excludeProposals: Array<ProposalType> =
    ENVIRONMENT.NETWORK === "mainnet" ? ["pr:createPool", "fr:createFarm"] : [];
export const ProposalTypeOptions: Array<{
    label: string;
    value: ProposalType;
}> = Object.entries(PROPOSALS_CONFIG)
    .filter(([k, v]) => {
        return !excludeProposals.includes(k as any);
    })
    .map(([k, v]) => ({ label: v as string, value: k as ProposalType }));
type Props = {
    value: ProposalType;
    onSelect: (proposal: ProposalType) => void;
};
function ProposalDropdown({ value, onSelect }: Props) {
    const selectedOption = useMemo(() => {
        return ProposalTypeOptions.find((opt) => opt.value === value);
    }, [value]);
    return (
        <BasePopover
            className="absolute text-white left-0 top-2 w-full max-h-72 overflow-auto bg-ash-dark-700 "
            options={{
                placement: "bottom-start",
                modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
            }}
            button={() => (
                <div className="w-full px-6 py-4 flex items-center justify-between text-xs font-bold text-stake-gray-500 leading-normal bg-ash-dark-400 cursor-pointer">
                    {selectedOption ? (
                        <>
                            <div className="flex items-center">
                                {selectedOption.label}
                            </div>
                        </>
                    ) : (
                        <>Select proposal type to start</>
                    )}
                    <ICChevronDown className="w-2 h-auto ml-1" />
                </div>
            )}
        >
            {({ close }) => {
                return (
                    <ul className="my-6 max-h-52">
                        {ProposalTypeOptions.map((p) => {
                            return (
                                <li key={p.value} className="relative">
                                    <button
                                        className="flex items-center w-full py-3 text-left px-6 text-xs font-bold"
                                        onClick={() => {
                                            onSelect(p.value);
                                            close();
                                        }}
                                    >
                                        {p.label}
                                    </button>
                                    {p.value === value && (
                                        <span className="absolute w-[3px] h-5 bg-pink-600 top-1/2 -translate-y-1/2 left-0"></span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                );
            }}
        </BasePopover>
    );
}

export default memo(ProposalDropdown);
