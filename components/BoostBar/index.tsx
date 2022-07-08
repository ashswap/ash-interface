import { formatAmount } from "helper/number";
import React, { createContext, useContext, useMemo } from "react";

const Polygon = ({
    height,
    className,
    children,
    borderWidth = 1,
    borderColor = "transparent",
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

            `${
                borderWidth / cos33 + tan33 * (height - borderWidth - leftDelta)
            }px ${borderWidth}px`,
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
                style={{
                    height,
                    clipPath: clipPathStroke,
                    backgroundColor: borderColor,
                }}
            ></div>
            {children}
        </div>
    );
};
export type BoostBarProps = {
    height?: number;
    min?: number;
    max?: number;
    value?: number;
    newVal?: number;
    children?: any;
    disabled?: boolean;
    veLine?: boolean;
    currentVe?: number;
    expectedVe?: number;
    maxVe?: number;
    topLabel?: boolean;
    hiddenCurrentBar?: boolean;
};
const BoostBarContext = createContext<
    BoostBarProps & {
        validValue: number;
        validNewValue: number;
        deltaWidth?: string;
        valueWidth?: string;
    }
>({ validValue: 0, validNewValue: 0 });
function BoostBar(props: BoostBarProps) {
    const {
        height = 32,
        min = 1,
        max = 2.5,
        value = 1,
        newVal,
        children,
        disabled,
        veLine,
        topLabel,
        hiddenCurrentBar,
    } = props;
    const tan33 = Math.tan((33 * Math.PI) / 180);
    const minWidth = useMemo(() => {
        const tan33 = Math.tan((33 * Math.PI) / 180);
        const leftDelta = Math.min(10, height);
        const topDeltaX = tan33 * (height - leftDelta);
        return topDeltaX + 5;
    }, [height]);
    const validValue = useMemo(() => {
        return Math.floor(Math.max(Math.min(max, value), min) * 100) / 100;
    }, [min, max, value]);
    const validNewValue = useMemo(() => {
        return (
            Math.floor(
                (newVal ? Math.max(Math.min(max, newVal), min) : 0) * 100
            ) / 100
        );
    }, [min, max, newVal]);
    const valueWidth = useMemo(() => {
        return validValue === min
            ? minWidth + "px"
            : 10 + ((validValue - min) * 90) / (max - min) + "%";
    }, [minWidth, min, max, validValue]);
    const newValueWidth = useMemo(() => {
        return validNewValue === min
            ? minWidth + "px"
            : 10 + ((validNewValue - min) * 90) / (max - min) + "%";
    }, [validNewValue, min, minWidth, max]);
    const deltaWidth = useMemo(() => {
        return `calc(${newValueWidth} - ${valueWidth} + ${tan33 * height}px)`;
    }, [newValueWidth, valueWidth, height, tan33]);
    return (
        <BoostBarContext.Provider
            value={{
                ...props,
                validValue,
                validNewValue,
                valueWidth,
                deltaWidth,
            }}
        >
            <div>
                {topLabel && <TopLabel />}
                <div className="relative">
                    <div>
                        <Polygon
                            height={height}
                            className="bg-stake-gray-500/10"
                        />
                    </div>

                    {validNewValue > validValue && (
                        <div
                            className="absolute inset-0"
                            style={{
                                filter: "drop-shadow(0px 4px 10px #FF00E5)",
                                minWidth,
                                width: deltaWidth,
                                marginLeft: `calc(${valueWidth} - ${
                                    tan33 * height
                                }px)`,
                            }}
                        >
                            <Polygon
                                height={height}
                                className={`${disabled ? "" : "bg-[#FF00E5]"}`}
                            />
                        </div>
                    )}
                    {!hiddenCurrentBar && (
                        <div
                            className="absolute inset-0"
                            style={{
                                filter:
                                    disabled || typeof newVal !== "undefined"
                                        ? ""
                                        : "drop-shadow(0px 8px 25px rgba(255, 0, 92, 0.25))",
                                minWidth,
                                width: valueWidth,
                            }}
                        >
                            <Polygon
                                height={height}
                                className={`${
                                    disabled ? "bg-[#757391]" : "bg-pink-600"
                                }`}
                            />
                        </div>
                    )}

                    <div className="absolute inset-0">
                        <Polygon
                            height={height}
                            className="bg-stake-gray-500/10"
                            borderColor={`${
                                disabled ? "transparent" : "black"
                            }`}
                        >
                            {children}
                        </Polygon>
                    </div>
                </div>
                {veLine && <VeLine />}
            </div>
        </BoostBarContext.Provider>
    );
}

const VeLine = () => {
    const {
        height = 32,
        deltaWidth,
        valueWidth,
        disabled,
        currentVe,
        expectedVe,
        maxVe,
        validNewValue,
        validValue,
    } = useContext(BoostBarContext);
    const tan33 = Math.tan((33 * Math.PI) / 180);
    const bottomDeltaX = tan33 * height;
    return (
        <>
            <div className="relative">
                <div
                    className="bg-stake-gray-500/10 border border-ash-dark-400 h-1 mt-0.5 flex"
                    style={{ marginRight: `${bottomDeltaX}px` }}
                ></div>
                <div
                    className={`absolute inset-0 border border-ash-dark-400 ${
                        disabled ? "bg-[#757391]" : "bg-pink-600"
                    }`}
                    style={{ width: `calc(${valueWidth} - ${bottomDeltaX}px)` }}
                ></div>
                {!disabled && (
                    <div
                        className={`absolute inset-0 border border-ash-dark-400 ${
                            disabled ? "bg-[#757391]" : "bg-[#FF00E5]"
                        }`}
                        style={{
                            width: `calc(${deltaWidth} - ${bottomDeltaX}px)`,
                            marginLeft: `calc(${valueWidth} - ${bottomDeltaX}px)`,
                        }}
                    ></div>
                )}
            </div>
            <div className="relative text-xs font-bold mt-0.5">
                <div
                    className="flex justify-between"
                    style={{ marginRight: `${bottomDeltaX}px` }}
                >
                    <div
                        className={`${
                            disabled ? "text-ash-gray-600" : "text-pink-600"
                        }`}
                    >
                        {formatAmount(currentVe)} ve
                    </div>
                    <div className="text-ash-gray-600">
                        {formatAmount(maxVe)} ve
                    </div>
                </div>
                {validNewValue > validValue && !disabled && (
                    <div
                        className="absolute inset-0 text-[#FF00E5]"
                        style={{
                            marginLeft: `min(max(${valueWidth} - ${bottomDeltaX}px, 4rem), 100% - ${bottomDeltaX}px - 8rem)`,
                        }}
                    >
                        {formatAmount(expectedVe)} ve
                    </div>
                )}
            </div>
        </>
    );
};

const TopLabel = () => {
    const {
        validNewValue,
        validValue,
        disabled,
        max = 2.5,
        min = 1,
        height,
    } = useContext(BoostBarContext);
    const tan33 = Math.tan((33 * Math.PI) / 180);
    return (
        <div
            className="relative mb-1"
            style={{
                marginLeft: `${tan33 * (height! - Math.min(10, height!))}px`,
            }}
        >
            <div className="flex justify-between text-stake-gray-500 underline font-bold text-xs">
                <div>C</div>
                <div>Max</div>
            </div>
            {validNewValue > validValue && !disabled && (
                <div
                    className="text-xs font-bold absolute inset-0 text-right"
                    style={{
                        paddingRight: `min(max(${
                            ((max - validNewValue) * 100) / (max - min)
                        }%, 3rem), 100% - 7rem)`,
                    }}
                >
                    <span className="underline text-stake-gray-500">
                        New boost:{" "}
                    </span>
                    <span className="underline text-[#FF00E5]">
                        x{formatAmount(validNewValue)}
                    </span>
                </div>
            )}
        </div>
    );
};
export default BoostBar;
