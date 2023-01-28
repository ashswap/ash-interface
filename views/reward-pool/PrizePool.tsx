import { useGetPendingTransactions } from "@elrondnetwork/dapp-core/hooks";
import { Address, TokenPayment } from "@elrondnetwork/erdjs/out";
import { accAddressState } from "atoms/dappState";
import {
    govLockedAmtState,
    govTotalSupplyVeASH,
    govUnlockTSState,
    govVeASHAmtState,
} from "atoms/govState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import GlowingButton from "components/GlowingButton";
import GOVStakeModal from "components/GOVStakeModal";
import { DAPP_CONFIG } from "const/dappConfig";
import {
    LINK_PLAY_RULE,
    LKASH_CONTRACT,
    LK_ASH_COLLECTION,
    REWARD_DISTRIBUTOR_CONTRACT,
    REWARD_POOL_MIN_VE,
    TOTAL_REWARD_POOL,
} from "const/mainnet";
import { ASH_ESDT, VE_ASH_DECIMALS } from "const/tokens";
import { fetcher } from "helper/common";
import { ContractManager } from "helper/contracts/contractManager";
import { formatAmount } from "helper/number";
import { TokenAmount } from "helper/token/tokenAmount";
import { sendTransactions } from "helper/transactionMethods";
import usePendingTxKey from "hooks/usePendingTxKey";
import useRDClaim from "hooks/useRewardDistributorContract/useRDClaim";
import useUnlockBtn from "hooks/useUnlockBtn";
import { IMetaESDT } from "interface/tokens";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import Heading from "./Heading";
import Image from "components/Image";
import UnlockASHModal from "components/UnlockASHModal";
import moment from "moment";
import useGovUnlockASH from "hooks/useGovContract/useGovUnlockASH";

function PrizePool() {
    const [isOpenStake, setIsOpenStake] = useState(false);
    const [isClaimable, setIsClaimable] = useState(false);
    const [isUnlockOpen, setIsUnlockOpen] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(
        new TokenAmount(ASH_ESDT, 0)
    );
    const [startClaimTs, setStartClaimTs] = useState(0);
    const [sharePct, setSharePct] = useState(0);
    const userAddress = useRecoilValue(accAddressState);
    const veSupply = useRecoilValue(govTotalSupplyVeASH);
    const currentVe = useRecoilValue(govVeASHAmtState);
    const lockedAmt = useRecoilValue(govLockedAmtState);
    const unlockTS = useRecoilValue(govUnlockTSState);
    const pendingTxKey = usePendingTxKey();
    const { unlockASH } = useGovUnlockASH();

    const {
        claim,
        trackingData: { isPending },
    } = useRDClaim();
    // const currentVe = new BigNumber(626).multipliedBy(10 ** 18);
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
        return Math.min(
            currentVe.multipliedBy(100).div(REWARD_POOL_MIN_VE).toNumber(),
            100
        );
    }, [currentVe]);

    const canUnlockASH = useMemo(() => {
        return (
            lockedAmt.gt(0) &&
            unlockTS &&
            unlockTS.minus(moment().unix()).lte(0)
        );
    }, [unlockTS, lockedAmt]);

    useEffect(() => {
        if (!userAddress) {
            setIsClaimable(false);
            setRewardAmount(new TokenAmount(ASH_ESDT, 0));
            return;
        }
        const rdContract = ContractManager.getRewardDistributorContract(
            REWARD_DISTRIBUTOR_CONTRACT
        );
        rdContract
            .isClaimable()
            .then((val) => (console.log(val), setIsClaimable(val)));
    }, [userAddress, pendingTxKey]);

    useEffect(() => {
        const rdContract = ContractManager.getRewardDistributorContract(
            REWARD_DISTRIBUTOR_CONTRACT
        );
        const func = () =>
            rdContract
                .estimateReward(
                    new Address(userAddress),
                    startClaimTs || moment().unix()
                )
                .then((val) => {
                    console.log("%", val.toString());
                    setSharePct(val.multipliedBy(100).div(1e11).toNumber());
                    setRewardAmount(
                        new TokenAmount(
                            ASH_ESDT,
                            TOTAL_REWARD_POOL.raw.multipliedBy(val).idiv(1e11)
                        )
                    );
                });
        const timeout = setTimeout(func, 500);
        return () => clearTimeout(timeout);
    }, [userAddress, startClaimTs, pendingTxKey]);

    useEffect(() => {
        const rdContract = ContractManager.getRewardDistributorContract(
            REWARD_DISTRIBUTOR_CONTRACT
        );
        rdContract.getStartClaimableTs().then((val) => {
            setStartClaimTs(val.toNumber());
        });
    }, [pendingTxKey]);

    return (
        <>
            <div className="ash-container pt-28">
                {/* <button
                    className="mb-40"
                    onClick={async () => {
                        const tx = await ContractManager.getLKASHContract(
                            LKASH_CONTRACT
                        ).lockTokens(
                            TokenPayment.fungibleFromBigInteger(
                                "ASH-4ce444",
                                new BigNumber(100).multipliedBy(1e18),
                                18
                            ),
                            3525
                        );
                        sendTransactions({
                            transactions: [tx],
                        });
                    }}
                >
                    LOCK
                </button> */}
                <div className="lg:flex lg:space-x-5">
                    <div className="lg:w-1/3 relative">
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
                                    will be distributed to every veASH Holder
                                    who join this Staking event!
                                </div>
                            </div>
                            <div className="p-6 bg-stake-dark-500 border border-black">
                                <div className="mb-4 font-bold text-sm text-stake-gray-500">
                                    Total veASH staked during this event
                                </div>
                                <div className="flex items-center">
                                    <Avatar className="w-6 h-6 mr-2 bg-ash-purple-500" />
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
                            </div>
                        </div>
                        <div className="absolute -right-4 top-3 -translate-y-1/2 w-44 sm:w-60 md:w-72 lg:w-auto">
                            <Heading className="font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl text-ash-dark-600">
                                Prize Pool
                            </Heading>
                        </div>
                    </div>
                    <div className="lg:w-2/3 relative">
                        <div className="px-7.5 lg:px-10 py-12 bg-stake-dark-400">
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
                                        To be eligible for the reward pool, you
                                        must stake at least{" "}
                                        {formatAmount(
                                            REWARD_POOL_MIN_VE.div(
                                                10 ** VE_ASH_DECIMALS
                                            ).toNumber()
                                        )}{" "}
                                        veASH. 
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
                            <div
                                className={`mt-5 p-8 border ${
                                    isEligible
                                        ? "bg-stake-dark-500 border-black"
                                        : "bg-ash-purple-500/30 border-ash-purple-500"
                                }`}
                            >
                                <div className="font-bold text-sm text-stake-gray-500">
                                    Your current veASH
                                </div>
                                <div className="py-14">
                                    <div className="relative bg-ash-dark-400 h-4.5 flex">
                                        <div
                                            className={`transition-all h-full ${
                                                isEligible
                                                    ? "bg-stake-green-500"
                                                    : "bg-ash-purple-500"
                                            }`}
                                            style={{
                                                width: isZero
                                                    ? "0%"
                                                    : isOver
                                                    ? "calc(100% - 0.85rem)"
                                                    : `max(20%,${pct * 0.8}%)`,
                                            }}
                                        ></div>
                                        <div
                                            className="transition-all absolute flex justify-center items-center"
                                            style={{
                                                left: isZero
                                                    ? "0%"
                                                    : isOver
                                                    ? "calc(100% - 0.85rem)"
                                                    : `max(20%,${pct * 0.8}%)`,
                                            }}
                                        >
                                            <div className="absolute flex flex-col w-0 top-1/2 items-center justify-center">
                                                <div
                                                    className={`w-4.5 h-4.5 mb-3 rotate-45 border-[3px] bg-ash-dark-400 ${
                                                        isEligible
                                                            ? "border-stake-green-500"
                                                            : "border-ash-purple-500"
                                                    }`}
                                                ></div>
                                                <div
                                                    className={`absolute -top-3 -translate-y-full w-max ${
                                                        isOver ? "-right-3" : ""
                                                    } ${isZero && "left-0"}`}
                                                >
                                                    <div className="flex items-center">
                                                        <Avatar className="w-4 h-4 bg-ash-purple-500 mr-2" />
                                                        <div className="font-bold text-lg sm:text-2xl text-white">
                                                            {formatAmount(
                                                                currentVe
                                                                    .div(
                                                                        10 **
                                                                            VE_ASH_DECIMALS
                                                                    )
                                                                    .toNumber(),
                                                                {
                                                                    notation:
                                                                        "standard",
                                                                }
                                                            )}{" "}
                                                            veASH
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-1 translate-y-full right-[20%] flex justify-center">
                                            <div className="absolute flex flex-col items-center w-max">
                                                <div
                                                    className={`w-2 h-2 mb-3 rotate-45 border-2 ${
                                                        isEligible
                                                            ? "border-stake-green-500"
                                                            : "border-stake-gray-500"
                                                    }`}
                                                ></div>
                                                <div
                                                    className={`font-bold text-xs sm:text-sm ${
                                                        isEligible
                                                            ? "text-stake-green-500"
                                                            : "text-white"
                                                    }`}
                                                >
                                                    {formatAmount(
                                                        REWARD_POOL_MIN_VE.div(
                                                            10 **
                                                                VE_ASH_DECIMALS
                                                        ).toNumber(),
                                                        { notation: "standard" }
                                                    )}{" "}
                                                    veASH
                                                </div>
                                                <div
                                                    className={`font-bold text-2xs sm:text-xs text-center max-w-[8rem] sm:max-w-none ${
                                                        isEligible
                                                            ? "text-stake-green-500"
                                                            : "text-white"
                                                    }`}
                                                >
                                                    minimum stake to receive
                                                    reward
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 grid sm:grid-cols-2 gap-4">
                                <div
                                    className={`px-8 py-6 border ${
                                        isEligible
                                            ? "bg-stake-dark-500 border-black"
                                            : "bg-ash-purple-500/30 border-ash-purple-500"
                                    }`}
                                >
                                    <div className="mb-2.5 font-bold text-sm text-stake-gray-500">
                                        Your reward // Estimating...
                                    </div>
                                    <div className="flex items-center">
                                        <Avatar
                                            src={ASH_ESDT.logoURI}
                                            className="w-5 h-5 mr-2"
                                        />
                                        <div className="font-bold text-2xl text-white">
                                            {rewardAmount.equalTo(0)
                                                ? "-"
                                                : formatAmount(
                                                      rewardAmount
                                                          .toBigNumber()
                                                          .toNumber()
                                                  )}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`px-8 py-6 border ${
                                        isEligible
                                            ? "bg-stake-dark-500 border-black"
                                            : "bg-ash-purple-500/30 border-ash-purple-500"
                                    }`}
                                >
                                    <div className="mb-2.5 font-bold text-sm text-stake-gray-500">
                                        Your reward share
                                    </div>
                                    <div className="font-bold text-2xl text-white">
                                        {formatAmount(sharePct)}%
                                    </div>
                                </div>
                            </div>
                            <div className="mt-11 grid grid-cols-2 gap-4">
                                {canUnlockASH ? (
                                    <GlowingButton
                                        theme="yellow"
                                        className="w-full h-14 clip-corner-1 clip-corner-br font-bold text-sm underline"
                                        onClick={() => unlockASH()}
                                    >
                                        Withdraw
                                    </GlowingButton>
                                ) : (
                                    <GlowingButton
                                        theme="pink"
                                        className="w-full h-14 clip-corner-1 clip-corner-br font-bold text-sm underline"
                                        onClick={() => setIsOpenStake(true)}
                                    >
                                        Stake
                                    </GlowingButton>
                                )}

                                <GlowingButton
                                    theme="pink"
                                    className="w-full h-14 clip-corner-1 clip-corner-br font-bold text-sm underline"
                                    disabled={!isClaimable || isPending}
                                    onClick={() => claim()}
                                >
                                    Claim
                                </GlowingButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:flex lg:space-x-5 mt-6">
                    <div className="lg:w-1/3"></div>
                    <div className="lg:w-2/3">
                        <div className="flex justify-center space-x-4">
                            <GlowingButton
                                className="px-4 md:w-72 shrink-0 h-14 md:h-[5.5rem] font-bold text-sm md:text-lg bg-ash-dark-600"
                                onClick={() => {
                                    setIsUnlockOpen(true);
                                }}
                            >
                                Unlock LKASH to get ASH
                            </GlowingButton>
                            <a
                                href={LINK_PLAY_RULE}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <GlowingButton
                                    theme="cyan"
                                    className="px-4 md:w-72 shrink-0 h-14 md:h-[5.5rem] font-bold text-sm md:text-lg"
                                >
                                    View Play Rules & FAQ
                                </GlowingButton>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <GOVStakeModal
                open={isOpenStake}
                onClose={() => setIsOpenStake(false)}
            />
            <UnlockASHModal
                isOpen={isUnlockOpen}
                onRequestClose={() => setIsUnlockOpen(false)}
            />
        </>
    );
}

export default PrizePool;
