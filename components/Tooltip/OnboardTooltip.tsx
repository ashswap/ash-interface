import { Dimensions, ElementRects } from "@floating-ui/react";
import BaseTooltip, { BaseTooltipProps } from "components/BaseTooltip";
import { useScreenSize } from "hooks/useScreenSize";
import { useState } from "react";
import Arrow from "./Arrow";

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
