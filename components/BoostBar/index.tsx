import BigNumber from "bignumber.js";
import CardTooltip from "components/Tooltip/CardTooltip";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { ACTIVE_FARMS } from "const/farms";
import { formatAmount } from "helper/number";
import { useOnboarding } from "hooks/useOnboarding";
import useRouteModal from "hooks/useRouteModal";
import Link from "next/link";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

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
    withOnboarding?: boolean;
};
const BoostBarContext = createContext<
    BoostBarProps & {
        validValue: number;
        validNewValue: number;
        deltaWidth?: string;
        valueWidth?: string;
        hovered?: boolean;
    }
>({ validValue: 0, validNewValue: 0 });
function BoostBar(props: BoostBarProps) {
    const [hovered, setHovered] = useState(false);
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
        withOnboarding,
    } = props;
    const tan33 = Math.tan((33 * Math.PI) / 180);
    const minWidth = useMemo(() => {
        const tan33 = Math.tan((33 * Math.PI) / 180);
        const leftDelta = Math.min(10, height);
        const topDeltaX = tan33 * (height - leftDelta);
        return topDeltaX + 5;
    }, [height]);
    const validValue = useMemo(() => {
        return +new BigNumber(Math.max(Math.min(max, value), min)).toFixed(
            2,
            BigNumber.ROUND_DOWN
        );
    }, [min, max, value]);
    const validNewValue = useMemo(() => {
        return +new BigNumber(
            newVal ? Math.max(Math.min(max, newVal), min) : 0
        ).toFixed(2, BigNumber.ROUND_DOWN);
    }, [min, max, newVal]);
    const valueWidth = useMemo(() => {
        if (max === min) return "100%";
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
    const [onboaringExpectedVe, setOnboardedExpectedVe] =
        useOnboarding("farm_expected_ve");
    return (
        <BoostBarContext.Provider
            value={{
                ...props,
                validValue,
                validNewValue,
                valueWidth,
                deltaWidth,
                hovered,
            }}
        >
            <div>
                {topLabel && <TopLabel />}
                <div className="relative" onMouseEnter={() => setHovered(true)}>
                    <div>
                        <Polygon
                            height={height}
                            className="bg-stake-gray-500/10"
                        />
                    </div>

                    {validNewValue > validValue && (
                        <OnboardTooltip
                            disabled={!withOnboarding}
                            open={onboaringExpectedVe && hovered}
                            onArrowClick={() => setOnboardedExpectedVe(true)}
                            delayOpen={3000}
                            offset={50}
                            zIndex={999}
                            placement="bottom-start"
                            content={
                                <OnboardTooltip.Panel className="max-w-[15rem]">
                                    <div className="px-5 my-3 text-xs font-bold">
                                        <span className="text-stake-green-500">
                                            All of veASH
                                        </span>{" "}
                                        will be consumed for{" "}
                                        <span className="text-stake-green-500">
                                            maximizing
                                        </span>{" "}
                                        your boost.
                                    </div>
                                </OnboardTooltip.Panel>
                            }
                        >
                            <div
                                className="absolute inset-0 transition-all"
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
                                    className={`${
                                        disabled ? "" : "bg-ash-pink-500"
                                    }`}
                                />
                            </div>
                        </OnboardTooltip>
                    )}
                    {!hiddenCurrentBar && (
                        <div
                            className="absolute inset-0 transition-all"
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
                            disabled ? "bg-[#757391]" : "bg-ash-pink-500"
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
                        {validNewValue > validValue ? (
                            <></>
                        ) : (
                            <>{formatAmount(currentVe)} ve</>
                        )}
                    </div>
                    <div className="text-ash-gray-600">
                        {formatAmount(maxVe)} ve
                    </div>
                </div>
                {validNewValue > validValue && !disabled && (
                    <div
                        className="absolute inset-0 text-ash-pink-500"
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
        currentVe,
        expectedVe,
        maxVe,
    } = useContext(BoostBarContext);
    const tan33 = Math.tan((33 * Math.PI) / 180);
    const { encode } = useRouteModal("calc_boost");
    return (
        <div
            className="relative mb-1"
            style={{
                marginLeft: `${tan33 * (height! - Math.min(10, height!))}px`,
            }}
        >
            <div className="flex justify-between text-stake-gray-500 underline font-bold text-xs">
                <CardTooltip
                    autoPlacement
                    content={
                        <div className="text-stake-gray-500 text-xs font-bold">
                            <div className="mb-4">C = Current Boost</div>
                            <div className="text-pink-600 text-lg mb-8">
                                x{validValue}
                            </div>
                            <div className="mb-4">
                                veASH used for Current Boost
                            </div>
                            <div className="text-pink-600 text-lg mb-8">
                                {formatAmount(currentVe)} ve
                            </div>
                            <div className="bg-ash-dark-600 p-2 text-2xs font-bold text-stake-gray-500 inline-block">
                                Current boost is showing your boost status of
                                this farm. This boost will not be changed unless
                                you use smart-contract (re-boost, stake more...)
                            </div>
                        </div>
                    }
                >
                    <div>C</div>
                </CardTooltip>
                <CardTooltip
                    autoPlacement
                    content={({ close }) => (
                        <div className="text-stake-gray-500 text-xs font-bold">
                            <div className="mb-4">Max = Max boost possible</div>
                            <div className="text-white text-lg mb-8">
                                x{max}
                            </div>
                            <div className="mb-4">
                                veASH needed for max boost
                            </div>
                            <div className="text-white text-lg mb-8">
                                {formatAmount(maxVe)} ve
                            </div>
                            <div className="bg-ash-dark-600 p-2 text-2xs font-bold text-stake-gray-500 inline-block">
                                Max boost possible shows the maximum boost that
                                you can reach. It&apos;s not always been 2.5
                                times. Go to&nbsp;
                                <Link
                                    href={{
                                        pathname: "/stake/gov/boost",
                                        query: {
                                            p: encode({
                                                farmAddress:
                                                    ACTIVE_FARMS[0]
                                                        .farm_address,
                                            }),
                                        },
                                    }}
                                >
                                    <a onClick={close}>
                                        <span className="text-stake-green-500">
                                            calculator
                                        </span>
                                    </a>
                                </Link>{" "}
                                or{" "}
                                <span className="text-stake-green-500">
                                    Boost Guide
                                </span>{" "}
                                to learn more.
                            </div>
                        </div>
                    )}
                >
                    <div>Max</div>
                </CardTooltip>
            </div>
            {validNewValue > validValue && !disabled && (
                <div
                    className="text-xs font-bold absolute inset-0 text-right"
                    style={{
                        right: `min(max(${
                            ((max - validNewValue) * 100) / (max - min)
                        }%, 3rem), 100% - 7rem)`,
                        left: "0.8rem",
                    }}
                >
                    <CardTooltip
                        autoPlacement
                        content={
                            <div className="text-stake-gray-500 text-xs font-bold">
                                <div className="mb-4">
                                    New boost after confirmed
                                </div>
                                <div className="text-ash-pink-500 text-lg mb-8">
                                    x{validNewValue}
                                </div>
                                <div className="mb-4">
                                    veASH used for new boost
                                </div>
                                <div className="text-ash-pink-500 text-lg mb-8">
                                    {formatAmount(expectedVe)} ve
                                </div>
                                <div className="bg-ash-dark-600 p-2 text-2xs font-bold text-stake-gray-500 inline-block">
                                    You will reach the new boost after veASH do
                                    its work.
                                </div>
                            </div>
                        }
                    >
                        <span>
                            <span className="underline text-stake-gray-500">
                                New boost:{" "}
                            </span>
                            <span className="underline text-ash-pink-500">
                                x{formatAmount(validNewValue)}
                            </span>
                        </span>
                    </CardTooltip>
                </div>
            )}
        </div>
    );
};
export default BoostBar;
