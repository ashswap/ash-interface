import React, { memo } from "react";

type Props = {
    label?: string;
    invalid?: boolean;
} & JSX.IntrinsicElements["input"]
function DAOInput({label, id, invalid, ...inputProps}: Props) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 font-bold text-sm text-stake-gray-500"
            >
                {label}
            </label>
            <input
                type="text"
                id={id}
                className={`w-full px-6 py-4 bg-ash-dark-400 outline-none font-bold text-xs text-white leading-tight placeholder:text-ash-gray-600 border ${invalid ? "border-ash-purple-500" : "border-transparent"}`}
                {...inputProps}
            />
        </div>
    );
}

export default memo(DAOInput);
