import { PoolsState } from "context/pools";
import { Unarray } from "interface/utilities";
import React, { useState } from "react";
import Image from "next/image";
import AddLiquidityModal from "components/AddLiquidityModal";
import Down from "assets/svg/down-white.svg";
import usePoolDataFormat from "hooks/usePoolDataFormat";
import { network } from "const/network";

function PoolCardItem({
    poolData,
}: {
    poolData: Unarray<PoolsState["poolToDisplay"]>;
}) {
    const { pool } = poolData;
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
    const {
        formatedStats: { TVL, tradingAPR, volumn24h },
    } = usePoolDataFormat(poolData);
    return (
        <div
            className={`bg-ash-dark-700 clip-corner-4 clip-corner-tr pt-8 pb-5 px-6 sm:px-11 text-white`}
        >
            <div className="flex flex-row justify-between items-start mb-12">
                <div>
                    <div className="text-text-input-3 text-xs pb-2.5">
                        Deposit
                    </div>
                    <div className="flex flex-row items-baseline text-2xl font-bold">
                        <span>{pool.tokens[0].name}</span>
                        <span className="text-sm px-3">&</span>
                        <span>{pool.tokens[1].name}</span>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="w-[3.25rem]">
                        <Image src={pool.tokens[0].icon} alt="token icon" />
                    </div>
                    <div className="w-[3.25rem] -ml-2.5">
                        <Image src={pool.tokens[1].icon} alt="token icon" />
                    </div>
                </div>
            </div>
            <div className="flex flex-row my-12 justify-between items-center">
                <div>
                    <div className="text-text-input-3 text-xs mb-4 underline">
                        Trading APR
                    </div>
                    <div className="text-yellow-600 font-bold text-lg leading-tight">
                        {tradingAPR}%
                    </div>
                </div>
            </div>
            <button
                className="w-full clip-corner-1 clip-corner-br bg-pink-600 h-14 text-sm font-bold text-white underline"
                onClick={() => setOpenAddLiquidity(true)}
            >
                Deposit
            </button>

            <div className="bg-bg my-4 text-text-input-3">
                <div className="flex flex-row justify-between items-center h-12 px-4">
                    <div className="underline text-2xs">Total Liquidity</div>
                    <div className="text-sm">${TVL}</div>
                </div>
                <div className="flex flex-row justify-between items-center h-12 px-4">
                    <div className="underline text-2xs">24H Volume</div>
                    <div className="text-sm">${volumn24h}</div>
                </div>
                {isExpand && (
                    <>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">
                                Trading APR
                            </div>
                            <div className="text-sm">{tradingAPR}%</div>
                        </div>
                    </>
                )}
            </div>

            {isExpand && (
                <div className="text-center mb-8">
                    <a
                        href={`${network.explorerAddress}/tokens/${pool.lpToken.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-earn underline text-2xs font-bold hover:text-earn hover:underline"
                    >
                        View LP Distribution
                    </a>
                </div>
            )}

            <div
                className="flex flex-row justify-center items-center select-none cursor-pointer py-2"
                onClick={() => setIsExpand(!isExpand)}
            >
                <div className="font-bold text-sm mr-2">
                    {isExpand ? "Hide" : "Detail"}
                </div>
                <Down
                    style={{
                        transform: `rotate(${isExpand ? "180" : "0"}deg)`,
                    }}
                />
            </div>

            <AddLiquidityModal
                open={openAddLiquidity}
                onClose={() => setOpenAddLiquidity(false)}
                poolData={poolData}
            />
        </div>
    );
}

export default PoolCardItem;
