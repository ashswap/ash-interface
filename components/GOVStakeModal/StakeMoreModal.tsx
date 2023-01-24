import { Slider } from "antd";
import ICArrowTopRight from "assets/svg/arrow-top-right.svg";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICWarning from "assets/svg/warning.svg";
import { accIsInsufficientEGLDState } from "atoms/dappState";
import {
    govLockedAmtState,
    govTotalSupplyVeASH,
    govUnlockTSState,
    govVeASHAmtState,
} from "atoms/govState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import Switch from "components/Switch";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { VE_CONFIG } from "const/ashswapConfig";
import { ENVIRONMENT } from "const/env";
import { REWARD_DISTRIBUTOR_CONTRACT, TOTAL_REWARD_POOL } from "const/mainnet";
import { ASH_TOKEN, VE_ASH_DECIMALS } from "const/tokens";
import { toEGLDD, toWei } from "helper/balance";
import { ContractManager } from "helper/contracts/contractManager";
import { estimateVeASH } from "helper/voteEscrow";
import useGovLockMore from "hooks/useGovContract/useGovLockMore";
import useMediaQuery from "hooks/useMediaQuery";
import { useOnboarding } from "hooks/useOnboarding";
import { useScreenSize } from "hooks/useScreenSize";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { theme } from "tailwind.config";
import { useDebouncedCallback } from "use-debounce";
import LockPeriod, { lockPeriodFormater } from "./LockPeriod";
type props = {
    open: boolean;
    onClose: () => void;
};
// for BoY
const EXTEND_BOY = {
    options: [
        // test purpose
        { value: 12 * 60 * 60, label: "+ 12 hours" },
        { value: 24 * 60 * 60, label: "+ 1 day" },
        { value: 3 * 24 * 60 * 60, label: "+ 3 days" },
        { value: 1 * 7 * 24 * 60 * 60, label: "+ 1 week" },
    ],
    maxLock: 2 * 7 * 24 * 60 * 60,
    minLock: 12 * 60 * 60,
};
const EXTEND_CONFIG_MAIN = {
    options: [
        // test purpose
        // { value: 7 * 24 * 60 * 60, label: "+ 1 week" },
        // { value: 4 * 7 * 24 * 60 * 60, label: "+ 4 weeks" },
        { value: 1 * 365 * 24 * 60 * 60, label: "+ 1 year" },
        { value: 2 * 365 * 24 * 60 * 60, label: "+ 2 years" },
        { value: 3 * 365 * 24 * 60 * 60, label: "+ 3 years" },
    ],
    maxLock: 4 * 365 * 24 * 60 * 60,
    minLock: 7 * 24 * 60 * 60,
    sliderStep: 24 * 60 * 60,
};
const EXTEND_CONFIG_PRE_MAIN = {
    options: [
        // test purpose
        // { value: 7 * 24 * 60 * 60, label: "+ 1 week" },
        // { value: 4 * 7 * 24 * 60 * 60, label: "+ 4 weeks" },
        { value: 1 * 365 * 24 * 60 * 60, label: "+ 1 year" },
        { value: 2 * 365 * 24 * 60 * 60, label: "+ 2 years" },
        { value: 3 * 365 * 24 * 60 * 60, label: "+ 3 years" },
    ],
    maxLock: VE_CONFIG.maxLock,
    minLock: VE_CONFIG.minLock,
    sliderStep: 4 * 60 * 60,
};
const EXTEND_CONFIG =
    ENVIRONMENT.NETWORK === "mainnet"
        ? EXTEND_CONFIG_MAIN
        : EXTEND_CONFIG_PRE_MAIN;
const StakeMoreContent = ({ open, onClose }: props) => {
    const lockedAmt = useRecoilValue(govLockedAmtState);
    const unlockTS = useRecoilValue(govUnlockTSState);
    const totalSupplyVeASH = useRecoilValue(govTotalSupplyVeASH);
    const veASH = useRecoilValue(govVeASHAmtState);
    const { lockMoreASH } = useGovLockMore();

    const tokenMap = useRecoilValue(tokenMapState);
    const insufficientEGLD = useRecoilValue(accIsInsufficientEGLDState);
    const ASHBalance = useMemo(
        () => new BigNumber(tokenMap[ASH_TOKEN.identifier]?.balance || 0),
        [tokenMap]
    );
    const [lockAmt, setLockAmt] = useState<BigNumber>(new BigNumber(0));
    const [rawLockAmt, setRawLockAmt] = useState("");
    const [currentLockSeconds, setCurrentLockSeconds] = useState(0);

    const [isExtend, setIsExtend] = useState(false);
    const { isMobile } = useScreenSize();
    const isTouchScreen = useMediaQuery("(hover: none)");
    const [onboardingExtendPeriod, setOnboardedExtendPeriod] = useOnboarding(
        "stake_gov_extend_lock_time"
    );
    const [openOnboardingExtendTooltip, setOpenOnboardingExtendTooltip] =
        useState(false);
    const [estimatedReward, setEstimatedReward] = useState(0);
    const remaining = useMemo(() => {
        return lockPeriodFormater(currentLockSeconds * 1000);
    }, [currentLockSeconds]);
    const extendOpts = useMemo(() => {
        const max = EXTEND_CONFIG.maxLock - currentLockSeconds;
        return [
            ...EXTEND_CONFIG.options.filter((opt) => opt.value < max),
            {
                value: max,
                label: `max: ${lockPeriodFormater(max * 1000)}`,
            },
        ];
    }, [currentLockSeconds]);
    const [extendLockPeriod, setExtendLockPeriod] = useState(
        extendOpts[0].value
    ); // in seconds
    // useEffect(() => {
    //     if (currentLockSeconds === 0) {
    //         setIsExtend(true);
    //     }
    // }, [currentLockSeconds]);
    const setMaxLockAmt = useCallback(() => {
        if (!ASHBalance) return;
        setLockAmt(ASHBalance);
        setRawLockAmt(toEGLDD(ASH_TOKEN.decimals, ASHBalance).toString(10));
    }, [ASHBalance]);

    const insufficientASH = useMemo(() => {
        if (!ASHBalance) return true;
        return lockAmt.gt(ASHBalance);
    }, [ASHBalance, lockAmt]);

    const canExtendLockPeriod = useMemo(() => {
        return (
            isExtend &&
            extendLockPeriod >= EXTEND_CONFIG.minLock &&
            extendLockPeriod + currentLockSeconds <= EXTEND_CONFIG.maxLock
        );
    }, [currentLockSeconds, extendLockPeriod, isExtend]);

    const canStake = useMemo(() => {
        return (
            !insufficientEGLD &&
            !insufficientASH &&
            (lockAmt.gt(0) || canExtendLockPeriod)
        );
    }, [insufficientEGLD, insufficientASH, lockAmt, canExtendLockPeriod]);

    const lockMore = useCallback(async () => {
        const { sessionId } = await lockMoreASH({
            weiAmt: lockAmt,
            unlockTimestamp: canExtendLockPeriod
                ? new BigNumber(
                      moment
                          .unix(unlockTS.toNumber())
                          .add(extendLockPeriod, "seconds")
                          .unix()
                  )
                : undefined,
        });
        if (sessionId) onClose?.();
    }, [
        lockMoreASH,
        lockAmt,
        canExtendLockPeriod,
        unlockTS,
        extendLockPeriod,
        onClose,
    ]);

    const estimatedVeASH = useMemo(() => {
        if (isExtend) {
            return estimateVeASH(
                lockedAmt.plus(lockAmt),
                extendLockPeriod + currentLockSeconds
            );
        }
        return estimateVeASH(lockedAmt.plus(lockAmt), currentLockSeconds);
    }, [extendLockPeriod, lockedAmt, lockAmt, currentLockSeconds, isExtend]);
    const estimatedCapacity = useMemo(() => {
        const pct = estimatedVeASH
            .multipliedBy(100)
            .div(totalSupplyVeASH.plus(estimatedVeASH));
        return pct.lt(0.01) ? "< 0.01" : pct.toFixed(2);
    }, [estimatedVeASH, totalSupplyVeASH]);
    const currentCapacity = useMemo(() => {
        const pct = veASH.multipliedBy(100).div(totalSupplyVeASH);
        return pct.lt(0.01) ? "< 0.01" : pct.toFixed(2);
    }, [veASH, totalSupplyVeASH]);
    const diffCapacity = useMemo(() => {
        const c = currentCapacity.startsWith("<") ? 0 : +currentCapacity;
        const e = estimatedCapacity.startsWith("<") ? 0 : +estimatedCapacity;
        return new BigNumber(e).minus(c).toNumber();
    }, [currentCapacity, estimatedCapacity]);
    const calculateReward = useDebouncedCallback(
        (ashAmt: BigNumber, unlockTs: number) => {
            ContractManager.getRewardDistributorContract(
                REWARD_DISTRIBUTOR_CONTRACT
            )
                .calculate(ashAmt, unlockTs, moment().unix())
                .then((val) => (console.log(val.toString()), val))
                .then((val) =>
                    setEstimatedReward(
                        val
                            .multipliedBy(TOTAL_REWARD_POOL.egld)
                            .div(1e11)
                            .toNumber()
                    )
                );
        },
        500
    );

    useEffect(() => {
        if (isTouchScreen) {
            setOpenOnboardingExtendTooltip(true);
        }
    }, [isTouchScreen]);
    useEffect(() => {
        const func = () => {
            const current = moment
                .unix(unlockTS.toNumber())
                .diff(moment(), "seconds");
            setCurrentLockSeconds(current > 0 ? current : 0);
        };
        func();
        const interval = setInterval(func, 60 * 1000);
        return () => clearInterval(interval);
    }, [unlockTS]);

    useEffect(() => {
        if (extendOpts.length === 1) {
            setExtendLockPeriod(extendOpts[0].value);
        }
    }, [extendOpts]);

    useEffect(() => {
        console.log(estimatedVeASH.toString(), veASH.toString());
        const virtualAmt = BigNumber.max(estimatedVeASH.minus(veASH), 0);
        console.log(virtualAmt.toString());
        calculateReward(virtualAmt, VE_CONFIG.maxLock + moment().unix());
    }, [calculateReward, estimatedVeASH, veASH]);
    return (
        <>
            <div className="px-6 lg:px-20 pb-12 overflow-auto relative">
                <div className="text-pink-600 text-2xl font-bold mb-9 lg:mb-14">
                    Manage Your Governance Stake
                </div>
                <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-24">
                    <div className="flex flex-col grow mb-16 lg:mb-0">
                        <div className="w-full grid grid-cols-2 gap-x-4 lg:gap-x-7.5 mb-16 lg:mb-12">
                            <div>
                                <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                    {isMobile
                                        ? "Added Amount"
                                        : "I want to stake more!"}
                                </div>
                                <InputCurrency
                                    className={`w-full text-white text-lg font-bold bg-ash-dark-400 h-14 lg:h-18 px-4.5 lg:px-6 flex items-center text-right outline-none border ${
                                        insufficientASH
                                            ? "border-ash-purple-500"
                                            : "border-transparent"
                                    }`}
                                    value={rawLockAmt}
                                    decimals={ASH_TOKEN.decimals}
                                    onChange={(e) => {
                                        const raw = e.target.value.trim();
                                        const lockAmt = toWei(ASH_TOKEN, raw);
                                        setRawLockAmt(raw);
                                        setLockAmt(lockAmt);
                                    }}
                                />
                                <div className="text-right text-2xs lg:text-xs mt-2">
                                    <span className="text-ash-gray-500">
                                        Balance:{" "}
                                    </span>

                                    <span
                                        className="text-earn cursor-pointer"
                                        onClick={() => setMaxLockAmt()}
                                    >
                                        <TextAmt
                                            number={toEGLDD(
                                                ASH_TOKEN.decimals,
                                                ASHBalance
                                            )}
                                            options={{ notation: "standard" }}
                                        />
                                        &nbsp;
                                        {ASH_TOKEN.symbol}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4 flex items-center">
                                    <div className="mr-1">Current</div>
                                    <div className="flex items-center">
                                        <Avatar
                                            src={ASH_TOKEN.logoURI}
                                            alt={ASH_TOKEN.symbol}
                                            className="w-3 h-3 mr-1"
                                        />
                                        <div>{ASH_TOKEN.symbol} Staked</div>
                                    </div>
                                </div>
                                <div className="bg-stake-dark-500 h-14 lg:h-18 px-6 flex items-center justify-end text-ash-gray-500">
                                    <div className="text-right text-sm lg:text-lg">
                                        <TextAmt
                                            number={toEGLDD(
                                                ASH_TOKEN.decimals,
                                                lockedAmt
                                            )}
                                            options={{ notation: "standard" }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right text-2xs lg:text-xs mt-2 text-ash-gray-500">
                                    <span>Total stake: </span>
                                    <span>
                                        <TextAmt
                                            number={toEGLDD(
                                                ASH_TOKEN.decimals,
                                                lockedAmt.plus(lockAmt)
                                            )}
                                            options={{ notation: "standard" }}
                                        />{" "}
                                        ASH
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-16 lg:mb-11">
                            <CardTooltip
                                content={<div>Your lock remaining.</div>}
                            >
                                <div className="inline-block text-ash-gray-500 text-sm font-bold underline mb-2 lg:mb-4">
                                    Current lock period
                                </div>
                            </CardTooltip>
                            <div className="bg-stake-dark-500 text-ash-gray-500 h-18 lg:h-20 pl-6 pr-4 flex items-center justify-between">
                                <div className="text-lg lg:text-2xl font-bold">
                                    {moment
                                        .unix(unlockTS.toNumber())
                                        .format("DD MMM, yyyy")}
                                </div>
                                <div className="text-xs lg:text-sm underline pl-5 border-l border-l-ash-gray-500">
                                    {remaining}
                                </div>
                            </div>
                        </div>

                        <div>
                            {currentLockSeconds > 0 ? (
                                <div className="flex items-center">
                                    <Switch
                                        className="flex items-center"
                                        checked={isExtend}
                                        onChange={(val) => {
                                            setIsExtend(val);
                                            if (val) {
                                                setOpenOnboardingExtendTooltip(
                                                    true
                                                );
                                            }
                                        }}
                                    >
                                        {/* <CardTooltip
                                            content={
                                                <div>
                                                    You can extend your locked
                                                    period to recover your veASH
                                                    to maximum of 4 years.
                                                </div>
                                            }
                                        >
                                            <span className="ml-3 text-ash-gray-500 text-sm font-bold underline">
                                                I want to extend my lock period!
                                            </span>
                                        </CardTooltip> */}
                                        <span className="ml-3 text-ash-gray-500 text-sm font-bold underline">
                                            I want to extend my lock period!
                                        </span>
                                    </Switch>
                                </div>
                            ) : (
                                <CardTooltip
                                    content={
                                        <div>
                                            You can extend your locked period to
                                            recover your veASH to maximum of 4
                                            years.
                                        </div>
                                    }
                                >
                                    <span className="text-ash-gray-500 text-sm font-bold underline">
                                        Extend lock period
                                    </span>
                                </CardTooltip>
                            )}
                            {isExtend && (
                                <OnboardTooltip
                                    open={
                                        onboardingExtendPeriod &&
                                        openOnboardingExtendTooltip
                                    }
                                    onOpenChange={(val) =>
                                        val &&
                                        setOpenOnboardingExtendTooltip(
                                            onboardingExtendPeriod
                                        )
                                    }
                                    onArrowClick={() => {
                                        if (openOnboardingExtendTooltip) {
                                            setOpenOnboardingExtendTooltip(
                                                false
                                            );
                                            setOnboardedExtendPeriod(true);
                                        }
                                    }}
                                    strategy={isMobile ? "absolute" : "fixed"}
                                    placement="bottom"
                                    arrowStyle={() => ({ left: 56 })}
                                    content={
                                        <div
                                            style={{
                                                filter: isMobile
                                                    ? ""
                                                    : "drop-shadow(0px 4px 50px rgba(0, 0, 0, 0.5))",
                                            }}
                                        >
                                            <div className="clip-corner-4 clip-corner-bl bg-ash-dark-600 p-[1px] max-w-full sm:max-w-[23rem] sm:mx-6">
                                                <div className="clip-corner-4 clip-corner-bl bg-ash-dark-400 px-12 pt-14 pb-11">
                                                    <div className="font-bold text-lg leading-tight mb-8">
                                                        You{" "}
                                                        <span className="text-stake-green-500">
                                                            can only extend
                                                        </span>{" "}
                                                        your lock period. If you
                                                        do, the longer you lock,
                                                        the more veASH you’ll
                                                        receive.
                                                    </div>
                                                    <a
                                                        href="https://docs.ashswap.io/testnet-guides/governance-staking"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <span className="text-stake-green-500 underline text-sm font-bold">
                                                            Governance Stake
                                                            Guide
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="mt-8">
                                        <LockPeriod
                                            lockSeconds={
                                                extendOpts.length === 1
                                                    ? EXTEND_CONFIG.maxLock
                                                    : extendLockPeriod +
                                                      currentLockSeconds
                                            }
                                            min={
                                                currentLockSeconds +
                                                EXTEND_CONFIG.minLock
                                            }
                                            max={EXTEND_CONFIG.maxLock}
                                            options={extendOpts.map((opt) => ({
                                                ...opt,
                                                value:
                                                    opt.value +
                                                    currentLockSeconds,
                                            }))}
                                            lockSecondsChange={(val) =>
                                                setExtendLockPeriod(
                                                    val - currentLockSeconds
                                                )
                                            }
                                        />
                                        {/* <div className="mt-4 flex space-x-2">
                                                {extendOpts.map((opt, i) => {
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            className={`border border-ash-gray-500 bg-ash-gray-500/10 h-11 lg:h-12 flex items-center justify-center px-1 text-ash-gray-500 text-xs lg:text-sm ${i === extendOpts.length - 1 ? "grow" : "w-24"}`}
                                                            onClick={() => setExtendLockPeriod(opt.value)}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    );
                                                })}
                                            </div> */}
                                                                            <div className="overflow-hidden mt-8">
                                    <Slider
                                        className="ash-slider ash-slider-pink my-0"
                                        step={EXTEND_CONFIG.sliderStep}
                                        marks={{
                                            [EXTEND_CONFIG.minLock]: "",
                                            [(EXTEND_CONFIG.maxLock -
                                                EXTEND_CONFIG.minLock) /
                                                4 +
                                                EXTEND_CONFIG.minLock]: "",
                                            [(EXTEND_CONFIG.maxLock -
                                                EXTEND_CONFIG.minLock) /
                                                2 +
                                                EXTEND_CONFIG.minLock]: "",
                                            [((EXTEND_CONFIG.maxLock -
                                                EXTEND_CONFIG.minLock) *
                                                3) /
                                                4 +
                                                EXTEND_CONFIG.minLock]: "",
                                            [EXTEND_CONFIG.maxLock]: "",
                                        }}
                                        handleStyle={{
                                            backgroundColor:
                                                theme.extend.colors.pink[600],
                                            borderRadius: 0,
                                            border:
                                                "2px solid " +
                                                theme.extend.colors.pink[600],
                                            width: 7,
                                            height: 7,
                                        }}
                                        min={EXTEND_CONFIG.minLock}
                                        max={EXTEND_CONFIG.maxLock}
                                        value={currentLockSeconds + extendLockPeriod}
                                        tipFormatter={(val) =>
                                            val &&
                                            lockPeriodFormater(val * 1000)
                                        }
                                        onChange={(e) => e > currentLockSeconds && setExtendLockPeriod(e - currentLockSeconds)}
                                    />
                                    <div className="flex justify-between mt-1">
                                        <div className="text-xs lg:text-sm font-bold text-white">
                                            {lockPeriodFormater(
                                                EXTEND_CONFIG.minLock * 1000
                                            )}
                                        </div>
                                        <div className="text-xs lg:text-sm font-bold text-pink-600">
                                            {lockPeriodFormater(
                                                EXTEND_CONFIG.maxLock * 1000
                                            )}
                                        </div>
                                    </div>
                                </div>
                                    </div>

                                </OnboardTooltip>
                            )}
                        </div>
                    </div>
                    <div className="w-full sm:w-1/3 lg:w-[17.8125rem] shrink-0 bg-stake-dark-500 py-[2.375rem] px-10 sm:px-4 lg:px-10">
                        <div className="text-white text-lg font-bold mb-16">
                            Staking Estimate
                        </div>
                        <div className="flex flex-col space-y-11">
                            <div>
                                <CardTooltip
                                    content={
                                        <div>
                                            <ICWarning className="w-6 h-6 -mt-1 inline-block mr-2"/>
                                            Your reward will change depending on
                                            the number of veASH of other
                                            participants
                                        </div>
                                    }
                                >
                                    <div className="inline-block text-stake-gray-500 text-xs underline mb-2">
                                        Estimated Reward
                                    </div>
                                </CardTooltip>
                                <div className="flex items-center">
                                    <Avatar
                                        src={TOTAL_REWARD_POOL.token.logoURI}
                                        className="w-5 h-5 mr-2"
                                    />
                                    <div className="text-white text-lg font-bold">
                                        <TextAmt
                                            number={estimatedReward}
                                            decimalClassName="text-stake-gray-500"
                                        />
                                    </div>
                                </div>
                                {/* <div className="flex items-center">
                                    <Avatar
                                        src={TOTAL_REWARD_POOL.token.logoURI}
                                        className="w-5 h-5 mr-2"
                                    />
                                    <div className="text-white text-lg font-bold">
                                        <TextAmt
                                            number={estimatedReward}
                                            decimalClassName="text-stake-gray-500"
                                        />
                                    </div>
                                </div> */}
                            </div>
                            <div>
                                <CardTooltip
                                    content={
                                        <div>
                                            Amount of veASH that you’ll receive
                                            after stake
                                        </div>
                                    }
                                >
                                    <div className="inline-block text-ash-gray-500 text-xs underline mb-2">
                                        Your total veASH
                                    </div>
                                </CardTooltip>
                                <div
                                    className={`text-lg font-bold ${
                                        lockAmt.gt(0) || isExtend
                                            ? "text-ash-gray-500 line-through"
                                            : "text-white"
                                    }`}
                                >
                                    <TextAmt
                                        number={toEGLDD(VE_ASH_DECIMALS, veASH)}
                                        decimalClassName={`${
                                            lockAmt.gt(0) || isExtend
                                                ? ""
                                                : "text-stake-gray-500"
                                        }`}
                                    />
                                </div>
                                {(lockAmt.gt(0) || isExtend) && (
                                    <div className="flex items-start">
                                        <div className="text-white text-lg font-bold mr-6">
                                            <TextAmt
                                                number={toEGLDD(
                                                    VE_ASH_DECIMALS,
                                                    estimatedVeASH
                                                )}
                                                decimalClassName="text-stake-gray-500"
                                            />
                                        </div>
                                        <div className="text-ash-green-500 flex items-center text-2xs font-bold">
                                            <ICArrowTopRight className="mr-1.5" />
                                            <span>
                                                +
                                                {estimatedVeASH
                                                    .minus(veASH)
                                                    .multipliedBy(100)
                                                    .div(veASH)
                                                    .toFixed(2)}
                                                %
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <CardTooltip
                                    content={
                                        <div>
                                            Percentage of your veASH to the
                                            total veASH in ASHSWAP Governance
                                            Stake. It depends on the reward that
                                            you’ll receive.
                                        </div>
                                    }
                                >
                                    <div className="text-ash-gray-500 text-xs underline mb-2">
                                        Your share
                                    </div>
                                </CardTooltip>
                                <div
                                    className={`text-lg font-bold ${
                                        lockAmt.gt(0) || isExtend
                                            ? "text-ash-gray-500 line-through"
                                            : "text-white"
                                    }`}
                                >
                                    {currentCapacity}%
                                </div>
                                {(lockAmt.gt(0) || isExtend) && (
                                    <div className="flex items-start">
                                        <div className="text-white text-lg font-bold mr-6">
                                            {estimatedCapacity}%
                                        </div>
                                        {diffCapacity > 0 && (
                                            <div className="text-ash-green-500 flex items-center text-2xs font-bold">
                                                <ICArrowTopRight className="mr-1.5" />
                                                <span>
                                                    +{diffCapacity.toFixed(2)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div>
                                <CardTooltip
                                    content={
                                        <div>
                                            The time that your veASH becomes 0.
                                            You can claim back your staked ASH.
                                        </div>
                                    }
                                >
                                    <div className="text-ash-gray-500 text-xs underline mb-2">
                                        Unlock Time
                                    </div>
                                </CardTooltip>
                                <div
                                    className={`text-lg font-bold ${
                                        isExtend
                                            ? "text-ash-gray-500 line-through"
                                            : "text-white"
                                    }`}
                                >
                                    {moment
                                        .unix(unlockTS.toNumber())
                                        .format("DD MMM, yyyy")}
                                </div>
                                {isExtend && (
                                    <div className="text-white text-lg font-bold">
                                        {moment
                                            .unix(unlockTS.toNumber())
                                            .add(extendLockPeriod, "seconds")
                                            .format("DD MMM, yyyy")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sm:flex sm:space-x-8 lg:space-x-24">
                    <div className="w-full mb-12 sm:mb-0 sm:grow">
                        <span className="text-xs text-ash-gray-500">
                            Make sure you have read the{" "}
                            <a
                                href="https://docs.ashswap.io/testnet-guides/governance-staking"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <b className="text-white">
                                    <u>AshSwap Stake Guide</u>
                                </b>
                            </a>{" "}
                            and understood the associated risks.
                        </span>
                    </div>
                    <div className="w-full sm:w-1/3 lg:w-[17.8125rem] shrink-0">
                        <div className="border-notch-x border-notch-white/50">
                            <GlowingButton
                                theme="pink"
                                className={`clip-corner-1 clip-corner-tl w-full h-12 text-sm font-bold`}
                                disabled={!canStake}
                                onClick={() => canStake && lockMore()}
                            >
                                {insufficientEGLD ? (
                                    "INSUFFICIENT EGLD BALANCE"
                                ) : insufficientASH ? (
                                    "INSUFFICIENT ASH BALANCE"
                                ) : (
                                    <div className="flex items-center">
                                        <div className="mr-2">STAKE</div>
                                        <ICChevronRight className="w-2 h-auto" />
                                    </div>
                                )}
                            </GlowingButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
function StakeMoreModal({ open, onClose }: props) {
    const { isMobile } = useScreenSize();

    return (
        <>
            <BaseModal
                isOpen={open}
                onRequestClose={() => onClose()}
                type={`${isMobile ? "drawer_btt" : "modal"}`}
                className="bg-stake-dark-400 p-4 sm:ash-container flex flex-col max-h-[calc(100%-2.75rem)] sm:max-h-full"
            >
                <div className="flex justify-end mb-4">
                    <BaseModal.CloseBtn />
                </div>
                {open && (
                    <div className="grow overflow-auto">
                        <StakeMoreContent open={open} onClose={onClose} />
                    </div>
                )}
            </BaseModal>
        </>
    );
}

export default StakeMoreModal;
