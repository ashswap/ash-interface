import { accIsLoggedInState } from "atoms/dappState";
import {
    farmRecordsState,
    farmStakedOnlyState
} from "atoms/farmsState";
import { clickedHarvestModalState } from "atoms/harvestState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import GlowingButton from "components/GlowingButton";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { TokenAmount } from "helper/token/tokenAmount";
import useFarmClaimAll from "hooks/useFarmContract/useFarmClaimAll";
import { useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
function FarmStats({ onClickAll }: { onClickAll?: () => void }) {
    const farmRecords = useRecoilValue(farmRecordsState);
    const tokenMap = useRecoilValue(tokenMapState);
    const {
        claimAllFarmsReward: claimAllReward,
        trackingData: { isPending },
    } = useFarmClaimAll(true);
    const setStakedOnly = useSetRecoilState(farmStakedOnlyState);
    const TVL = useMemo(() => {
        return farmRecords.reduce(
            (total, val) => total.plus(val.totalLiquidityValue),
            new BigNumber(0)
        );
    }, [farmRecords]);
    const rewards = useMemo(() => {
        if(isPending) return [];
        const map: Record<string, TokenAmount> = {};
        farmRecords.map((f) => {
            f.stakedData?.rewards.map((r) => {
                if (!map[r.token.identifier])
                    map[r.token.identifier] = new TokenAmount(r.token, 0);
                map[r.token.identifier] = map[r.token.identifier].add(r);
            });
        });
        return Object.values(map);
    }, [farmRecords, isPending]);
    const canHarvest = useMemo(() => {
        return rewards.some((r) => r.greaterThan(0));
    }, [rewards]);
    const totalRewardValue = useMemo(() => {
        return rewards.reduce(
            (sum, r) =>
                sum.plus(
                    r.egld.multipliedBy(
                        tokenMap[r.token.identifier]?.price || 0
                    )
                ),
            new BigNumber(0)
        );
    }, [rewards, tokenMap]);
    const [isClickedHarvestButton, setIsClickedHarvestButton] = useRecoilState(
        clickedHarvestModalState
    );
    const loggedIn = useRecoilValue(accIsLoggedInState);
    useEffect(() => {
        if (window && isClickedHarvestButton && loggedIn) {
            let dataLayer = (window as any).dataLayer || [];
            dataLayer.push({
                event: "click_harvest_liquidity_stake",
            });
        }
    }, [isClickedHarvestButton]);
    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-[21.875rem] shrink-0 flex flex-col px-7 lg:px-9 pb-9 pt-7 lg:pt-14 bg-stake-dark-400 mb-4 md:mb-0 md:mr-[1.875rem]">
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
                                    <div>
                                        Your rewards by staking LP-Tokens,
                                        you can claim them whenever you want.
                                    </div>
                                    <div
                                        className={`space-y-2 ${
                                            !rewards.length ? "" : "mt-4"
                                        }`}
                                    >
                                        {rewards.map((r) => {
                                            return (
                                                <div
                                                    key={r.token.identifier}
                                                    className="flex justify-between items-center"
                                                >
                                                    <div className="flex items-center">
                                                        <Avatar
                                                            src={
                                                                r.token.logoURI
                                                            }
                                                            alt={r.token.name}
                                                            className="w-4 h-4 mr-2"
                                                        />
                                                        <span>
                                                            {r.token.symbol}
                                                        </span>
                                                    </div>
                                                    <TextAmt number={r.egld} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            }
                        >
                            <div className="text-stake-gray-500 text-sm font-bold underline mb-6">
                                TOTAL FARM REWARD
                            </div>
                        </CardTooltip>
                        <div className="flex items-center">
                            <div className="text-white text-lg font-bold">
                                <TextAmt
                                    prefix="$"
                                    number={totalRewardValue}
                                    decimalClassName="text-stake-gray-500"
                                />{" "}
                            </div>
                        </div>
                    </div>
                    <GlowingButton
                        theme="cyan"
                        className={`w-full h-[3.375rem] text-sm font-bold`}
                        disabled={isPending || !canHarvest}
                        onClick={() => {
                            claimAllReward();
                            setIsClickedHarvestButton(true);
                        }}
                    >
                        Harvest
                    </GlowingButton>
                </div>
            </div>
            <div className="grow px-7 lg:px-16 pt-7 lg:pt-14 pb-9 bg-stake-dark-400">
                <h2 className="text-2xl font-bold text-white mb-9">
                    Overall stats
                </h2>
                <div className="sm:flex md:block lg:flex items-end sm:gap-x-7.5">
                    <div className="bg-ash-dark-400/30 px-9 py-7 flex-1">
                        <div className="text-stake-gray-500 text-sm font-bold mb-6">
                            TOTAL VALUE OF LOCKED LP
                        </div>
                        <div className="text-lg">
                            <span className="text-stake-gray-500">$ </span>
                            <span className="text-white font-bold">
                                <TextAmt
                                    number={TVL}
                                    decimalClassName="text-stake-gray-500"
                                    options={{ notation: "standard" }}
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
                            Simply lie back and watch it grow.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmStats;
