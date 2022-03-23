import React, { useMemo, useState } from "react";
import ImgMetalCardBg from "assets/images/metal-card-bg.png";
import { FarmsState, useFarms } from "context/farms";
import { Unarray } from "interface/utilities";
import useFarmDataFormat from "hooks/useFarmDataFormat";
import Image from "next/image";
import { ASH_TOKEN } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { fractionFormat } from "helper/number";
import StakeLPModal from "components/StakeLPModal";
import ICMinus from "assets/svg/minus.svg";
import ICPlus from "assets/svg/plus.svg";
import UnstakeLPModal from "components/UnstakeLPModal";
import { ViewType } from "./FarmFilter";

type props = {
    farmData: Unarray<FarmsState["farmRecords"]>;
    viewType: ViewType;
};
function FarmCard({ farmData, viewType }: props) {
    const { pool, poolStats, liquidityData, stakedData, farm } = farmData;
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [openStakeLP, setOpenStakeLP] = useState<boolean>(false);
    const [openUnstakeLP, setOpenUnstakeLP] = useState<boolean>(false);
    const {claimReward} = useFarms();
    const {
        formatedStats: { TVL, emissionAPR, tradingAPR, volumn24h },
        formatedStakedData: {
            fCapacityPercent,
            fLpValueUsd,
            fOwnLiquidity,
            fValue0,
            fValue1,
        },
    } = useFarmDataFormat(farmData);
    const [token0, token1] = farmData.pool.tokens;
    const displayStakedLP = useMemo(() => {
        if (!stakedData?.totalStakedLP || stakedData?.totalStakedLP.eq(0))
            return "0.00";
        const bal = toEGLDD(farm.farm_token_decimal, stakedData.totalStakedLP);
        if (bal.lt(0.01)) return "< 0.01";
        return fractionFormat(bal.toNumber());
    }, [farm, stakedData]);
    const fTotalRewardAmt = useMemo(() => {
        if (!stakedData || !stakedData?.totalRewardAmt) return "0.00";
        const num = toEGLDD(ASH_TOKEN.decimals, stakedData.totalRewardAmt);
        return fractionFormat(num.toNumber(), {
            maximumFractionDigits: num.lt(0.01) ? 6 : 2,
        });
    }, [stakedData]);

    return (
        <>
            {viewType === ViewType.Card && (
                <div
                    className="clip-corner-tr-[0.875rem] clip-corner-bevel relative mx-auto p-[1px] w-full"
                    style={{
                        backgroundImage:
                            "linear-gradient(to bottom, #5E6480 9.65%, #171A26 91.8%)",
                    }}
                >
                    <div
                        className="absolute clip-corner-tr-[0.875rem] clip-corner-bevel inset-[1px] z-[-1]"
                        style={{
                            backgroundImage:
                                "linear-gradient(180deg, #31314E 0%, #1F2131 100%)",
                        }}
                    ></div>
                    <div
                        className="absolute inset-[1px] bg-no-repeat z-[-1]"
                        style={{
                            backgroundImage: `url(${ImgMetalCardBg.src})`,
                            backgroundSize: "54px",
                            backgroundPosition: "calc(100% - 40px) 70px",
                        }}
                    ></div>
                    <div className="text-white border border-transparent">
                        <div className="px-10 pt-8 pb-18">
                            <div className="flex items-start justify-between mt-0.5 -mr-3 mb-11">
                                <div className="overflow-hidden">
                                    <div className="text-ash-gray-500 text-xs mb-2.5">
                                        Stake LP
                                    </div>
                                    <div className="font-bold text-2xl text-white truncate">
                                        {token0.name}
                                        <span className="text-sm"> & </span>
                                        {token1.name}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-[3.25rem] h-[3.25rem] relative">
                                        <Image
                                            src={token0.icon}
                                            alt={`${token0.name} icon`}
                                            layout="responsive"
                                        />
                                    </div>
                                    <div className="w-[3.25rem] h-[3.25rem] relative -ml-2">
                                        <Image
                                            src={token1.icon}
                                            alt={`${token1.name} icon`}
                                            layout="responsive"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-12">
                                <div className="text-ash-gray-500 text-xs font-bold underline mb-4">
                                    Emission APR
                                </div>
                                <div className="text-lg font-bold text-ash-cyan-500">
                                    {emissionAPR}%
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-9">
                                <div>
                                    <div className="text-xs text-ash-gray-500 font-bold underline mb-2">
                                        {ASH_TOKEN.name} Earned
                                    </div>
                                    <div
                                        className={`text-lg font-bold ${
                                            stakedData?.totalRewardAmt.gt(0)
                                                ? "text-white"
                                                : "text-ash-gray-500"
                                        }`}
                                    >
                                        {fTotalRewardAmt}
                                    </div>
                                </div>
                                <button
                                    className={`clip-corner-1 clip-corner-br w-[7.25rem] h-14 text-center flex items-center justify-center text-sm font-bold ${
                                        stakedData?.totalRewardAmt.gt(0)
                                            ? "bg-ash-cyan-500 text-ash-dark-400"
                                            : "bg-ash-dark-400 opacity-30"
                                    }`}
                                    onClick={() => claimReward(farm)}
                                >
                                    Harvest
                                </button>
                            </div>
                            <div className="flex items-center justify-between mb-11">
                                <div>
                                    <div className="text-xs text-ash-gray-500 font-bold underline mb-2">
                                        LP-Staked
                                    </div>
                                    <div
                                        className={`text-lg font-bold ${
                                            displayStakedLP === "0.00"
                                                ? "text-ash-gray-500"
                                                : "text-white"
                                        }`}
                                    >
                                        {displayStakedLP}
                                    </div>
                                </div>
                                <div>
                                    {stakedData ? (
                                        <div className="flex space-x-2 h-14 items-center">
                                            <button
                                                className="w-[3.375rem] h-[3.375rem] clip-corner-1 clip-corner-br bg-ash-dark-400 flex items-center justify-center"
                                                onClick={() =>
                                                    setOpenUnstakeLP(true)
                                                }
                                            >
                                                <ICMinus className="w-3 h-auto text-yellow-600" />
                                            </button>
                                            <button
                                                className="w-[3.375rem] h-[3.375rem] clip-corner-1 clip-corner-bl bg-ash-dark-400 flex items-center justify-center"
                                                onClick={() =>
                                                    setOpenStakeLP(true)
                                                }
                                            >
                                                <ICPlus className="w-3 h-auto text-ash-cyan-500" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className={`clip-corner-1 clip-corner-br w-[7.25rem] h-14 text-center flex items-center justify-center text-sm font-bold bg-ash-cyan-500 text-ash-dark-400 underline`}
                                            onClick={() => setOpenStakeLP(true)}
                                        >
                                            Stake LP
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="bg-stake-dark-500 flex items-center justify-between h-12 px-4">
                                <div className="text-ash-gray-500 text-2xs mr-2">
                                    Total Liquidity
                                </div>
                                <div className="text-ash-gray-500 text-sm">
                                    ${TVL}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {viewType === ViewType.List && (
                <div className="px-4 lg:px-10 py-2 md:py-7.5 flex items-center space-x-2 lg:space-x-7.5">
                    <div className="flex-grow flex items-center space-x-2">
                        <div className="flex space-x-2 md:space-x-6 flex-grow overflow-hidden">
                            <div className="flex">
                                <div className="w-4 h-4 md:w-6 md:h-6 lg:w-9 lg:h-9">
                                    <Image
                                        src={token0.icon}
                                        alt={`${token0.name} icon`}
                                        layout="responsive"
                                    />
                                </div>
                                <div className="w-4 h-4 -ml-1 md:w-6 md:h-6 lg:w-9 lg:h-9 md:-ml-3 lg:-ml-4.5 md:mt-3 lg:mt-4.5">
                                    <Image
                                        src={token1.icon}
                                        alt={`${token1.name} icon`}
                                        layout="responsive"
                                    />
                                </div>
                            </div>
                            <div className="flex md:flex-col text-xs lg:text-lg font-bold md:space-y-2 leading-tight">
                                <div>{token0.name}</div>
                                <div className="md:hidden"> & </div>
                                <div>{token1.name}</div>
                            </div>
                        </div>
                        {/* emission APR */}
                        <div className="flex-shrink-0 w-[18%] text-ash-cyan-500 text-xs lg:text-lg font-bold">
                            {emissionAPR}%
                        </div>
                        {/* ash Earned */}
                        <div className="flex-shrink-0 w-1/5 lg:w-[18%] bg-stake-dark-500 h-8 sm:h-10 lg:h-12 px-3.5 hidden md:flex items-center justify-end text-right text-white text-xs lg:text-lg font-bold">
                            {fTotalRewardAmt}
                        </div>
                        {/* LP staked */}
                        <div className="flex-shrink-0 w-1/5 lg:w-[18%] bg-stake-dark-500 h-8 sm:h-10 lg:h-12 px-3.5 hidden md:flex items-center justify-end text-right text-white text-xs lg:text-lg font-bold">
                            {displayStakedLP}
                        </div>
                        {/* Total liquidity */}
                        <div className="flex-shrink-0 w-1/3 md:w-1/5 lg:w-[18%] bg-stake-dark-500 h-8 sm:h-10 lg:h-12 px-3.5 flex items-center justify-end text-right text-white text-xs font-bold">
                            ${TVL}
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center space-x-2">
                        <button
                            className={`clip-corner-1 clip-corner-br h-10 lg:h-12 w-[5.5rem] lg:w-[6.5rem] flex items-center justify-center text-center font-bold underline text-ash-cyan-500 bg-ash-dark-400 text-xs`}
                        >
                            Harvest
                        </button>
                        {stakedData ? (
                            <div className="flex space-x-2 py-0.5">
                                <button
                                    className="w-10 lg:w-12 h-10 lg:h-12 clip-corner-1 clip-corner-br bg-ash-dark-400 flex items-center justify-center"
                                    onClick={() => setOpenUnstakeLP(true)}
                                >
                                    <ICMinus className="w-3 h-auto text-yellow-600" />
                                </button>
                                <button
                                    className="w-10 lg:w-12 h-10 lg:h-12 clip-corner-1 clip-corner-bl bg-ash-dark-400 flex items-center justify-center"
                                    onClick={() => setOpenStakeLP(true)}
                                >
                                    <ICPlus className="w-3 h-auto text-ash-cyan-500" />
                                </button>
                            </div>
                        ) : (
                            <button
                                className={`clip-corner-1 clip-corner-br h-10 lg:h-12 w-[5.5rem] lg:w-[6.5rem] flex items-center justify-center text-center font-bold underline bg-ash-cyan-500 text-ash-dark-400 text-xs`}
                            >
                                Stake LP
                            </button>
                        )}
                    </div>
                </div>
            )}
            <StakeLPModal
                open={openStakeLP}
                onClose={() => setOpenStakeLP(false)}
                farmData={farmData}
            />

            <UnstakeLPModal
                open={openUnstakeLP}
                onClose={() => setOpenUnstakeLP(false)}
                farmData={farmData}
            />
        </>
    );
}

export default FarmCard;
