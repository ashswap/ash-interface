import ICPickaxe from "assets/svg/pickaxe.svg";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { TokenAmount } from "helper/token/tokenAmount";
import React, { memo, useMemo } from "react";
import { useRecoilValue } from "recoil";

const FarmMultiRewardsTooltip: React.FC<
    {
        rewards?: { amount: TokenAmount; active: boolean }[];
        showBalance?: boolean;
    } & Omit<Parameters<typeof CardTooltip>[0], "content">
> = ({ children, rewards = [], showBalance, ...tooltipProps }) => {
    const tokenMap = useRecoilValue(tokenMapState);
    const totalRewardsValue = useMemo(() => {
        return (
            rewards.reduce(
                (s, r) =>
                    s.plus(
                        r.amount.egld.multipliedBy(
                            tokenMap[r.amount.token.identifier]?.price || 0
                        )
                    ),
                new BigNumber(0)
            ) || new BigNumber(0)
        );
    }, [tokenMap, rewards]);
    const sortedRewards = useMemo(() => {
        return [...rewards].sort((r1, r2) => {
            const r1Active = r1.active;
            const r2Active = r2.active;
            return r1Active === r2Active ? 0 : r1Active === true ? -1 : 1;
        });
    }, [rewards]);
    const isRewardActive = useMemo(() => {
        return rewards.some((r) => !!r.active);
    }, [rewards]);
    return (
        <CardTooltip
            content={
                <div
                    className={`${
                        isRewardActive && showBalance ? "min-w-[20rem]" : "min-w-[14rem]"
                    }`}
                >
                    <div className="mb-2 font-bold text-xs text-white">
                        Rewards
                    </div>
                    <div>
                        <span>&asymp;&nbsp;</span>
                        <TextAmt
                            number={totalRewardsValue}
                            prefix={
                                <span className="font-medium text-stake-gray-500">
                                    $
                                </span>
                            }
                            className="font-bold text-2xl text-white"
                            decimalClassName="text-stake-gray-500"
                            options={{ notation: "standard" }}
                        />
                    </div>
                    <div
                        className={`space-y-2 ${
                            !sortedRewards.length ? "" : "mt-10"
                        }`}
                    >
                        {sortedRewards.map((r) => {
                            return (
                                <div
                                    key={r.amount.token.identifier}
                                    className="flex items-center"
                                >
                                    <div className="grow flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Avatar
                                                src={r.amount.token.logoURI}
                                                alt={r.amount.token.name}
                                                className="w-4 h-4 mr-2"
                                            />
                                            <span className="font-bold text-xs text-white">
                                                {r.amount.token.symbol}
                                            </span>
                                        </div>
                                        
                                        {showBalance && <TextAmt
                                            number={r.amount.egld}
                                            className="font-medium text-xs"
                                        />}
                                    </div>
                                    {isRewardActive && (
                                        <div
                                            className={`ml-4 px-2 py-1 flex items-center bg-ash-dark-600 border border-black font-bold text-2xs leading-tight text-stake-gray-500 ${
                                                r.active
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                        >
                                            <ICPickaxe className="w-3.5 h-auto mr-2" />
                                            <span>Producing...</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            }
            {...tooltipProps}
        >
            {children}
        </CardTooltip>
    );
};

export default memo(FarmMultiRewardsTooltip);
