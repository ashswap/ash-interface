import { Dimensions, ElementRects } from "@floating-ui/react";
import ICCaretDown from "assets/svg/caret-down.svg";
import ICCaretLeft from "assets/svg/caret-left.svg";
import ICCaretRight from "assets/svg/caret-right.svg";
import ICCaretUp from "assets/svg/caret-up.svg";
import ICClose from "assets/svg/close.svg";
import BaseTooltip, { BaseTooltipProps } from "components/BaseTooltip";
import { useScreenSize } from "hooks/useScreenSize";
import React, { useState } from "react";
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
                <div className="group-hover:scale-[2] transition-all bg-stake-green-500 w-2.5 h-2.5 flex items-center justify-center">
                    <ICClose className="hidden group-hover:block text-ash-dark-600 -rotate-45 w-1 h-1" />
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
type Props = Omit<BaseTooltipProps, "arrow"> & {
    onArrowClick?: () => void;
    disabled?: boolean;
    activeOnHover?: boolean;
};
const OnboardTooltip = ({
    onArrowClick,
    arrowStyle,
    disabled,
    activeOnHover,
    ...props
}: Props) => {
    const [hovered, setHovered] = useState(false);
    if (disabled) {
        return <>{props.children}</>;
    }
    return (
        <BaseTooltip
            {...props}
            open={activeOnHover ? hovered && props.open : props.open}
            arrow={(pos, staticSide) => (
                <>
                    <Arrow
                        direction={staticSide}
                        onClick={() => onArrowClick?.()}
                    />
                </>
            )}
            arrowStyle={(pos, staticSide) => ({
                ...(arrowStyle?.(pos, staticSide) || {}),
                [staticSide]: "-11px",
            })}
        >
            <span onMouseEnter={() => setHovered(true)}>{props.children}</span>
        </BaseTooltip>
    );
};

const Panel = ({
    children,
    size,
    className,
}: {
    children: JSX.Element;
    size?: Dimensions & ElementRects;
    className?: string;
}) => {
    const screenSize = useScreenSize();
    return (
        <div
            style={{
                filter: screenSize.isMobile
                    ? ""
                    : "drop-shadow(0px 4px 50px rgba(0, 0, 0, 0.5))",
                maxWidth: size?.width,
            }}
            className={className}
        >
            <div className="clip-corner-4 clip-corner-bl bg-ash-dark-600 p-[1px] max-w-full sm:max-w-[23rem] backdrop-blur-[30px]">
                <div className="clip-corner-4 clip-corner-bl bg-ash-dark-400 p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

OnboardTooltip.Panel = Panel;

export default OnboardTooltip;
