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
        rewards?: TokenAmount[];
    } & Omit<Parameters<typeof CardTooltip>[0], "content">
> = ({ children, rewards = [], ...tooltipProps }) => {
    const tokenMap = useRecoilValue(tokenMapState);
    const totalRewardsValue = useMemo(() => {
        return (
            rewards.reduce(
                (s, r) =>
                    s.plus(
                        r.egld.multipliedBy(
                            tokenMap[r.token.identifier]?.price || 0
                        )
                    ),
                new BigNumber(0)
            ) || new BigNumber(0)
        );
    }, [tokenMap, rewards]);
    return (
        <CardTooltip
            content={
                <div className="min-w-[14rem]">
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
                            !rewards.length ? "" : "mt-10"
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
                                            src={r.token.logoURI}
                                            alt={r.token.name}
                                            className="w-4 h-4 mr-2"
                                        />
                                        <span className="font-bold text-xs text-white">
                                            {r.token.symbol}
                                        </span>
                                    </div>
                                    <TextAmt
                                        number={r.egld}
                                        className="font-medium text-xs"
                                    />
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
