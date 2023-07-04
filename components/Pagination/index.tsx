import customTwMerge from "helper/customTwMerge";
import React, { memo, useMemo } from "react";
import ICArrowLeft from "assets/svg/arrow-left.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";

type Props = {
    className?: string;
    index?: number;
    total?: number;
    size?: number;
    hideOnSinglePage?: boolean;
    onChangeIndex?: (index: number) => void;
    onChangeSize?: (size: number) => void;
};
function Pagination({ className, index = 0, total = 10, size = 10, onChangeIndex, onChangeSize, hideOnSinglePage }: Props) {
    const pages = useMemo(() => {
        return Math.ceil(total / size);
    }, [size, total]);
    if(hideOnSinglePage && pages === 1) return null;
    return (
        <div
            className={`${customTwMerge(
                "bg-ash-dark-600 h-14 flex items-center justify-center text-xs",
                className
            )}`}
        >
            <button
                className={`p-1 ${
                    index === 0
                        ? "text-white/20 pointer-events-none"
                        : "text-pink-600"
                }`}
                disabled={index === 0}
                onClick={() => onChangeIndex?.(index - 1)}
            >
                <ICArrowLeft className="w-4 h-4" />
            </button>
            <div className="px-6">
                <span className="text-white">{index + 1}</span>
                <span className="text-ash-gray-500">/</span>
                <span className="text-ash-gray-500">{pages}</span>
            </div>
            <button
                className={`p-1 ${
                    index === pages - 1
                        ? "text-white/20 pointer-events-none"
                        : "text-pink-600"
                }`}
                disabled={index === pages - 1}
                onClick={() => onChangeIndex?.(index + 1)}
            >
                <ICArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

export default memo(Pagination);
