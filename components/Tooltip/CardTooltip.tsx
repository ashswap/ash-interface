import BaseTooltip, { BaseTooltipProps } from "components/BaseTooltip";
import React from "react";

type Props = BaseTooltipProps;
function CardTooltip({ content, ...props }: Props) {
    return (
        <BaseTooltip
            {...props}
            content={
                <div
                    className={`max-w-[320px] clip-corner-4 clip-corner-br bg-clip-border p-[1px] backdrop-blur-[30px] transition-all overflow-hidden`}
                >
                    <div className="clip-corner-4 clip-corner-br p-7 bg-ash-dark-600/80 backdrop-blur-[30px] text-stake-gray-500 font-bold text-xs sm:text-sm break-words">
                        {content}
                    </div>
                </div>
            }
        />
    );
}

export default CardTooltip;
