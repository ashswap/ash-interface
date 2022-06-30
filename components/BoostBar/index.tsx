import React, { useMemo } from "react";



const Polygon = ({
    height,
    className,
    children,
    borderWidth = 1,
    borderColor = "transparent"
}: {
    height: number;
    className?: string;
    children?: any;
    borderWidth?: number;
    borderColor?: string;
}) => {
    const clipPath = useMemo(() => {
        const leftDelta = Math.min(10, height);
        const bottomDeltaX = Math.tan((33 * Math.PI) / 180) * height;
        const topDeltaX = Math.tan((33 * Math.PI) / 180) * (height - leftDelta);
        return `polygon(${topDeltaX}px 0%, 100% 0%, calc(100% - ${bottomDeltaX}px) 100%, 0% 100%, 0% calc(100% - ${leftDelta}px))`;
    }, [height]);
    const clipPathStroke = useMemo(() => {
        const tan33 = Math.tan((33 * Math.PI) / 180);
        const cos33 = Math.cos((33 * Math.PI) / 180);
        const leftDelta = Math.min(10, height);
        const bottomDeltaX = tan33 * height;
        const topDeltaX = tan33 * (height - leftDelta);
        const points = [
            `${topDeltaX}px 0%`,
            `100% 0%`,
            `calc(100% - ${bottomDeltaX}px) 100%`,
            `0% 100%`,
            `0% calc(100% - ${leftDelta}px)`,

            `${borderWidth}px calc(100% - ${leftDelta}px)`,
            `${borderWidth}px calc(100% - ${borderWidth}px)`,

            `calc(100% - ${
                borderWidth / cos33 + tan33 * (height - borderWidth)
            }px) calc(100% - ${borderWidth}px)`,
            `calc(100% - ${
                borderWidth / cos33 + tan33 * borderWidth
            }px) ${borderWidth}px`,

            `${borderWidth / cos33 + tan33 * (height - borderWidth - leftDelta)}px ${borderWidth}px`,
            `${borderWidth}px calc(100% - ${leftDelta}px)`,
            `0% calc(100% - ${leftDelta}px)`,
        ];
        return `polygon(${points.join(", ")})`;
    }, [height, borderWidth]);
    return (
        <div
            style={{ height, clipPath, position: "relative" }}
            className={className}
        >
            <div
                className="absolute inset-0 bg-black"
                style={{ height, clipPath: clipPathStroke, backgroundColor: borderColor }}
            ></div>
            {children}
        </div>
    );
};
type props = {
    height?: number;
    min?: number;
    max?: number;
    value?: number;
    children?: any,
    disabled?: boolean
};
function BoostBar({ height = 32, min= 1, max=2.5, value=1, children, disabled }: props) {
    const minWidth = useMemo(() => {
        const tan33 = Math.tan((33 * Math.PI) / 180);
        const leftDelta = Math.min(10, height);
        const topDeltaX = tan33 * (height - leftDelta);
        return topDeltaX + 5;
    }, [height]);
    const validValue = useMemo(() => {
        return Math.max(Math.min(max, value), min);
    }, [min, max, value]);
    return (
        <div className="relative">
            <div>
                <Polygon
                    height={height}
                    className="bg-stake-gray-500/10"
                />
            </div>

            <div
                className="absolute inset-0"
                style={{
                    filter: !disabled ? "drop-shadow(0px 8px 25px rgba(255, 0, 92, 0.25))" : "",
                    minWidth,
                    width: `${validValue === min ? minWidth + "px" : 10 + ((validValue - min)*90/(max - min)) + "%"}`
                }}
            >
                <Polygon height={height} className={`${disabled ? "" : "bg-pink-600"}`} />
            </div>
            <div className="absolute inset-0">
                <Polygon
                    height={height}
                    className="bg-stake-gray-500/10"
                    borderColor={`${disabled ? "transparent" : "black"}`}
                >{children}</Polygon>
            </div>
        </div>
    );
}

export default BoostBar;
