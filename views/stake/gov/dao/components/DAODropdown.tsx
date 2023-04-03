import BasePopover from "components/BasePopover";
import React, { memo, useMemo } from "react";
import ICChevronDown from "assets/svg/chevron-down.svg";

type Props = {
    value?: string | number;
    options: Array<{ value: string | number; label: React.ReactNode }>;
    placeholder?: string;
    invalid?: boolean;
    onSelect: (val: string | number) => void;
};
function DAODropdown({
    value,
    options,
    placeholder,
    invalid,
    onSelect,
}: Props) {
    const selectedOption = useMemo(() => {
        return options.find((opt) => opt.value === value);
    }, [value, options]);
    return (
        <BasePopover
            className="absolute text-white left-0 top-2 w-full max-h-72 overflow-auto bg-ash-dark-700 "
            options={{
                placement: "bottom-start",
                modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
            }}
            button={() => (
                <div
                    className={`w-full px-6 py-4 flex items-center justify-between text-xs font-bold text-stake-gray-500 leading-normal bg-ash-dark-400 cursor-pointer border ${
                        invalid ? "border-ash-purple-500" : "border-transparent"
                    }`}
                >
                    {selectedOption ? (
                        <>
                            <div className="grow flex items-center overflow-hidden">
                                <div className="truncate">
                                    {selectedOption.label}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="truncate grow">
                            {placeholder || "Select an options"}
                        </div>
                    )}
                    <ICChevronDown className="shrink-0 w-2 h-auto ml-1" />
                </div>
            )}
        >
            {({ close }) => {
                return (
                    <ul className="w-full py-6 max-h-52 overflow-auto">
                        {options.map((p) => {
                            return (
                                <li key={p.value} className="w-full min-w-fit relative">
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

export default memo(DAODropdown);
