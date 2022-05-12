import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import ICMinus from "assets/svg/minus.svg";
import ICPlus from "assets/svg/plus.svg";
import AddLiquidityModal from "components/AddLiquidityModal";
import BaseModal from "components/BaseModal";
import RemoveLiquidityModal from "components/RemoveLiquidityModal";
import TextAmt from "components/TextAmt";
import { PoolsState } from "context/pools";
import usePoolDataFormat from "hooks/usePoolDataFormat";
import { useScreenSize } from "hooks/useScreenSize";
import { Unarray } from "interface/utilities";
import Image from "next/image";
import { useEffect, useState } from "react";

const StakedPoolListItem = ({
    poolData,
}: {
    poolData: Unarray<PoolsState["poolToDisplay"]>;
}) => {
    const [openAddLiquidity, setOpenAddLiquidity] = useState(false);
    const [openRemoveLiquidity, setOpenRemoveLiquidity] = useState(false);
    const [isExpand, setIsExpand] = useState(false);
    const [mIsExpand, setMIsExpand] = useState(false);
    const { isMobile } = useScreenSize();
    const { pool, poolStats, liquidityData } = poolData;
    const {
        formatedStats: { TVL, emissionAPR, tradingAPR, volume24h },
        formatedStakedData: {
            fCapacityPercent,
            fLpValueUsd,
            fOwnLiquidity,
            fValue0,
            fValue1,
        },
    } = usePoolDataFormat(poolData);
    useEffect(() => {
        if (isMobile) {
            setIsExpand(false);
        }
    }, [isMobile]);
    if (!liquidityData) return null;

    return (
        <>
            <div
                className={`flex flex-col py-6`}
                onClick={() => isMobile && setMIsExpand(true)}
            >
                <div className="flex flex-row text-white w-full">
                    <div className="w-8/12 px-4 sm:px-11 flex items-center">
                        <div className="flex-grow flex items-center space-x-4">
                            <div className="w-7/12 sm:w-1/2 overflow-hidden">
                                <div className="flex items-center">
                                    <div className="flex items-center mr-2 sm:mr-0">
                                        <div className="h-4 w-4 sm:h-6 sm:w-6 lg:h-9 lg:w-9 rounded-full">
                                            <Image
                                                src={pool.tokens[0].icon}
                                                alt="token icon"
                                            />
                                        </div>
                                        <div className="h-4 w-4 sm:h-6 sm:w-6 lg:h-9 lg:w-9 rounded-full -ml-1 lg:ml-[-0.375rem]">
                                            <Image
                                                src={pool.tokens[1].icon}
                                                alt="token icon"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-2xs hidden sm:block px-3 font-bold">
                                        &
                                    </div>
                                    <div className="sm:flex sm:flex-col font-bold text-xs lg:text-lg truncate">
                                        <span className="sm:flex flex-row items-center">
                                            <span className="w-20">
                                                {pool.tokens[0].name}
                                            </span>
                                            <span className="hidden sm:inline text-earn text-xs">
                                                {fValue0}
                                            </span>
                                            {/* {isExpand && (
                                                <span className="inline-block text-ash-green-500 font-bold text-2xs ml-1">
                                                    <ICArrowTopRight className="inline mr-1" />
                                                    <span>+0.00005</span>
                                                </span>
                                            )} */}
                                        </span>
                                        {/* <span>&nbsp;&&nbsp;</span> */}
                                        <span className="sm:flex flex-row items-center">
                                            <span className="w-20">
                                                {pool.tokens[1].name}
                                            </span>
                                            <span className="hidden sm:inline text-earn text-xs">
                                                {fValue1}
                                            </span>
                                            {/* {isExpand && (
                                                <span className="inline-block text-ash-purple-500 font-bold text-2xs ml-1">
                                                    <ICArrowBottomRight className="inline mr-1" />
                                                    <span>-0.00005</span>
                                                </span>
                                            )} */}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-5/12 sm:w-1/4 text-right sm:text-left text-xs sm:text-sm font-bold">
                                {/* {capacityPercent.toFixed(3)}% */}
                                <span className="inline-block mr-1">
                                    <span className="text-ash-gray-500">$</span>
                                    <span>
                                        <TextAmt
                                            number={liquidityData.lpValueUsd}
                                        />
                                    </span>
                                </span>
                                {/* {isExpand && (
                                    <span className="inline-block text-ash-green-500 font-bold text-2xs">
                                        <ICArrowTopRight className="w-2 h-2 inline mr-1" />
                                        +0.00005
                                    </span>
                                )} */}
                            </div>
                            <div className="hidden sm:flex w-1/4 flex-wrap items-center font-bold">
                                {/* <div className="w-2/12 flex flex-col justify-center">
                                <span
                                    className="text-yellow-600 underline select-none font-bold text-xs cursor-pointer"
                                    onClick={() => setOpenRemoveLiquidity(true)}
                                >
                                    Withdraw
                                </span>
                            </div> */}
                                <span className="inline-block mr-1 text-sm">
                                    {fCapacityPercent}%
                                </span>
                                {/* {isExpand && (
                                    <span className="inline-block text-ash-green-500 font-bold text-2xs">
                                        <ICArrowTopRight className="w-2 h-2 inline mr-1" />
                                        +0.00005
                                    </span>
                                )} */}
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center">
                            <button
                                className="w-14 h-14 bg-ash-dark-400 clip-corner-1 clip-corner-bl text-pink-600 mr-[0.125rem] flex justify-center items-center"
                                onClick={() => setOpenAddLiquidity(true)}
                            >
                                <ICPlus />
                            </button>
                            <button
                                className="w-14 h-14 bg-ash-dark-400 clip-corner-1 clip-corner-br text-yellow-600 mr-[0.125rem] flex justify-center items-center"
                                onClick={() => setOpenRemoveLiquidity(true)}
                            >
                                <ICMinus />
                            </button>
                        </div>
                    </div>
                    <div className="hidden w-4/12 pl-11 pr-1 border-l border-l-ash-gray-500 sm:flex items-center space-x-4">
                        <div className="text-earn flex-grow flex items-center">
                            {/* <span>ELDG&nbsp;</span>
                            <span className="text-lg font-bold">0.52</span> */}
                            Comming soon
                        </div>
                        <button className="h-12 w-28 bg-earn clip-corner-1 clip-corner-br text-xs flex items-center justify-center text-center">
                            Harvest
                        </button>
                        <div className="w-24">
                            {!isExpand && (
                                <button
                                    className="w-full h-12 flex items-center justify-center space-x-1 px-2"
                                    onClick={() => setIsExpand(true)}
                                >
                                    <span>Detail</span>
                                    <ICChevronDown />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="block sm:hidden w-4/12 text-right pr-4 text-earn">
                        {/* <span className="text-2xs">ELDG&nbsp;</span>
                        <span className="text-xs font-bold">0.52</span> */}
                    </div>
                </div>
                {isExpand && (
                    <div className="mt-10 pl-4 pr-1 sm:pl-11 flex items-end space-x-4">
                        <div className="flex-grow flex space-x-4">
                            <div className="text-earn underline w-32 text-2xs">
                                View LP Distribution
                            </div>
                            <div className="flex-grow grid grid-cols-3 text-ash-gray-500 gap-1">
                                <div className="bg-ash-dark-400 h-12 px-4 flex justify-between items-center">
                                    <div className="text-2xs">
                                        Total Liquidity
                                    </div>
                                    <div className="text-sm">${TVL}</div>
                                </div>
                                <div className="bg-ash-dark-400 h-12 px-4 flex justify-between items-center">
                                    <div className="text-2xs">24H Volume</div>
                                    <div className="text-sm">${volume24h}</div>
                                </div>
                                <div className="bg-ash-dark-400 h-12 px-4 flex justify-between items-center">
                                    <div className="text-2xs">LP Tokens</div>
                                    <div className="text-sm">
                                        {fOwnLiquidity}
                                    </div>
                                </div>
                                <div className="bg-ash-dark-400 h-12 px-4 flex justify-between items-center">
                                    <div className="text-2xs">Trading APR</div>
                                    <div className="text-sm">{tradingAPR}%</div>
                                </div>
                                <div className="bg-ash-dark-400 h-12 px-4 flex justify-between items-center">
                                    <div className="text-2xs">
                                        Emissions APR
                                    </div>
                                    <div className="text-sm">
                                        {emissionAPR}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="w-24 h-12 flex items-center justify-center space-x-1 px-2 text-white"
                            onClick={() => setIsExpand(false)}
                        >
                            <span>Hide</span>
                            <ICChevronUp />
                        </button>
                    </div>
                )}

                {/* <div className="flex flex-row text-white w-full">
                <div className="w-2/12 flex flex-col justify-center">
                    <span
                        className="text-pink-600 underline select-none font-bold text-xs cursor-pointer"
                        onClick={() => setOpenAddLiquidity(true)}
                    >
                        Deposit more
                    </span>
                </div>
            </div> */}
            </div>
            <BaseModal
                isOpen={mIsExpand}
                onRequestClose={() => setMIsExpand(false)}
                type="drawer_btt"
                className="bg-ash-dark-600 clip-corner-4 clip-corner-tr p-4 text-white max-h-full flex flex-col"
            >
                <div className="flex justify-end mb-16">
                    <BaseModal.CloseBtn />
                </div>
                <div className="flex-grow overflow-auto">
                    <div className="px-6 pb-7">
                        <div className="grid grid-cols-2 gap-1 items-end mb-8">
                            <div>
                                <div className="font-bold mb-8">
                                    <div className="text-2xl">
                                        {pool.tokens[0].name}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="text-earn text-lg mr-3">
                                            {fValue0}
                                        </div>
                                        {/* <div className="text-2xs text-ash-green-500">
                                            <ICArrowTopRight className="inline mr-1" />
                                            <span>+0.00005</span>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="font-bold mb-9">
                                    <div className="text-2xl">
                                        {pool.tokens[1].name}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="text-earn text-lg mr-3">
                                            {fValue1}
                                        </div>
                                        {/* <div className="text-2xs text-ash-purple-500">
                                            <ICArrowBottomRight className="inline mr-1" />
                                            <span>+0.00005</span>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        className="w-14 h-14 bg-ash-dark-400 clip-corner-1 clip-corner-bl text-pink-600 mr-[0.125rem] flex justify-center items-center"
                                        onClick={() => {
                                            setMIsExpand(false);
                                            setOpenAddLiquidity(true);
                                        }}
                                    >
                                        <ICPlus />
                                    </button>
                                    <button
                                        className="w-14 h-14 bg-ash-dark-400 clip-corner-1 clip-corner-br text-yellow-600 mr-[0.125rem] flex justify-center items-center"
                                        onClick={() => {
                                            setMIsExpand(false);
                                            setOpenRemoveLiquidity(true);
                                        }}
                                    >
                                        <ICMinus />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className="flex items-center justify-end mb-14">
                                        <div className="w-[3.25rem] h-[3.25rem] rounded-full">
                                            <Image
                                                src={pool.tokens[0].icon}
                                                alt="token icon"
                                            />
                                        </div>
                                        <div className="w-[3.25rem] h-[3.25rem] rounded-full ml-[-0.375rem]">
                                            <Image
                                                src={pool.tokens[1].icon}
                                                alt="token icon"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-9">
                                        <div className="text-ash-gray-500 text-xs mb-4">
                                            Estimate in USD
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-lg">
                                                <span className="text-ash-gray-500">
                                                    $
                                                </span>
                                                <span className="font-bold">
                                                    {fLpValueUsd}
                                                </span>
                                            </div>
                                            {/* <div className="text-2xs text-ash-green-500">
                                                <ICArrowTopRight className="inline mr-1" />
                                                <span className="font-bold">
                                                    +0.00005
                                                </span>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-ash-gray-500 text-xs mb-4">
                                            Your capacity
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-lg text-white">
                                                {fCapacityPercent}%
                                            </div>
                                            {/* <div className="text-2xs text-ash-green-500">
                                                <ICArrowTopRight className="inline mr-1" />
                                                <span className="font-bold">
                                                    +0.00005
                                                </span>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="py-8 border-t border-b border-dashed border-ash-gray-500 grid grid-cols-2 gap-1">
                            <div className="flex flex-col justify-between">
                                <div className="text-xs text-ash-gray-500">
                                    Total Farm
                                </div>
                                <div className="text-earn">
                                    {/* <span className="font-bold text-lg">
                                        0.52&nbsp;
                                    </span>
                                    <span className="text-xs">ELGD</span> */}
                                    Comming soon
                                </div>
                            </div>
                            <button className="h-14 bg-earn clip-corner-1 clip-corner-br flex items-center justify-center text-center text-white font-bold text-sm">
                                Harvest
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1 py-8">
                            <div className="flex flex-col justify-between space-y-4">
                                <div className="text-xs text-ash-gray-500">
                                    Trading APR
                                </div>
                                <div className="text-pink-600 font-bold text-lg">
                                    {tradingAPR}%
                                </div>
                            </div>
                            <div className="flex flex-col justify-between space-y-4">
                                <div className="text-xs text-ash-gray-500">
                                    Emission APR
                                </div>
                                <div className="text-earn text-lg font-bold">
                                    {emissionAPR}%
                                </div>
                            </div>
                        </div>
                        <div className="bg-ash-dark-400 text-ash-gray-500 mb-6">
                            <div className="flex justify-between items-center h-9 space-x-4 px-4">
                                <div className="text-2xs">Total Liquidity</div>
                                <div className="text-sm">${TVL}</div>
                            </div>
                            <div className="flex justify-between items-center h-9 space-x-4 px-4">
                                <div className="text-2xs">24H Volume</div>
                                <div className="text-sm">${volume24h}</div>
                            </div>
                            <div className="flex justify-between items-center h-9 space-x-4 px-4">
                                <div className="text-2xs">LP Token</div>
                                <div className="text-sm">
                                    {fOwnLiquidity} {pool.tokens[0].name}-
                                    {pool.tokens[1].name}
                                </div>
                            </div>
                            <div className="flex justify-between items-center h-9 space-x-4 px-4">
                                <div className="text-2xs">Trading APR</div>
                                <div className="text-sm">{tradingAPR}%</div>
                            </div>
                            <div className="flex justify-between items-center h-9 space-x-4 px-4">
                                <div className="text-2xs">Emissions APR</div>
                                <div className="text-sm">{emissionAPR}%</div>
                            </div>
                        </div>
                        <div className="text-center text-earn underline text-2xs">
                            View LP Distribution
                        </div>
                    </div>
                </div>
            </BaseModal>
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
        </>
    );
};

export default StakedPoolListItem;
