import { AccountInfoSliceNetworkType } from "@elrondnetwork/dapp-core/types";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import ICMinus from "assets/svg/minus.svg";
import ICPlus from "assets/svg/plus.svg";
import { networkConfigState } from "atoms/dappState";
import { PoolsState } from "atoms/poolsState";
import AddLiquidityModal from "components/AddLiquidityModal";
import Avatar from "components/Avatar";
import RemoveLiquidityModal from "components/RemoveLiquidityModal";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { toEGLDD } from "helper/balance";
import { formatAmount } from "helper/number";
import { Unarray } from "interface/utilities";
import { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";

function StakedPoolCardItem({
    poolData,
}: {
    poolData: Unarray<PoolsState["poolToDisplay"]>;
}) {
    const { pool, poolStats, liquidityData } = poolData;
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
    const [openRemoveLiquidity, setOpenRemoveLiquidity] =
        useState<boolean>(false);
    const network: AccountInfoSliceNetworkType =
        useRecoilValue(networkConfigState).network;
    const is2Pool = useMemo(
        () => pool.tokens.length === 2,
        [pool.tokens.length]
    );

    if (!liquidityData) return null;
    const { tvl, apr: tradingAPR, volume_usd: volume24h } = poolStats || {};
    const { capacityPercent, lpValueUsd, ownLiquidity, lpReserves } =
        liquidityData;
    return (
        <div
            className={`bg-ash-dark-700 clip-corner-4 clip-corner-tr pt-8 pb-5 px-6 sm:px-11 text-white`}
        >
            <div className="flex justify-between pb-9 border-b border-dashed border-ash-gray-500">
                <div className="mr-5">
                    <div
                        className={`mt-5 flex flex-col justify-between ${
                            is2Pool ? "" : "mb-3"
                        }`}
                    >
                        {pool.tokens.map((t, i) => {
                            return (
                                <div
                                    key={t.identifier}
                                    className={is2Pool ? "mb-8" : "mb-2"}
                                >
                                    <div
                                        className={`font-bold text-white ${
                                            is2Pool ? "text-2xl" : "text-lg"
                                        }`}
                                    >
                                        {t.symbol}
                                    </div>
                                    <div
                                        className={`text-earn font-bold leading-tight ${
                                            is2Pool ? "text-lg" : "text-base"
                                        }`}
                                    >
                                        <TextAmt
                                            number={toEGLDD(
                                                t.decimals,
                                                lpReserves[i] || 0
                                            )}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex">
                        <button
                            className="clip-corner-1 clip-corner-br bg-ash-dark-400 hover:bg-ash-dark-300 active:bg-ash-dark-600 transition-all w-14 h-14 flex items-center justify-center text-yellow-600 mr-0.5"
                            onClick={() => setOpenRemoveLiquidity(true)}
                        >
                            <ICMinus />
                        </button>
                        <button
                            className="clip-corner-1 clip-corner-bl bg-ash-dark-400 hover:bg-ash-dark-300 active:bg-ash-dark-600 transition-all w-14 h-14 flex items-center justify-center text-pink-600"
                            onClick={() => setOpenAddLiquidity(true)}
                        >
                            <ICPlus />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col justify-end relative">
                    <div
                        className={`absolute top-0 right-0 sm:-right-4 flex flex-wrap justify-center ${
                            is2Pool ? "-mx-2.5" : "max-w-[4.5rem]"
                        }`}
                    >
                        {pool.tokens.map((t, i) => {
                            return (
                                <Avatar
                                    key={t.identifier}
                                    src={t.logoURI}
                                    alt={t.symbol}
                                    className={`${
                                        is2Pool
                                            ? "w-[3.25rem] h-[3.25rem]"
                                            : "w-9 h-9"
                                    } ${
                                        i === 1
                                            ? is2Pool
                                                ? "-ml-2.5"
                                                : "-ml-1.5"
                                            : ""
                                    } ${i === 2 ? "-mt-2.5" : ""} ${
                                        i > 2 && "hidden"
                                    }`}
                                />
                            );
                        })}
                    </div>
                    <div className="min-w-[8rem]">
                        <div className="mb-8">
                            <div className="text-stake-gray-500 text-xs underline mb-4 inline-block">
                                <CardTooltip
                                    content={<>Your deposit value in USD</>}
                                >
                                    <span>Estimate in USD</span>
                                </CardTooltip>
                            </div>

                            <div className="text-lg leading-tight">
                                <span className="text-stake-gray-500">$</span>
                                <span className="text-white font-bold">
                                    <TextAmt
                                        number={lpValueUsd || 0}
                                        decimalClassName="text-stake-gray-500"
                                    />
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="text-stake-gray-500 text-xs underline mb-4 block">
                                <CardTooltip
                                    content={
                                        <>
                                            Percentage of your deposit to the
                                            total liquidity in this pool. It
                                            depends on the reward that
                                            you&apos;ll receive.
                                        </>
                                    }
                                >
                                    <span>Your capacity</span>
                                </CardTooltip>
                            </div>

                            <div className="text-lg text-white font-bold leading-snug">
                                {formatAmount(
                                    capacityPercent?.toNumber() || 0,
                                    {
                                        notation: "standard",
                                    }
                                )}
                                %
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row mt-6 mb-5.5 justify-between items-center">
                <div className="mr-1">
                    <CardTooltip
                        content={
                            <>
                                Estimation for growth of your deposit over a
                                year, based on trading activity in the past 24
                                hours.
                            </>
                        }
                    >
                        <div className="text-stake-gray-500 text-xs mb-4 underline">
                            Trading APR
                        </div>
                    </CardTooltip>

                    <div className="text-yellow-600 font-bold text-lg">
                        {formatAmount(tradingAPR || 0, {
                            notation: "standard",
                        })}
                        %
                    </div>
                </div>
            </div>

            {isExpand && (
                <>
                    <div className="bg-bg my-4 text-text-input-3">
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">
                                Total Liquidity
                            </div>
                            <div className="text-sm">
                                $
                                <TextAmt
                                    number={tvl || 0}
                                    options={{ notation: "standard" }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">24H Volume</div>
                            <div className="text-sm">
                                $
                                <TextAmt
                                    number={volume24h || 0}
                                    options={{ notation: "standard" }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">LP Token</div>
                            <div className="text-sm">
                                <TextAmt
                                    number={toEGLDD(
                                        pool.lpToken.decimals,
                                        ownLiquidity || 0
                                    )}
                                />{" "}
                                {pool.tokens[0].symbol}-{pool.tokens[1].symbol}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <CardTooltip
                                content={
                                    <>
                                        Estimation for growth of your deposit
                                        over a year, based on trading activity
                                        in the past 24 hours.
                                    </>
                                }
                            >
                                <div className="underline text-2xs">
                                    Trading APR
                                </div>
                            </CardTooltip>

                            <div className="text-sm">
                                {formatAmount(tradingAPR || 0, {
                                    notation: "standard",
                                })}
                                %
                            </div>
                        </div>
                    </div>
                    <div className="text-center mb-8">
                        <a
                            href={`${network.explorerAddress}/tokens/${pool.lpToken.identifier}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-earn underline text-2xs font-bold hover:text-earn hover:underline"
                        >
                            View LP Distribution
                        </a>
                    </div>
                </>
            )}

            <div
                className="flex flex-row justify-center items-center select-none cursor-pointer py-2 text-white"
                onClick={() => setIsExpand(!isExpand)}
            >
                <div className="font-bold text-sm mr-2">
                    {isExpand ? "Hide" : "Detail"}
                </div>
                {isExpand ? (
                    <ICChevronUp className="w-2 h-auto" />
                ) : (
                    <ICChevronDown className="w-2 h-auto" />
                )}
            </div>

            <AddLiquidityModal
                open={openAddLiquidity}
                onClose={() => setOpenAddLiquidity(false)}
                poolData={poolData}
            />
            <RemoveLiquidityModal
                open={openRemoveLiquidity}
                onClose={() => setOpenRemoveLiquidity(false)}
                poolData={poolData}
            />
        </div>
    );
}

export default StakedPoolCardItem;
