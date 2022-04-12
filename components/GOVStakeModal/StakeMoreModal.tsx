import Checkbox from "components/Checkbox";
import HeadlessModal, {
    HeadlessModalDefaultHeader,
} from "components/HeadlessModal";
import InputCurrency from "components/InputCurrency";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LockPeriod from "./LockPeriod";
import ICChevronRight from "assets/svg/chevron-right.svg";
import ICArrowTopRight from "assets/svg/arrow-top-right.svg";
import moment from "moment";
import Switch from "components/Switch";
import { useScreenSize } from "hooks/useScreenSize";
import { useStakeGov } from "context/gov";
import { fractionFormat } from "helper/number";
import { toEGLDD, toWei } from "helper/balance";
import { ASH_TOKEN, VE_ASH_DECIMALS } from "const/tokens";
import { useWallet } from "context/wallet";
import BigNumber from "bignumber.js";
import { useOnboarding } from "hooks/useOnboarding";
import Tooltip from "components/Tooltip";
import useMediaQuery from "hooks/useMediaQuery";
type props = {
    open: boolean;
    onClose: () => void;
};
const EXTEND_OPTS = [
    // test purpose
    { value: 1 / 48, label: "30 minutes" },
    { value: 7, label: "+ 7 days" },
    { value: 30, label: "+ 30 days" },
    { value: 365, label: "+ 1 year" },
];
const MAX_LOCK = 4 * 365;
const maxLock = 4 * 365;
// test purpose - change back to 7
const minLock = 1 / 48;
const StakeMoreContent = ({ open, onClose }: props) => {
    const {
        lockedAmt,
        unlockTS,
        lockMoreASH,
        estimateVeASH,
        totalSupplyVeASH,
        veASH,
    } = useStakeGov();
    const { balances, insufficientEGLD } = useWallet();
    const ASHBalance = useMemo(() => balances[ASH_TOKEN.id], [balances]);
    const [lockAmt, setLockAmt] = useState<BigNumber>(new BigNumber(0));
    const [rawLockAmt, setRawLockAmt] = useState("");
    const currentLockDays = useMemo(() => {
        const current = moment
            .unix(unlockTS.toNumber())
            .endOf("days")
            .diff(moment().endOf("days"), "days");
        // test purpose
        const currentM =
            moment.unix(unlockTS.toNumber()).diff(moment(), "seconds") /
            (24 * 60 * 60);
        return currentM > 0 ? currentM : 0;
    }, [unlockTS]);
    const [extendLockPeriod, setExtendLockPeriod] = useState(minLock);
    const [isAgree, setIsAgree] = useState(false);
    const [isExtend, setIsExtend] = useState(false);
    const { isMobile } = useScreenSize();
    const isTouchScreen = useMediaQuery("(hover: none)");
    const [onboardingExtendPeriod, setOnboardedExtendPeriod] = useOnboarding(
        "stake_gov_extend_lock_time"
    );
    const [openOnboardingExtendTooltip, setOpenOnboardingExtendTooltip] =
        useState(false);
    const remaining = useMemo(() => {
        let years = Math.floor(currentLockDays / 365);
        let days = Math.floor(currentLockDays % 365);
        // test purpose
        let minutes = Math.ceil(((currentLockDays % 365) - days) * 24 * 60);
        const y = years ? `${years} ${years > 1 ? "years" : "year"}` : "";
        const d = days ? `${days} ${days > 1 ? "days" : "day"}` : "";
        // test purpose
        const m = minutes
            ? `${minutes} ${minutes > 1 ? "minutes" : "minute"}`
            : "";
        return [y, d, m].filter((s) => !!s).join(" ");
    }, [currentLockDays]);
    const extendOpts = useMemo(() => {
        const max = MAX_LOCK - currentLockDays;
        return [
            ...EXTEND_OPTS.filter((opt) => opt.value < max),
            { value: max, label: `max: ${max.toLocaleString("en-US")} days` },
        ];
    }, [currentLockDays]);
    const fLockedAmt = useMemo(() => {
        return fractionFormat(
            toEGLDD(ASH_TOKEN.decimals, lockedAmt).toNumber()
        );
    }, [lockedAmt]);
    useEffect(() => {
        if (currentLockDays === 0) {
            setIsExtend(true);
        }
    }, [currentLockDays]);
    const setMaxLockAmt = useCallback(() => {
        if (!ASHBalance) return;
        setLockAmt(ASHBalance.balance);
        setRawLockAmt(
            toEGLDD(ASH_TOKEN.decimals, ASHBalance.balance).toString(10)
        );
    }, [ASHBalance]);

    const insufficientASH = useMemo(() => {
        if (!ASHBalance) return true;
        return lockAmt.gt(ASHBalance.balance);
    }, [ASHBalance, lockAmt]);

    const canStake = useMemo(() => {
        return (
            !insufficientEGLD &&
            !insufficientASH &&
            isAgree &&
            (lockAmt.gt(0) ||
                (isExtend &&
                    extendLockPeriod >= minLock &&
                    extendLockPeriod + currentLockDays <= maxLock))
        );
    }, [
        insufficientEGLD,
        extendLockPeriod,
        isAgree,
        currentLockDays,
        lockAmt,
        isExtend,
        insufficientASH,
    ]);

    const lockMore = useCallback(async () => {
        await lockMoreASH({
            weiAmt: lockAmt,
            unlockTimestamp: isExtend
                ? extendLockPeriod === minLock
                    ? new BigNumber(
                          moment
                              .unix(unlockTS.toNumber())
                              .add(30, "minutes")
                              .unix()
                      )
                    : new BigNumber(
                          moment
                              .unix(unlockTS.toNumber())
                              .add(extendLockPeriod, "days")
                              .unix()
                      )
                : undefined,
        });
        if (onClose) {
            onClose();
        }
    }, [lockMoreASH, isExtend, extendLockPeriod, unlockTS, lockAmt, onClose]);

    const estimatedVeASH = useMemo(() => {
        if (isExtend) {
            return estimateVeASH(
                lockedAmt.plus(lockAmt),
                extendLockPeriod + currentLockDays
            );
        }
        return estimateVeASH(
            lockedAmt.plus(lockAmt),
            currentLockDays + 7 / (24 * 60 * 60)
        );
    }, [
        estimateVeASH,
        extendLockPeriod,
        lockedAmt,
        lockAmt,
        currentLockDays,
        isExtend,
    ]);
    const fEstimatedVeASH = useMemo(() => {
        const num = toEGLDD(VE_ASH_DECIMALS, estimatedVeASH).toNumber();
        return num === 0
            ? "_"
            : fractionFormat(num, { maximumFractionDigits: num < 1 ? 8 : 2 });
    }, [estimatedVeASH]);
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
    const fVeASH = useMemo(() => {
        const num = toEGLDD(VE_ASH_DECIMALS, veASH).toNumber();
        return num === 0
            ? "0"
            : fractionFormat(num, { maximumFractionDigits: num < 1 ? 8 : 2 });
    }, [veASH]);
    useEffect(() => {
        if (isTouchScreen) {
            setOpenOnboardingExtendTooltip(true);
        }
    }, [isTouchScreen]);
    return (
        <>
            <div className="mt-4 px-6 lg:px-20 pb-12 overflow-auto relative">
                <div className="text-pink-600 text-2xl font-bold mb-9 lg:mb-14">
                    Manage Your Governance Stake
                </div>
                <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-24">
                    <div className="flex flex-col flex-grow mb-16 lg:mb-0">
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
                                        {ASHBalance
                                            ? toEGLDD(
                                                  ASH_TOKEN.decimals,
                                                  ASHBalance.balance
                                              ).toFixed(2)
                                            : "_"}{" "}
                                        {ASH_TOKEN.name}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4 flex items-center">
                                    <div className="mr-1">Current</div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-pink-600 rounded-full mr-1"></div>
                                        <div>{ASH_TOKEN.name} Staked</div>
                                    </div>
                                </div>
                                <div className="bg-stake-dark-500 h-14 lg:h-18 px-6 flex items-center justify-end text-ash-gray-500">
                                    <div className="text-right text-sm lg:text-lg">
                                        {fLockedAmt}
                                    </div>
                                </div>
                                <div className="text-right text-2xs lg:text-xs mt-2 text-ash-gray-500">
                                    <span>Total stake: </span>
                                    <span>
                                        {toEGLDD(
                                            ASH_TOKEN.decimals,
                                            lockedAmt.plus(lockAmt)
                                        ).toString(10)}{" "}
                                        ASH
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-16 lg:mb-11">
                            <div className="text-ash-gray-500 text-sm font-bold underline mb-2 lg:mb-4">
                                Current lock period
                            </div>
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
                            {currentLockDays > 0 ? (
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
                                        <span className="ml-3 text-ash-gray-500 text-sm font-bold underline">
                                            I want to extend my lock period!
                                        </span>
                                    </Switch>
                                </div>
                            ) : (
                                <span className="text-ash-gray-500 text-sm font-bold underline">
                                    Extend lock period
                                </span>
                            )}
                            {isExtend && (
                                <Tooltip
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
                                            lockDay={
                                                extendLockPeriod +
                                                currentLockDays
                                            }
                                            min={currentLockDays + minLock}
                                            max={MAX_LOCK}
                                            options={extendOpts.map((opt) => ({
                                                ...opt,
                                                value:
                                                    opt.value + currentLockDays,
                                            }))}
                                            lockDayChange={(val) =>
                                                setExtendLockPeriod(
                                                    val - currentLockDays
                                                )
                                            }
                                        />
                                        {/* <div className="mt-4 flex space-x-2">
                                                {extendOpts.map((opt, i) => {
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            className={`border border-ash-gray-500 bg-ash-gray-500/10 h-11 lg:h-12 flex items-center justify-center px-1 text-ash-gray-500 text-xs lg:text-sm ${i === extendOpts.length - 1 ? "flex-grow" : "w-24"}`}
                                                            onClick={() => setExtendLockPeriod(opt.value)}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    );
                                                })}
                                            </div> */}
                                    </div>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <div className="w-full sm:w-1/3 lg:w-[17.8125rem] flex-shrink-0 bg-stake-dark-500 py-[2.375rem] px-10 sm:px-4 lg:px-10">
                        <div className="text-white text-lg font-bold mb-16">
                            Estimate Staking
                        </div>
                        <div className="flex flex-col space-y-11">
                            <div>
                                <div className="text-ash-gray-500 text-xs underline mb-2">
                                    Your total veASH
                                </div>
                                <div
                                    className={`text-lg font-bold ${
                                        lockAmt.gt(0) || isExtend
                                            ? "text-ash-gray-500 line-through"
                                            : "text-white"
                                    }`}
                                >
                                    {fVeASH}
                                </div>
                                {(lockAmt.gt(0) || isExtend) && (
                                    <div className="flex items-start">
                                        <div className="text-white text-lg font-bold mr-6">
                                            {fEstimatedVeASH}
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
                                <div className="text-ash-gray-500 text-xs underline mb-2">
                                    Your capacity
                                </div>
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
                                <div className="text-ash-gray-500 text-xs underline mb-2">
                                    Unlock Time
                                </div>
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
                                            .add(extendLockPeriod, "days")
                                            .format("DD MMM, yyyy")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sm:flex sm:space-x-8 lg:space-x-24">
                    <div className="w-full mb-12 sm:mb-0 sm:flex-grow">
                        <Checkbox
                            checked={isAgree}
                            onChange={setIsAgree}
                            text={
                                <span className="text-ash-gray-500">
                                    I verify that I have read the{" "}
                                    <a
                                        href="https://docs.ashswap.io/testnet-guides/governance-staking"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <b className="text-white">
                                            <u>AshSwap Stake Guide</u>
                                        </b>
                                    </a>{" "}
                                    and understand the risks of providing
                                    liquidity, including impermanent loss.
                                </span>
                            }
                        />
                    </div>
                    <div className="w-full sm:w-1/3 lg:w-[17.8125rem] flex-shrink-0">
                        <div className="border-notch">
                            <button
                                className={`clip-corner-1 clip-corner-tl transition w-full h-12 flex items-center justify-center text-sm font-bold text-white ${
                                    canStake ? "bg-pink-600" : "bg-ash-dark-500"
                                }`}
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
                            </button>
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
            <HeadlessModal
                open={open}
                onClose={() => onClose()}
                transition={`${isMobile ? "btt" : "center"}`}
            >
                <div className="bg-stake-dark-400 p-4 fixed bottom-0 inset-x-0 sm:static sm:mt-28 sm:ash-container flex flex-col max-h-[calc(100%-2.75rem)] sm:max-h-full">
                    <HeadlessModalDefaultHeader onClose={() => onClose()} />
                    <StakeMoreContent open={open} onClose={onClose} />
                </div>
            </HeadlessModal>
        </>
    );
}

export default StakeMoreModal;
