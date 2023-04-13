import ICBribe from "assets/svg/bribe.svg";
import ICCapacity from "assets/svg/capacity.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import ICLock from "assets/svg/lock.svg";
import { accAddressState } from "atoms/dappState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import GlowingButton from "components/GlowingButton";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { TOKENS_MAP } from "const/tokens";
import { DAOProposal } from "graphql/type.graphql";
import { ContractManager } from "helper/contracts/contractManager";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";
import useDBWithdrawAll from "hooks/useDAOBribeContract/useDBWithdrawAll";
import useOnTxCompleted from "hooks/useOnTxCompleted";
import { DAOStatus } from "interface/dao";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import DAOClaimBribeRewardModal from "./DAOClaimBribeRewardModal";
import { ENVIRONMENT } from "const/env";

const predicateCanClaim = {
    [ASHSWAP_CONFIG.dappContract.daoBribe]: ["claimReward"],
};
type Props = Pick<DAOProposal, "bribes" | "proposal_id"> & {
    sharePct: number;
    status: DAOStatus;
};
function DAOBribe({ bribes, proposal_id, sharePct, status }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOpenClaim, setIsOpenClaim] = useState(false);
    const tokenPriceMap = useRecoilValue(tokenMapState);
    const { dbWithdrawReward } = useDBWithdrawAll();
    const rewards = useMemo(() => {
        return bribes
            .filter((b) => !!TOKENS_MAP[b.token_id])
            .map(
                (b) => new TokenAmount(TOKENS_MAP[b.token_id], b.reward_amount)
            );
    }, [bribes]);
    const queryTokenIDsKey = useMemo(() => {
        return rewards.map((r) => r.token.identifier).join(",");
    }, [rewards]);
    const address = useRecoilValue(accAddressState);
    const { data: claimedMap, mutate } = useSWR(
        [address, proposal_id, queryTokenIDsKey, status],
        async (address, proposal_id, queryTokenIDsKey, status) => {
            // do not featch claim status if status of proposal !== executed
            if (
                !address ||
                !proposal_id ||
                !queryTokenIDsKey ||
                status !== "executed"
            )
                return {};
            const contract = ContractManager.getDAOBribeContract(
                ASHSWAP_CONFIG.dappContract.daoBribe
            );
            const data: Record<string, boolean> = {};
            await Promise.all(
                queryTokenIDsKey.split(",").map(async (tokenID) => {
                    const isClaimed = await contract.isClaimed(
                        proposal_id,
                        tokenID,
                        address
                    );
                    data[tokenID] = isClaimed;
                })
            );
            return data;
        },
        { revalidateOnFocus: false }
    );
    useOnTxCompleted(mutate, predicateCanClaim);
    const rewardsValue = useMemo(() => {
        return rewards.reduce(
            (sum, r) =>
                sum.plus(
                    r.egld.multipliedBy(tokenPriceMap[r.token.identifier].price)
                ),
            new BigNumber(0)
        );
    }, [rewards, tokenPriceMap]);
    const claimableRewards = useMemo(() => {
        // filter out all claimed rewards, if it's fail to get claimedMap mark all rewards are claimed.
        return !claimedMap
            ? []
            : rewards
                  .filter((r) => !claimedMap[r.token.identifier])
                  .map(
                      (r) =>
                          new TokenAmount(
                              r.token,
                              r.raw.multipliedBy(sharePct).div(100)
                          )
                  );
    }, [claimedMap, rewards, sharePct]);
    const claimableValues = useMemo(
        () => rewardsValue.multipliedBy(sharePct).div(100),
        [rewardsValue, sharePct]
    );
    const canClaim = useMemo(() => {
        return (
            status === "executed" && claimableRewards.some((r) => r.raw.gt(0))
        );
    }, [claimableRewards, status]);

    return (
        <div>
            <div className="relative">
                <div className="clip-corner-4 clip-corner-br bg-stake-dark-300 p-4 relative">
                    <div className="px-6 pt-10 pb-2">
                        <div className="flex">
                            <div className="grow overflow-hidden">
                                <div className="font-bold text-2xl text-white">
                                    {canClaim
                                        ? "You have bribe rewards"
                                        : "This proposal has Bribe"}
                                </div>
                            </div>
                            {canClaim && (
                                <div className="shrink-0 w-24 flex flex-col justify-end p-2 -mt-14 -mb-12 -mr-10 bg-stake-gray-500/10">
                                    <div className="mb-7 font-bold text-sm text-stake-gray-500">
                                        ~ <span className="font-normal">$</span>
                                        <TextAmt
                                            number={claimableValues}
                                            options={{ notation: "standard" }}
                                            className="text-yellow-500"
                                            decimalClassName="text-stake-gray-500"
                                        />
                                    </div>
                                    <GlowingButton
                                        theme="yellow"
                                        className="clip-corner-1 clip-corner-br w-full py-2 px-2 truncate font-bold text-xs text-ash-dark-400"
                                        onClick={() => setIsOpenClaim(true)}
                                    >
                                        Claim
                                    </GlowingButton>
                                </div>
                            )}
                        </div>
                        <div className="mt-8 font-bold text-xs text-stake-gray-500">
                            {!canClaim ? (
                                <>
                                    Vote{" "}
                                    <span className="text-stake-green-500 underline">
                                        Approve
                                    </span>{" "}
                                    to earn rewards
                                </>
                            ) : (
                                <>
                                    <span className="text-yellow-600 underline">
                                        Claim
                                    </span>{" "}
                                    rewards
                                </>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 items-center mt-12">
                            <div className="font-bold">
                                <div className="text-xs text-stake-gray-500 underline mb-2">
                                    Rewards
                                </div>
                                <div>
                                    <span className="font-normal text-stake-gray-500">
                                        $
                                    </span>
                                    <TextAmt
                                        number={rewardsValue}
                                        options={{ notation: "standard" }}
                                    />
                                </div>
                            </div>
                        </div>
                        {isExpanded && (
                            <div className="mt-6 p-8 bg-stake-dark-500">
                                <div className="mb-4 font-bold text-xs text-stake-gray-500">
                                    Rewards details
                                </div>
                                <div className="space-y-1">
                                    {rewards.map((rwd) => (
                                        <div
                                            key={rwd.token.identifier}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center">
                                                <Avatar
                                                    className="w-3.5 h-3.5 mr-1"
                                                    src={rwd.token.logoURI}
                                                />
                                                <div className="font-bold text-white">
                                                    {rwd.token.symbol}
                                                </div>
                                            </div>
                                            <TextAmt
                                                number={rwd.egld}
                                                options={{
                                                    isIntegerAuto: true,
                                                }}
                                                className="font-semibold"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-x-2 mt-6">
                            <div className="bg-ash-dark-400 text-stake-gray-500 px-3 py-2 h-[3.375rem] overflow-hidden">
                                <div className="flex items-center mb-2">
                                    <ICLock className="w-3 h-3 mr-1" />
                                    <CardTooltip
                                        content={
                                            <div>
                                                Rewards are locked until the
                                                proposal is executed.
                                            </div>
                                        }
                                    >
                                        <span className="text-2xs font-bold underline">
                                            Lock
                                        </span>
                                    </CardTooltip>
                                </div>
                                <div className="text-xs font-bold">
                                    Unavaliable
                                </div>
                            </div>
                            <div className="bg-ash-dark-400 text-stake-gray-500 px-3 py-2 h-[3.375rem] overflow-hidden">
                                <div className="flex items-center mb-2">
                                    <ICCapacity className="w-3 h-3 mr-1" />
                                    <CardTooltip
                                        disabled
                                        content={
                                            <div>
                                                Your share of rewards pool.
                                            </div>
                                        }
                                    >
                                        <span className="text-2xs font-bold underline">
                                            Capacity
                                        </span>
                                    </CardTooltip>
                                </div>
                                <div className="text-xs font-bold">
                                    {formatAmount(sharePct)}%
                                </div>
                            </div>
                        </div>
                        <div className="mt-14 flex justify-center">
                            <button
                                className="flex items-center font-bold text-sm text-white"
                                onClick={() => setIsExpanded((val) => !val)}
                            >
                                <span className="mr-2">Detail</span>{" "}
                                {isExpanded ? (
                                    <ICChevronUp />
                                ) : (
                                    <ICChevronDown />
                                )}{" "}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="absolute right-4 -top-6">
                    <ICBribe
                        className={`w-16 h-16 colored-drop-shadow-xs  ${
                            canClaim
                                ? "text-yellow-500 colored-drop-shadow-yellow-500"
                                : "text-pink-600 colored-drop-shadow-pink-600"
                        }`}
                    />
                </div>
                {ENVIRONMENT.NETWORK === "devnet" &&
                    ENVIRONMENT.ENV === "alpha" && (
                        <GlowingButton
                            theme="pink"
                            className="p-4"
                            onClick={() => dbWithdrawReward(proposal_id)}
                        >
                            Test withdraw all
                        </GlowingButton>
                    )}
            </div>
            <DAOClaimBribeRewardModal
                isOpen={isOpenClaim}
                onClose={() => setIsOpenClaim(false)}
                proposalID={proposal_id}
                rewards={claimableRewards}
            />
        </div>
    );
}

export default DAOBribe;
