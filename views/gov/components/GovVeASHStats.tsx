import ImgVEASH from "assets/images/ve-ash.png";
import ICCapacity from "assets/svg/capacity.svg";
import ICLock from "assets/svg/lock.svg";
import {
    govLockedAmtSelector,
    govTotalSupplyVeASHSelector,
    govUnlockTSSelector,
    govVeASHAmtSelector,
} from "atoms/govState";
import Avatar from "components/Avatar";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { VE_ASH_DECIMALS } from "const/tokens";
import { toEGLDD } from "helper/balance";
import moment from "moment";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

function GovVeASHStats() {
    const lockedAmt = useRecoilValue(govLockedAmtSelector);
    const veASH = useRecoilValue(govVeASHAmtSelector);
    const unlockTS = useRecoilValue(govUnlockTSSelector);
    const totalSupplyVeASH = useRecoilValue(govTotalSupplyVeASHSelector);
    const capacityPct = useMemo(() => {
        if (totalSupplyVeASH.eq(0)) return "_";
        return veASH.multipliedBy(100).div(totalSupplyVeASH).toFixed(2);
    }, [veASH, totalSupplyVeASH]);
    return (
        <>
            <div className="px-5 mb-7">
                <CardTooltip
                    content={
                        <div>
                            Voting-Escrow ASH. A type of token that you’ll
                            receive after staking your ASH, veASH will reduce
                            day-by-day till the lock period ends. You can extend
                            your lock period to recover your veASH.
                        </div>
                    }
                >
                    <div className="inline-block text-stake-gray-500 text-sm font-bold underline mb-7">
                        YOUR veASH
                    </div>
                </CardTooltip>

                <div className="flex items-center">
                    {/* <div className="w-[1.125rem] h-[1.125rem] mr-2">
                                        <Image src={ImgUsdt} alt="token icon" />
                                    </div> */}
                    <Avatar
                        src={ImgVEASH}
                        alt="veASH"
                        className="w-[1.125rem] h-[1.125rem] mr-2"
                    />
                    <div className="text-lg text-white font-bold">
                        <TextAmt
                            number={toEGLDD(VE_ASH_DECIMALS, veASH)}
                            decimalClassName="text-stake-gray-500"
                        />
                    </div>
                </div>
            </div>
            <div className="flex space-x-2">
                <div className="bg-ash-dark-400 text-stake-gray-500 px-3 py-2 w-7/12 h-[3.375rem] overflow-hidden">
                    <div className="flex items-center mb-2">
                        <ICLock className="w-3 h-3 mr-1" />
                        <CardTooltip
                            content={
                                <div>
                                    Your lock period. When this period ends, you
                                    can claim back your staked ASH.
                                </div>
                            }
                        >
                            <span className="text-2xs font-bold underline">
                                Lock
                            </span>
                        </CardTooltip>
                    </div>
                    <div className="text-xs font-bold">
                        {lockedAmt.gt(0)
                            ? moment
                                  .unix(unlockTS.toNumber())
                                  .format("DD MMM, yyyy")
                            : "_"}
                    </div>
                </div>
                <div className="bg-ash-dark-400 text-stake-gray-500 px-3 py-2 w-5/12 h-[3.375rem] overflow-hidden">
                    <div className="flex items-center mb-2">
                        <ICCapacity className="w-3 h-3 mr-1" />
                        <CardTooltip
                            content={
                                <div>
                                    Percentage of your veASH to the total veASH
                                    in ASHSWAP Governance Stake. It determines
                                    the reward that you’ll receive.
                                </div>
                            }
                        >
                            <span className="text-2xs font-bold underline">
                                Capacity
                            </span>
                        </CardTooltip>
                    </div>
                    <div className="text-xs font-bold">{capacityPct}%</div>
                </div>
            </div>
        </>
    );
}

export default GovVeASHStats;
