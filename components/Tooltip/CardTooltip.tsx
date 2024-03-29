import BaseTooltip, { BaseTooltipProps } from "components/BaseTooltip";
import React from "react";

type Props = BaseTooltipProps & { disabled?: boolean };
function CardTooltip({ content, disabled, ...props }: Props) {
    if (disabled) {
        return <>{props.children}</>;
    }
    return (
        <BaseTooltip
            {...props}
            content={(args) => (
                <div
                    className={`max-w-[370px] clip-corner-4 clip-corner-br bg-clip-border p-[1px] backdrop-blur-[30px] transition-all overflow-hidden`}
                >
                    <div className="clip-corner-4 clip-corner-br p-7 bg-ash-dark-600/50 backdrop-blur-[30px] text-stake-gray-500 font-bold text-xs sm:text-sm break-words">
                        {typeof content === "function"
                            ? content(args)
                            : content}
                    </div>
                </div>
            )}
        />
    );
}

export default CardTooltip;
