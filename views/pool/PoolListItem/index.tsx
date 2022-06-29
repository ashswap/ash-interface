import IconDown from "assets/svg/down-white.svg";
import { PoolsState } from "atoms/poolsState";
import AddLiquidityModal from "components/AddLiquidityModal";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import usePoolDataFormat from "hooks/usePoolDataFormat";
import { useScreenSize } from "hooks/useScreenSize";
import { Unarray } from "interface/utilities";
import { useState } from "react";

function PoolListItem({
    poolData,
}: {
    poolData: Unarray<PoolsState["poolToDisplay"]>;
}) {
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [mIsExpand, setMIsExpand] = useState<boolean>(false);
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
    const { isMobile } = useScreenSize();
    const { pool } = poolData;

    const mOpenDetail = () => {
        setMIsExpand(true);
    };
    const {
        formatedStats: { TVL, emissionAPR, tradingAPR, volume24h },
    } = usePoolDataFormat(poolData);
    return (
        <>
            <div
                className={`flex flex-col py-2 sm:py-7 px-4 lg:pl-11 lg:pr-3`}
                onClick={() => isMobile && mOpenDetail()}
            >
                <div className="flex w-full text-white">
                    <div className="flex items-center overflow-hidden w-full sm:w-[80%] space-x-1">
                        <div className="w-[45%] sm:w-3/12 flex flex-row items-center overflow-hidden">
                            <div className="flex flex-row justify-between items-center mr-2 sm:mr-0">
                                <Avatar
                                    src={pool.tokens[0].icon}
                                    alt={pool.tokens[0].name}
                                    className="h-4 w-4 sm:h-6 sm:w-6 lg:h-9 lg:w-9 rounded-full"
                                />
                                <Avatar
                                    src={pool.tokens[1].icon}
                                    alt={pool.tokens[1].name}
                                    className="h-4 w-4 sm:h-6 sm:w-6 lg:h-9 lg:w-9 rounded-full -ml-1 lg:ml-[-0.375rem]"
                                />
                            </div>
                            <div className="text-2xs hidden sm:block px-3 font-bold">
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
                            {tradingAPR}%
                        </div>
                        <div className="hidden w-3/12 sm:flex text-earn">
                            {emissionAPR}%
                        </div>
                        <div className="hidden w-2/12 sm:flex items-center justify-end bg-bg h-12 text-xs text-right px-3">
                            <span className="text-text-input-3">$</span>
                            <span>{TVL}</span>
                        </div>
                        <div className="w-[37%] sm:w-2/12 flex items-center justify-end bg-bg h-8 sm:h-12 text-xs text-right px-3">
                            <span className="text-text-input-3">$</span>
                            <span>{volume24h}</span>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center w-[20%] pl-4">
                        <div className="grow">
                            <button
                                style={{ height: 48 }}
                                className="h-12 text-xs"
                                onClick={() => setOpenAddLiquidity(true)}
                            >
                                DEPOSIT
                            </button>
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
                                <span>{tradingAPR}%</span>
                            </div>
                        </div>
                        <div className="w-3/12">
                            <div className="flex flex-row items-center justify-between bg-bg w-full h-12 text-xs text-right p-4">
                                <span>Emissions APR</span>
                                <span>{emissionAPR}%</span>
                            </div>
                        </div>
                        <div className="w-3/12"></div>
                        <div
                            className="w-24 h-12 flex flex-row items-center justify-center gap-2 select-none cursor-pointer text-white text-xs"
                            onClick={() => setIsExpand(false)}
                        >
                            <span>Hide</span>
                            <IconDown
                                style={{
                                    transform: `rotate(180deg)`,
                                }}
                            />
                        </div>
                    </div>
                )}
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
                <div className="grow overflow-auto">
                    <div className="px-6 pb-7">
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
                                <Avatar
                                    src={pool.tokens[0].icon}
                                    alt={pool.tokens[0].name}
                                    className="h-[3.25rem] w-[3.25rem] rounded-full"
                                />
                                <Avatar
                                    src={pool.tokens[1].icon}
                                    alt={pool.tokens[1].name}
                                    className="h-[3.25rem] w-[3.25rem] rounded-full -ml-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between mb-12">
                            <div>
                                <div className="text-ash-gray-500 mb-4 text-xs">
                                    Trading APR
                                </div>
                                <div className="font-bold text-lg text-yellow-600">
                                    {tradingAPR}%
                                </div>
                            </div>
                            <div>
                                <div className="text-ash-gray-500 mb-4 text-xs">
                                    Farming per day
                                </div>
                                <div className="text-earn text-lg font-bold">
                                    {emissionAPR}%
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
                                <div className="text-sm">${TVL}</div>
                            </div>
                            <div className="flex justify-between items-center h-9 px-4">
                                <div className="text-2xs mr-4">24H Volume</div>
                                <div className="text-sm">${volume24h}</div>
                            </div>
                            <div className="flex justify-between items-center h-9 px-4">
                                <div className="text-2xs mr-4">Trading APR</div>
                                <div className="text-sm">{tradingAPR}%</div>
                            </div>
                            <div className="flex justify-between items-center h-9 px-4">
                                <div className="text-2xs mr-4">
                                    Emissions APR
                                </div>
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
        </>
    );
}

export default PoolListItem;
