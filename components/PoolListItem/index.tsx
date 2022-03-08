import { PoolsState } from 'context/pools';
import { useScreenSize } from 'hooks/useScreenSize';
import { Unarray } from 'interface/utilities';
import React, { useState } from 'react'
import Image from "next/image";
import Button from 'components/Button';
import IconDown from "assets/svg/down-white.svg";
import HeadlessModal, { HeadlessModalDefaultHeader } from 'components/HeadlessModal';
import AddLiquidityModal from 'components/AddLiquidityModal';

function PoolListItem({poolData}: {poolData: Unarray<PoolsState["poolToDisplay"]>}) {
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [mIsExpand, setMIsExpand] = useState<boolean>(false);
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
    const {isMobile} = useScreenSize();
    const {pool, poolStats, stakedData} = poolData;

    const mOpenDetail = () => {
        setMIsExpand(true);
    };

    return (
        <>
            <div
                className={`flex flex-col bg-ash-dark-600 py-2 sm:py-7 px-4 lg:pl-11 lg:pr-3`}
                onClick={() => isMobile && mOpenDetail()}
            >
                <div className="flex w-full text-white">
                    <div className="flex items-center overflow-hidden w-full sm:w-[80%] space-x-1">
                        <div className="w-[45%] sm:w-3/12 flex flex-row items-center overflow-hidden">
                            <div className="flex flex-row justify-between items-center mr-2 sm:mr-0">
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
                            <div
                                style={{ fontSize: 10 }}
                                className="hidden sm:block px-3 font-bold"
                            >
                                &
                            </div>
                            <div className="sm:flex sm:flex-col font-bold text-xs lg:text-lg truncate">
                                <span>{pool.tokens[0].name}</span>
                                <span className="inline sm:hidden">
                                    &nbsp;&&nbsp;
                                </span>
                                <span>{pool.tokens[1].name}</span>
                            </div>
                        </div>
                        <div className="w-[18%] sm:w-2/12 text-xs sm:text-sm flex flex-row items-center text-yellow-600">
                            _%
                        </div>
                        <div className="hidden w-3/12 sm:flex flex-col justify-center">
                            <div className="text-earn">
                                <span className="font-bold text-sm">_ </span>
                                <span
                                    className="font-normal"
                                    style={{ fontSize: 10 }}
                                >
                                    {pool.tokens[0].name}
                                </span>
                            </div>
                            <div style={{ fontSize: 10 }}>
                                per 1,000 {pool.tokens[1].name}
                            </div>
                        </div>
                        <div className="hidden w-2/12 sm:flex items-center justify-end bg-bg h-12 text-xs text-right px-3">
                            <span className="text-text-input-3">$</span>
                            <span>
                                {poolStats?.total_value_locked.toLocaleString("en-US")}
                            </span>
                        </div>
                        <div className="w-[37%] sm:w-2/12 flex items-center justify-end bg-bg h-8 sm:h-12 text-xs text-right px-3">
                            <span className="text-text-input-3">$</span>
                            <span>_</span>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center w-[20%] pl-4">
                        <div className="flex-grow">
                            <Button
                                bottomRightCorner
                                style={{ height: 48 }}
                                className="h-12 text-xs"
                                onClick={() => setOpenAddLiquidity(true)}
                            >
                                DEPOSIT
                            </Button>
                        </div>
                        <div
                            className="w-24 flex flex-row items-center justify-center gap-2 select-none cursor-pointer text-xs"
                            onClick={() => setIsExpand(true)}
                        >
                            {!isExpand && (
                                <>
                                    <span>Detail</span>
                                    <IconDown />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {isExpand && !isMobile && (
                    <div className="flex flex-row items-center text-text-input-3 w-full mt-7 py-1 gap-1">
                        <div className="w-2/12 text-earn underline text-[0.625rem]">
                            View LP Distribution
                        </div>
                        <div className="w-3/12">
                            <div className="flex flex-row items-center justify-between bg-bg w-full h-12 text-xs text-right p-4">
                                <span>Trading APR</span>
                                <span>32%</span>
                            </div>
                        </div>
                        <div className="w-3/12">
                            <div className="flex flex-row items-center justify-between bg-bg w-full h-12 text-xs text-right p-4">
                                <span>Emissions APR</span>
                                <span>51%</span>
                            </div>
                        </div>
                        <div
                            className="w-24 h-12 flex flex-row items-center justify-center gap-2 select-none cursor-pointer text-white text-xs"
                            onClick={() => setIsExpand(false)}
                        >
                            <span>Hide</span>
                            <IconDown
                                style={{
                                    transform: `rotate(180deg)`
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            <HeadlessModal
                open={mIsExpand}
                onClose={() => setMIsExpand(false)}
                transition="btt"
            >
                <div className="bg-ash-dark-600 clip-corner-4 clip-corner-tr p-4 fixed inset-x-0 bottom-0 text-white max-h-screen overflow-auto">
                    <HeadlessModalDefaultHeader
                        onClose={() => setMIsExpand(false)}
                    />
                    <div className="pt-16 px-6 pb-7">
                        <div className="flex justify-between mb-12">
                            <div>
                                <div className="text-ash-gray-500 text-xs mb-[0.625rem]">
                                    Deposit
                                </div>
                                <div className="flex items-baseline">
                                    <div className="text-2xl font-bold">
                                        {pool.tokens[0].name}
                                    </div>
                                    <div className="text-sm font-bold">
                                        &nbsp;&&nbsp;
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {pool.tokens[1].name}
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="h-[3.25rem] w-[3.25rem] rounded-full">
                                    <Image
                                        src={pool.tokens[0].icon}
                                        alt="token icon"
                                    />
                                </div>
                                <div className="h-[3.25rem] w-[3.25rem] rounded-full -ml-2">
                                    <Image
                                        src={pool.tokens[1].icon}
                                        alt="token icon"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mb-12">
                            <div>
                                <div className="text-ash-gray-500 mb-4 text-xs">
                                    APR Earn
                                </div>
                                <div className="font-bold text-lg text-yellow-600">
                                    _%
                                </div>
                            </div>
                            <div>
                                <div className="text-ash-gray-500 mb-4 text-xs">
                                    Farming per day
                                </div>
                                <div>
                                    <span className="text-earn text-lg">
                                        0.52
                                    </span>
                                    <span className="text-xs">
                                        <span className="text-earn">ASH</span>
                                        <span> per 1,000 USDT</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            className="w-full h-14 bg-pink-600 clip-corner-1 clip-corner-br text-white mb-4 font-bold text-sm"
                            onClick={() => {
                                setOpenAddLiquidity(true);
                                setMIsExpand(false);
                            }}
                        >
                            Deposit
                        </button>
                        <div className="bg-ash-dark-400 text-ash-gray-500 mb-6">
                            <div className="flex justify-between items-center h-9 px-4">
                                <div className="text-2xs mr-4">
                                    Total Liquidity
                                </div>
                                <div className="text-sm">$512,913,133</div>
                            </div>
                            <div className="flex justify-between items-center h-9 px-4">
                                <div className="text-2xs mr-4">24H Volume</div>
                                <div className="text-sm">$12,913,133</div>
                            </div>
                            <div className="flex justify-between items-center h-9 px-4">
                                <div className="text-2xs mr-4">Trading APR</div>
                                <div className="text-sm">32%</div>
                            </div>
                            <div className="flex justify-between items-center h-9 px-4">
                                <div className="text-2xs mr-4">
                                    Emissions APR
                                </div>
                                <div className="text-sm">51%</div>
                            </div>
                        </div>
                        <div className="text-center text-earn underline text-2xs">
                            View LP Distribution
                        </div>
                    </div>
                </div>
            </HeadlessModal>
            <AddLiquidityModal
                open={openAddLiquidity}
                onClose={() => setOpenAddLiquidity(false)}
                pool={pool}
            />
        </>
    );
}

export default PoolListItem