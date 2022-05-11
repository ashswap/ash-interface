import BigNumber from "bignumber.js";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { ASH_TOKEN } from "const/tokens";
import { useFarms } from "context/farms";
import { toEGLDD } from "helper/balance";
import Image from "next/image";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

function FarmStats({ onClickAll }: { onClickAll?: () => void }) {
    const [harvesting, setHarvesting] = useState(false);
    const { farmRecords, claimReward, setStakedOnly, claimAllReward } =
        useFarms();
    const TVL = useMemo(() => {
        return farmRecords.reduce(
            (total, val) => total.plus(val.totalLiquidityValue),
            new BigNumber(0)
        );
    }, [farmRecords]);
    const totalReward = useMemo(() => {
        return farmRecords.reduce(
            (total, val) => total.plus(val?.stakedData?.totalRewardAmt || 0),
            new BigNumber(0)
        );
    }, [farmRecords]);
    const claimRewardRef = useRef(claimReward);
    useEffect(() => {
        claimRewardRef.current = claimReward;
    }, [claimReward]);
    const harvestAll = useCallback(async () => {
        if (harvesting || totalReward.eq(0)) return;
        setHarvesting(true);
        try {
            await claimAllReward();
            setHarvesting(false);
        } catch (error) {
            setHarvesting(false);
        }
    }, [harvesting, totalReward, claimAllReward]);
    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-[21.875rem] flex-shrink-0 flex flex-col px-7 lg:px-9 pb-9 pt-7 lg:pt-14 bg-stake-dark-400 mb-4 md:mb-0 md:mr-[1.875rem]">
                <div className="flex justify-between items-center mb-9">
                    <h2 className="text-2xl font-bold text-white">
                        Your Summary
                    </h2>
                    <span
                        className="text-ash-cyan-500 text-lg font-bold cursor-pointer"
                        onClick={() => {
                            setStakedOnly(true);
                            onClickAll && onClickAll();
                        }}
                    >
                        All
                    </span>
                </div>
                <div className="bg-ash-dark-400/30 py-5 px-4.5">
                    <div className="px-5 py-2 mb-5">
                        <CardTooltip
                            content={
                                <div>
                                    Your rewards every by staking LP-Tokens, you
                                    can claim them whenever you want.
                                </div>
                            }
                        >
                            <div className="text-ash-gray-500 text-sm font-bold underline mb-6">
                                TOTAL FARM REWARD
                            </div>
                        </CardTooltip>
                        <div className="flex items-center">
                            <div className="w-4.5 h-4.5 rounded-full relative mr-2">
                                <Image
                                    src={ASH_TOKEN.icon}
                                    alt={ASH_TOKEN.name}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                            <div className="text-white text-lg font-bold">
                                <TextAmt
                                    number={toEGLDD(
                                        ASH_TOKEN.decimals,
                                        totalReward
                                    )}
                                    decimalClassName="text-stake-gray-500"
                                />{" "}
                                ASH
                            </div>
                        </div>
                    </div>
                    <button
                        className={`w-full h-[3.375rem] text-sm font-bold flex items-center justify-center ${
                            harvesting || totalReward.eq(0)
                                ? "bg-ash-dark-400 opacity-30 cursor-not-allowed"
                                : "bg-ash-cyan-500 text-ash-dark-400"
                        }`}
                        disabled={harvesting || totalReward.eq(0)}
                        onClick={() => harvestAll()}
                    >
                        Harvest
                    </button>
                </div>
            </div>
            <div className="flex-grow px-7 lg:px-16 pt-7 lg:pt-14 pb-9 bg-stake-dark-400">
                <h2 className="text-2xl font-bold text-white mb-9">
                    Overall stats
                </h2>
                <div className="sm:flex md:block lg:flex items-end sm:gap-x-7.5">
                    <div className="bg-ash-dark-400/30 px-9 py-7 flex-1">
                        <div className="text-ash-gray-500 text-sm font-bold mb-6">
                            TOTAL VALUE OF LOCKED LP
                        </div>
                        <div className="text-lg">
                            <span className="text-ash-gray-500">$ </span>
                            <span className="text-white font-bold">
                                <TextAmt
                                    number={TVL}
                                    decimalClassName="text-stake-gray-500"
                                    options={{notation: "standard"}}
                                />
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 text-ash-gray-500 mt-8 sm:mt-0 md:mt-8 lg:mt-0">
                        <div className="text-sm font-bold mb-4">TIPS</div>
                        <div className="text-sm">
                            Stake{" "}
                            <CardTooltip
                                content={
                                    <>
                                        <div className="mb-4">
                                            Liquid Provider Tokens. This token
                                            stand for your deposition in any
                                            pools of ASHSWAP.
                                        </div>
                                        <a
                                            href="https://docs.ashswap.io/testnet-guides/liquidity-staking"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <span className="text-ash-cyan-500 underline">
                                                View Pools Guide.
                                            </span>
                                        </a>
                                    </>
                                }
                            >
                                <span className="text-white font-bold underline">
                                    LP-Tokens
                                </span>
                            </CardTooltip>{" "}
                            to earn ASH.
                        </div>
                        <div className="text-sm">
                            Just lie on the bed & watch it growing!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmStats;
