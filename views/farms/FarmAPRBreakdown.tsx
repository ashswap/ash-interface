import ICArrowRight from "assets/svg/arrow-right.svg";
import ICGovBoost from "assets/svg/gov-boost.svg";
import { farmQuery } from "atoms/farmsState";
import BaseTooltip from "components/BaseTooltip";
import { TOKENS_MAP } from "const/tokens";
import { formatAmount } from "helper/number";
import { memo, useMemo } from "react";
import { useRecoilValue } from "recoil";
const ASHRewardBreakdownTable = memo(function ASHRewardBreakdownTable({
    currentBoost,
    weightBoost,
    baseAPR,
}: {
    currentBoost: number;
    weightBoost: number;
    baseAPR: number;
}) {
    return (
        <table className="border border-ash-gray-600">
            <tbody>
                <tr>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-2xs sm:text-xs text-stake-gray-500">
                        Current <br /> ASH reward
                    </td>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-ash-purple-500">
                        <span className="text-sm sm:text-lg underline">
                            {formatAmount(weightBoost * baseAPR)}
                        </span>
                        <span className="text-2xs">%</span>
                    </td>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-2xs sm:text-sm text-white">
                        <span>Boosted: </span>
                        <span className="inline-flex items-center text-pink-600">
                            x{formatAmount(currentBoost)}{" "}
                            <ICGovBoost className="w-3 h-auto -mt-1 ml-1" />
                        </span>
                    </td>
                </tr>
                <tr>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-2xs sm:text-xs text-stake-gray-500">
                        Max reward <br /> can reach
                    </td>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-ash-purple-500">
                        <span className="text-sm sm:text-lg underline">
                            {formatAmount(2.5 * baseAPR)}
                        </span>
                        <span className="text-2xs">%</span>
                    </td>
                    <td className="px-4 py-1 border border-ash-gray-600 font-bold text-2xs sm:text-xs text-white">
                        <span>When boost: </span>
                        <span className="inline-flex items-center">
                            x2.5{" "}
                            <ICGovBoost className="w-2.5 h-auto -mt-1 ml-1" />
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    );
});
const FarmAPRBreakdown = ({
    farmAddress,
    onClose,
}: {
    farmAddress: string;
    onClose?: () => void;
}) => {
    const farmData = useRecoilValue(farmQuery(farmAddress));
    const {
        ashBaseAPR,
        tradingAPR,
        tokensAPR,
        totalAPRMin,
        totalAPRMax,
        stakedData,
    } = farmData;
    const boost = useMemo(() => farmData.stakedData?.yieldBoost, [farmData]);
    return (
        <>
            <div className="mb-6 font-bold text-xs text-stake-gray-500">
                Total APR = Token rewards + Trading APR
            </div>
            <div className="flex flex-col space-y-4">
                <div>
                    <div className="flex justify-between items-center">
                        {stakedData ? (
                            <span className="font-bold text-sm text-ash-purple-500">
                                <BaseTooltip
                                    placement="bottom"
                                    content={
                                        <div
                                            className={`max-w-[25rem] sm:max-w-[28rem] clip-corner-4 clip-corner-bl bg-clip-border p-[1px] backdrop-blur-[30px] transition-all overflow-hidden`}
                                        >
                                            <div className="clip-corner-4 clip-corner-br p-7 bg-ash-dark-600/50 backdrop-blur-[30px] text-stake-gray-500 font-bold text-xs sm:text-sm break-words">
                                                <ASHRewardBreakdownTable
                                                    baseAPR={ashBaseAPR}
                                                    currentBoost={
                                                        stakedData.yieldBoost
                                                    }
                                                    weightBoost={
                                                        stakedData.weightBoost
                                                    }
                                                />
                                            </div>
                                        </div>
                                    }
                                >
                                    <span className="underline">
                                        {formatAmount(
                                            stakedData.weightBoost * ashBaseAPR
                                        )}
                                    </span>
                                </BaseTooltip>
                                <span className="text-2xs">%</span>
                            </span>
                        ) : (
                            <div className="flex items-center space-x-1.5 font-bold text-sm text-ash-purple-500">
                                <span>
                                    <span className="underline">
                                        {formatAmount(ashBaseAPR)}
                                    </span>
                                    <span className="text-2xs">%</span>
                                </span>
                                <ICArrowRight className="w-3 h-auto" />
                                <span>
                                    <span className="underline">
                                        {formatAmount(ashBaseAPR * 2.5)}
                                    </span>
                                    <span className="text-2xs">%</span>
                                </span>
                            </div>
                        )}
                        <div className="font-bold text-xs text-stake-gray-500 underline">
                            ASH incentive
                        </div>
                    </div>
                </div>
                {tokensAPR.map((t) => {
                    const token = TOKENS_MAP[t.tokenId];
                    return (
                        <div
                            key={t.tokenId}
                            className="flex justify-between items-center"
                        >
                            <div className="flex items-center font-bold text-sm text-ash-purple-500">
                                <span>
                                    <span className="underline">
                                        {formatAmount(t.apr)}
                                    </span>
                                    <span className="text-2xs">%</span>
                                </span>
                            </div>
                            <div className="font-bold text-xs text-stake-gray-500 underline">
                                {token?.symbol} incentive
                            </div>
                        </div>
                    );
                })}
                <div className="flex justify-between items-center">
                    <div className="flex items-center font-bold text-sm text-yellow-600">
                        <span>
                            <span className="underline">
                                {formatAmount(tradingAPR)}
                            </span>
                            <span className="text-2xs">%</span>
                        </span>
                    </div>
                    <div className="font-bold text-xs text-stake-gray-500 underline">
                        Trading APR
                    </div>
                </div>
                <div className="border-t border-ash-cyan-500"></div>
                <div className="flex justify-between items-center">
                    {stakedData ? (
                        <span className="font-bold text-sm text-ash-cyan-500">
                            <span className="underline">
                                {formatAmount(stakedData.totalAPR)}
                            </span>
                            <span className="text-2xs">%</span>
                        </span>
                    ) : (
                        <div className="flex items-center space-x-1.5 font-bold text-sm text-ash-cyan-500">
                            <span>
                                <span className="underline">
                                    {formatAmount(totalAPRMin)}
                                </span>
                                <span className="text-2xs">%</span>
                            </span>
                            <ICArrowRight className="w-3 h-auto" />
                            <span>
                                <span className="underline">
                                    {formatAmount(totalAPRMax)}
                                </span>
                                <span className="text-2xs">%</span>
                            </span>
                        </div>
                    )}

                    <div className="font-bold text-sm text-white underline">
                        Total APR
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(FarmAPRBreakdown);
