import ICCaretDown from "assets/svg/caret-down.svg";
import ICCaretLeft from "assets/svg/caret-left.svg";
import ICCaretRight from "assets/svg/caret-right.svg";
import ICCaretUp from "assets/svg/caret-up.svg";
import ICClose from "assets/svg/close.svg";
import { memo } from "react";
const Arrow = ({
    direction,
    onClick,
}: {
    direction?: "top" | "left" | "right" | "bottom";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <button
            className={`relative items-center ${
                direction
                    ? direction === "top" || direction === "bottom"
                        ? "flex flex-col"
                        : "flex"
                    : ""
            }`}
            disabled={!onClick}
            onClick={onClick}
        >
            {direction === "top" && (
                <ICCaretUp className="absolute text-stake-green-500 w-2 h-2 top-0 -translate-y-full" />
            )}
            {direction === "left" && (
                <ICCaretLeft className="absolute text-stake-green-500 w-2 h-2 left-0 -translate-x-full" />
            )}
            <div
                className="m-0.5 border border-stake-green-500 w-5 h-5 flex items-center justify-center rotate-45 bg-transparent"
                style={{
                    boxShadow:
                        "0px 4px 20px rgba(0, 255, 117, 0.5), 0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
            >
                <div className={`transition-all bg-stake-green-500 w-2.5 h-2.5 flex items-center justify-center ${onClick ? "group-hover:scale-[2]" : ""}`}>
                    <ICClose className={`text-ash-dark-600 -rotate-45 w-1 h-1 ${onClick ? "group-hover:block" : "hidden"}`} />
                </div>
            </div>
            {direction === "bottom" && (
                <ICCaretDown className="absolute text-stake-green-500 w-2 h-2 bottom-0 translate-y-full" />
            )}
            {direction === "right" && (
                <ICCaretRight className="absolute text-stake-green-500 w-2 h-2 right-0 translate-x-full" />
            )}
        </button>
    );
};

export default memo(Arrow);