import { govTotalSupplyVeASH, govVeASHAmtState } from "atoms/govState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import { REWARD_POOL_MIN_VE, TOTAL_REWARD_POOL } from "const/mainnet";
import { ASH_ESDT, VE_ASH_DECIMALS } from "const/tokens";
import { formatAmount } from "helper/number";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import Heading from "./Heading";

function PrizePool() {
    const veSupply = useRecoilValue(govTotalSupplyVeASH);
    // const currentVe = useRecoilValue(govVeASHAmtState);
    const currentVe = new BigNumber(626).multipliedBy(10**18);
    const isEligible = useMemo(() => {
        return currentVe.gte(REWARD_POOL_MIN_VE);
    }, [currentVe]);
    const isOver = useMemo(() => {
        return currentVe.gt(REWARD_POOL_MIN_VE);
    }, [currentVe]);
    const isZero = useMemo(() => {
        return currentVe.eq(0);
    }, [currentVe]);
    const pct = useMemo(() => {
        return Math.min(currentVe.multipliedBy(100).div(REWARD_POOL_MIN_VE).toNumber(), 100);
    }, [currentVe]);
    return (
        <div className="ash-container pt-28">
            <div className="flex space-x-5">
                <div className="w-1/3 relative">
                    <div className="clip-corner-4 clip-corner-tr bg-stake-dark-400 px-7.5 pt-24 pb-7.5 h-full space-y-4">
                        <div className="p-6 bg-stake-dark-500 border border-black">
                            <div className="mb-4 font-bold text-sm text-stake-gray-500">
                                ASH Total Reward
                            </div>
                            <div className="flex items-center mb-9">
                                <Avatar
                                    src={ASH_ESDT.logoURI}
                                    className="w-6 h-6 mr-2"
                                />
                                <div className="font-amaz text-3xl text-white leading-none">
                                    {formatAmount(
                                        TOTAL_REWARD_POOL.toBigNumber().toNumber(),
                                        {
                                            notation: "standard",
                                            isInteger: true,
                                        }
                                    )}
                                </div>
                            </div>
                            <div className="mb-6 font-bold text-xs text-stake-gray-500">
                                Will be distributed to every veASH holder!
                            </div>
                        </div>
                        <div className="p-6 bg-stake-dark-500 border border-black">
                            <div className="mb-4 font-bold text-sm text-stake-gray-500">
                                Total veASH in Dapp
                            </div>
                            <div className="flex items-center mb-9">
                                <Avatar className="w-6 h-6 mr-2 bg-yellow-600" />
                                <div className="font-bold text-3xl text-white leading-none">
                                    {formatAmount(
                                        veSupply
                                            .div(10 ** VE_ASH_DECIMALS)
                                            .toNumber(),
                                        {
                                            notation: "standard",
                                        }
                                    )}
                                </div>
                            </div>
                            <div className="mb-6 font-bold text-xs text-stake-gray-500">
                                Will be distributed to every veASH holder!
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-4 top-3 -translate-y-1/2">
                        <Heading className="font-bold text-5xl text-ash-dark-600">
                            Prize Pool
                        </Heading>
                    </div>
                </div>
                <div className="w-2/3 relative">
                    <div className="px-10 py-12 bg-stake-dark-500">
                        <div className="flex items-center">
                            <span className="font-bold text-2xl text-white mr-4">
                                User Stats
                            </span>
                            {!isEligible && (
                                <div className="relative flex items-center justify-center">
                                    <div className="rotate-45 w-4.5 h-4.5 border border-ash-purple-500 bg-ash-purple-500/30"></div>
                                    <span className="absolute font-bold text-sm">
                                        !
                                    </span>
                                </div>
                            )}
                        </div>
                        {!isEligible && (
                            <div className="mt-5 font-bold text-sm text-ash-purple-500">
                                <div className="mb-2">
                                    To be eligible for the reward pool, you must
                                    stake at least 625 veASH. 
                                </div>
                                <div>
                                    You need to stake{" "}
                                    {formatAmount(
                                        REWARD_POOL_MIN_VE.minus(currentVe)
                                            .div(10 ** VE_ASH_DECIMALS)
                                            .toNumber()
                                    )}{" "}
                                    veASH more.
                                </div>
                            </div>
                        )}
                        <div className={`mt-5 p-8 border ${isEligible ? "bg-stake-dark-500 border-black" : "bg-ash-purple-500/30 border-ash-purple-500"}`}>
                            <div className="font-bold text-sm text-stake-gray-500">
                                Your current veASH
                            </div>
                            <div className="py-14">
                                <div className="relative bg-ash-dark-400 h-4.5 flex">
                                    <div className={`transition-all h-full ${isEligible ? "bg-stake-green-500" : "bg-ash-purple-500"}`} style={{
                                        width: isZero ? "0%" : isOver ? "calc(100% - 0.85rem)" : `max(20%,${pct * 0.8}%)`
                                    }}></div>
                                    <div className="transition-all absolute flex justify-center items-center" style={{
                                        left: isZero ? "0%" : isOver ? 'calc(100% - 0.85rem)' : `max(20%,${pct * 0.8}%)`
                                    }}>
                                        <div className="absolute flex flex-col w-0 top-1/2 items-center justify-center">
                                            <div className={`w-4.5 h-4.5 mb-3 rotate-45 border-2 bg-ash-dark-400 ${isEligible ? "border-stake-green-500" : "border-ash-purple-500"}`}></div>
                                            <div className={`absolute -top-3 -translate-y-full w-max ${isOver ? "-right-3" : ""} ${isZero && "left-0"}`}>
                                                <div className="flex items-center">
                                                    <Avatar className="w-4 h-4 bg-yellow-600 mr-2" />
                                                    <div className="font-bold text-2xl text-white">
                                                        {formatAmount(
                                                            currentVe.div(
                                                                10 **
                                                                    VE_ASH_DECIMALS
                                                            ).toNumber(),
                                                            {
                                                                notation:
                                                                    "standard",
                                                            }
                                                        )}{" "}
                                                        ve
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1 translate-y-full right-[20%] flex justify-center">
                                        <div className="absolute flex flex-col items-center w-max">
                                            <div className={`w-2 h-2 mb-3 rotate-45 border-2 ${isEligible ? "border-stake-green-500" : "border-stake-gray-500"}`}></div>
                                            <div className={`font-bold text-sm ${isEligible ? "text-stake-green-500": "text-white"}`}>
                                                {formatAmount(
                                                    REWARD_POOL_MIN_VE.div(
                                                        10 ** VE_ASH_DECIMALS
                                                    ).toNumber(),
                                                    { notation: "standard" }
                                                )}{" "}
                                                ve
                                            </div>
                                            <div className={`font-bold text-xs ${isEligible ? "text-stake-green-500": "text-white"}`}>
                                                Minimum to be distributed
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrizePool;
