import BaseTooltip, { BaseTooltipProps } from "components/BaseTooltip";
import React from "react";

type Props = Omit<BaseTooltipProps, "content"> & {
    text: string;
    className?: string;
};
function TextTooltip({ text, className, ...props }: Props) {
    return (
        <BaseTooltip
            {...props}
            content={
                <div
                    className={`min-w-8 min-h-8 max-w-[250px] break-words px-3 py-2 text-white bg-stake-dark-400 shadow-lg text-xs ${className}`}
                >
                    {text}
                </div>
            }
        />
    );
}

export default TextTooltip;
