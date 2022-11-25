import { Slider } from "antd";
import ICChevronRight from "assets/svg/chevron-right.svg";
import { accIsInsufficientEGLDState } from "atoms/dappState";
import { govTotalSupplyVeASH } from "atoms/govState";
import { tokenMapState } from "atoms/tokensState";
import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import BaseModal from "components/BaseModal";
import Checkbox from "components/Checkbox";
import GlowingButton from "components/GlowingButton";
import InputCurrency from "components/InputCurrency";
import TextAmt from "components/TextAmt";
import CardTooltip from "components/Tooltip/CardTooltip";
import OnboardTooltip from "components/Tooltip/OnboardTooltip";
import { ENVIRONMENT } from "const/env";
import { ASH_TOKEN, VE_ASH_DECIMALS } from "const/tokens";
import { VE_LOCK_LABEL } from "const/ve";
import { toEGLD, toEGLDD, toWei } from "helper/balance";
import { estimateVeASH } from "helper/voteEscrow";
import useGovLockASH from "hooks/useGovContract/useGovLockASH";
import useMediaQuery from "hooks/useMediaQuery";
import { useOnboarding } from "hooks/useOnboarding";
import { useScreenSize } from "hooks/useScreenSize";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { theme } from "tailwind.config";
import LockPeriod, { lockPeriodFormater } from "./LockPeriod";
type props = {
    open: boolean;
    onClose: () => void;
};
// for BoY
const LOCK_CONFIG_BOY = {
    predefinedLockPeriod: [
        // ENVIRONMENT.ENV === "alpha"
        { value: 12 * 60 * 60, label: "12 hours" },
        { value: 24 * 60 * 60, label: "1 day" },
        { value: 3 * 24 * 60 * 60, label: "3 days" },
        { value: 1 * 7 * 24 * 60 * 60, label: "1 week" },
        { value: 2 * 7 * 24 * 60 * 60, label: "2 weeks" },
    ],
    maxLock: 2 * 7 * 24 * 60 * 60,
    minLock: 12 * 60 * 60,
    sliderStep: 12 * 60 * 60,
};
const LOCK_CONFIG_MAIN = {
    predefinedLockPeriod: [
        { value: 7 * 24 * 60 * 60, label: "1 week" },
        { value: 4 * 7 * 24 * 60 * 60, label: "4 weeks" },
        { value: 1 * 365 * 24 * 60 * 60, label: "1 year" },
        { value: 2 * 365 * 24 * 60 * 60, label: "2 years" },
        { value: 3 * 365 * 24 * 60 * 60, label: "3 years" },
        { value: 4 * 365 * 24 * 60 * 60, label: "4 years" },
    ],
    maxLock: 4 * 365 * 24 * 60 * 60,
    minLock: 7 * 24 * 60 * 60,
    sliderStep: 24 * 60 * 60,
};
const LOCK_CONFIG = LOCK_CONFIG_MAIN;
const FirstStakeContent = ({ open, onClose }: props) => {
    const tokenMap = useRecoilValue(tokenMapState);
    const insufficientEGLD = useRecoilValue(accIsInsufficientEGLDState);
    const totalSupplyVeASH = useRecoilValue(govTotalSupplyVeASH);
    const { createLock: lockASH } = useGovLockASH();
    const [lockPeriod, setLockPeriod] = useState(LOCK_CONFIG.minLock); // in seconds
    const [isAgree, setIsAgree] = useState(false);
    const ASHBalance = useMemo(
        () => new BigNumber(tokenMap[ASH_TOKEN.identifier]?.balance || 0),
        [tokenMap]
    );
    const [lockAmt, setLockAmt] = useState<BigNumber>(new BigNumber(0));
    const [rawLockAmt, setRawLockAmt] = useState("");
    const [onboardingStakeGov, setOnboardedStakeGov] =
        useOnboarding("stake_gov_1st");
    const [openOnboardStakeTooltip, setOpenOnboardTooltip] = useState(false);
    const isTouchScreen = useMediaQuery("(hover: none)");
    const screenSize = useScreenSize();

    const setMaxLockAmt = useCallback(() => {
        setLockAmt(ASHBalance);
        setRawLockAmt(toEGLD(ASH_TOKEN, ASHBalance.toString()).toString(10));
    }, [ASHBalance]);
    const insufficientASH = useMemo(() => {
        if (!ASHBalance) return true;
        return lockAmt.gt(ASHBalance);
    }, [ASHBalance, lockAmt]);
    const canStake = useMemo(() => {
        return (
            !insufficientEGLD &&
            !insufficientASH &&
            lockAmt.gt(0) &&
            lockPeriod >= LOCK_CONFIG.minLock &&
            lockPeriod <= LOCK_CONFIG.maxLock &&
            isAgree
        );
    }, [insufficientEGLD, lockAmt, lockPeriod, isAgree, insufficientASH]);
    const lock = useCallback(async () => {
        const { sessionId, error } = await lockASH(
            lockAmt,
            new BigNumber(moment().add(lockPeriod, "seconds").unix())
        );
        if (sessionId) onClose?.();
    }, [lockASH, lockAmt, lockPeriod, onClose]);
    const estimatedVeASH = useMemo(() => {
        return estimateVeASH(lockAmt, lockPeriod);
    }, [lockPeriod, lockAmt]);
    const estimateCapacity = useMemo(() => {
        if (estimatedVeASH.eq(0)) return "0";
        const pct = estimatedVeASH
            .multipliedBy(100)
            .div(totalSupplyVeASH.plus(estimatedVeASH));
        return pct.lt(0.01) ? "< 0.01" : pct.toFixed(2);
    }, [estimatedVeASH, totalSupplyVeASH]);
    useEffect(() => {
        if (isTouchScreen) {
            setOpenOnboardTooltip(true);
        }
    }, [isTouchScreen]);
    return (
        <>
            <div className="px-6 lg:px-20 pb-12 overflow-auto relative">
                <div className="text-pink-600 text-2xl font-bold mb-9 lg:mb-14">
                    Governance Stake
                </div>
                <div className="sm:flex sm:space-x-8 lg:space-x-24 mb-24">
                    <div className="flex flex-col grow mb-16 lg:mb-0">
                        <div className="w-full flex sm:grid sm:grid-cols-2 sm:gap-x-4 lg:gap-x-7.5 mb-12">
                            <div className="w-1/3 sm:w-auto mr-5 sm:mr-0">
                                <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                    Token
                                </div>
                                <div className="bg-ash-dark-400/30 h-14 lg:h-18 px-4 lg:px-7 flex items-center">
                                    <Avatar
                                        src={ASH_TOKEN.logoURI}
                                        alt={ASH_TOKEN.symbol}
                                        className="w-3.5 h-3.5 lg:w-7 lg:h-7 mr-3"
                                    />
                                    <div className="text-white text-sm lg:text-lg font-bold">
                                        {ASH_TOKEN.symbol}
                                    </div>
                                </div>
                            </div>
                            <div className="w-2/3 sm:w-auto">
                                <div className="text-ash-gray-500 text-xs lg:text-sm font-bold mb-2 lg:mb-4">
                                    Input Amount
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
                                        />{" "}
                                        {ASH_TOKEN.symbol}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <OnboardTooltip
                            open={onboardingStakeGov && openOnboardStakeTooltip}
                            onOpenChange={(val) =>
                                val && setOpenOnboardTooltip(onboardingStakeGov)
                            }
                            onArrowClick={() => {
                                if (openOnboardStakeTooltip) {
                                    setOpenOnboardTooltip(false);
                                    setOnboardedStakeGov(true);
                                }
                            }}
                            strategy={
                                screenSize.isMobile ? "absolute" : "fixed"
                            }
                            placement="bottom"
                            arrowStyle={() => ({ left: 56 })}
                            content={
                                <div
                                    style={{
                                        filter: screenSize.isMobile
                                            ? ""
                                            : "drop-shadow(0px 4px 50px rgba(0, 0, 0, 0.5))",
                                    }}
                                >
                                    <div className="clip-corner-4 clip-corner-bl bg-ash-dark-600 p-[1px] max-w-full sm:max-w-[23rem] backdrop-blur-[30px] sm:mx-6">
                                        <div className="clip-corner-4 clip-corner-bl bg-ash-dark-400 px-12 pt-14 pb-11">
                                            <div className="font-bold text-lg leading-tight mb-8">
                                                You cannot claim back your ASH
                                                until the lock duration ends.
                                            </div>
                                            <ul>
                                                {VE_LOCK_LABEL.map((lock) => {
                                                    return (
                                                        <li
                                                            key={lock.amt}
                                                            className="text-sm font-bold"
                                                        >
                                                            <span className="text-stake-green-500">
                                                                1
                                                            </span>{" "}
                                                            ASH locked for{" "}
                                                            <span className="text-stake-green-500">
                                                                {lock.label}
                                                            </span>{" "}
                                                            ={" "}
                                                            <span className="text-stake-green-500">
                                                                {lock.amt}
                                                            </span>{" "}
                                                            veASH
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            }
                        >
                            <div>
                                <CardTooltip
                                    content={
                                        <div>
                                            Your lock period. When this period
                                            ends, you can claim back your staked
                                            ASH.
                                        </div>
                                    }
                                >
                                    <div className="inline-block text-sm underline font-bold text-ash-gray-500 mb-4">
                                        Lock period
                                    </div>
                                </CardTooltip>

                                <LockPeriod
                                    lockSeconds={lockPeriod}
                                    min={LOCK_CONFIG.minLock}
                                    max={LOCK_CONFIG.maxLock}
                                    options={LOCK_CONFIG.predefinedLockPeriod}
                                    lockSecondsChange={(val) =>
                                        setLockPeriod(
                                            val > 0 ? val : LOCK_CONFIG.minLock
                                        )
                                    }
                                />
                                <div className="overflow-hidden mt-8">
                                    <Slider
                                        className="ash-slider ash-slider-pink my-0"
                                        step={LOCK_CONFIG.sliderStep}
                                        marks={{
                                            [LOCK_CONFIG.minLock]: "",
                                            [(LOCK_CONFIG.maxLock -
                                                LOCK_CONFIG.minLock) /
                                                4 +
                                            LOCK_CONFIG.minLock]: "",
                                            [(LOCK_CONFIG.maxLock -
                                                LOCK_CONFIG.minLock) /
                                                2 +
                                            LOCK_CONFIG.minLock]: "",
                                            [((LOCK_CONFIG.maxLock -
                                                LOCK_CONFIG.minLock) *
                                                3) /
                                                4 +
                                            LOCK_CONFIG.minLock]: "",
                                            [LOCK_CONFIG.maxLock]: "",
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
                                        min={LOCK_CONFIG.minLock}
                                        max={LOCK_CONFIG.maxLock}
                                        value={lockPeriod}
                                        tipFormatter={(val) =>
                                            val &&
                                            lockPeriodFormater(val * 1000)
                                        }
                                        onChange={(e) => setLockPeriod(e)}
                                    />
                                    <div className="flex justify-between mt-1">
                                        <div className="text-xs lg:text-sm font-bold text-white">
                                            {lockPeriodFormater(
                                                LOCK_CONFIG.minLock * 1000
                                            )}
                                        </div>
                                        <div className="text-xs lg:text-sm font-bold text-pink-600">
                                            {lockPeriodFormater(
                                                LOCK_CONFIG.maxLock * 1000
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </OnboardTooltip>
                    </div>
                    <div className="w-full sm:w-1/3 lg:w-[17.8125rem] shrink-0 bg-stake-dark-500 py-[2.375rem] px-10">
                        <div className="text-white text-lg font-bold mb-16">
                            Estimate Staking
                        </div>
                        <div className="flex flex-col space-y-11">
                            <div>
                                <CardTooltip
                                    content={
                                        <div>
                                            Amount of veASH that you’ll receive
                                            after stake.
                                        </div>
                                    }
                                >
                                    <div className="inline-block text-stake-gray-500 text-xs underline mb-2">
                                        VeASH Receive
                                    </div>
                                </CardTooltip>

                                <div className="text-white text-lg font-bold">
                                    <TextAmt
                                        number={toEGLDD(
                                            VE_ASH_DECIMALS,
                                            estimatedVeASH
                                        )}
                                        decimalClassName="text-stake-gray-500"
                                    />
                                </div>
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
                                    <div className="inline-block text-stake-gray-500 text-xs underline mb-2">
                                        Your capacity
                                    </div>
                                </CardTooltip>

                                <div className="text-white text-lg font-bold">
                                    {estimateCapacity}%
                                </div>
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
                                    <div className="inline-block text-stake-gray-500 text-xs underline mb-2">
                                        Unlock Time
                                    </div>
                                </CardTooltip>

                                <div className="text-white text-lg font-bold min-h-[3rem]">
                                    {moment()
                                        .add(lockPeriod, "seconds")
                                        .format("DD MMM, yyyy")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sm:flex sm:space-x-8 lg:space-x-24">
                    <div className="w-full mb-12 sm:mb-0 sm:grow">
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
                    <div className="w-full sm:w-[17.8125rem] shrink-0">
                        <div className="border-notch-x border-notch-white/50">
                            <GlowingButton
                                theme="pink"
                                className={`clip-corner-1 clip-corner-tl transition w-full h-12 flex items-center justify-center text-sm font-bold text-white`}
                                disabled={!canStake}
                                onClick={() => canStake && lock()}
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
function FirstStakeModal({ open, onClose }: props) {
    const { isMobile } = useScreenSize();
    return (
        <>
            <BaseModal
                isOpen={open}
                onRequestClose={() => onClose()}
                type={`${isMobile ? "drawer_btt" : "modal"}`}
                className="bg-stake-dark-400 p-4 w-screen max-w-[70rem] sm:mx-auto flex flex-col max-h-full"
            >
                <div className="flex justify-end mb-4">
                    <BaseModal.CloseBtn />
                </div>
                {open && (
                    <div className="grow overflow-auto">
                        <FirstStakeContent open={open} onClose={onClose} />
                    </div>
                )}
            </BaseModal>
        </>
    );
}

export default FirstStakeModal;
